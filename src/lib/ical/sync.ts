import { createAdminClient } from '@/lib/supabase/admin';
import { importAirbnbCalendar, type SyncResult } from './import';
import { findPropertyBySlug } from '@/lib/availability/blocked-dates';

/** Resultado de un intento de sincronización bajo demanda. */
export interface MaybeSyncResult {
  /** true si se ejecutó realmente el sync con Airbnb. */
  synced: boolean;
  /** Motivo cuando no se sincronizó. */
  reason?: 'fresh' | 'no-ical-url' | 'property-not-found' | 'already-running';
  /** Detalle del sync cuando `synced` es true. */
  result?: SyncResult;
}

/** Minutos por defecto antes de considerar la sincronización "obsoleta". */
const DEFAULT_MAX_AGE_MINUTES = 60;

/**
 * Lock en memoria para evitar que dos requests simultáneas disparen syncs
 * duplicados para la misma propiedad. En serverless cada instancia tiene su
 * propio lock; el upsert es idempotente, así que un solape ocasional no corrompe datos.
 */
const inFlight = new Set<string>();

/**
 * Lee los minutos de frescura desde la env var, con fallback al default.
 */
function getMaxAgeMinutes(): number {
  const raw = process.env.ICAL_SYNC_MAX_AGE_MINUTES;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_AGE_MINUTES;
}

/**
 * Sincroniza el calendario de Airbnb bajo demanda (foreground).
 *
 * Comportamiento:
 *  - Si la propiedad no existe o no tiene URL iCal, no hace nada.
 *  - Si `last_sync_at` es más reciente que `ICAL_SYNC_MAX_AGE_MINUTES`, no sincroniza.
 *  - En caso contrario, ejecuta el import y actualiza `last_sync_at`.
 *
 * @param propertySlug Slug público de la propiedad.
 * @returns Detalle de si se sincronizó y el resultado.
 */
export async function maybeSyncFromAirbnb(propertySlug: string): Promise<MaybeSyncResult> {
  const supabase = createAdminClient();

  const property = await findPropertyBySlug(supabase, propertySlug);
  if (!property) {
    return { synced: false, reason: 'property-not-found' };
  }

  if (!property.airbnb_ical_url) {
    return { synced: false, reason: 'no-ical-url' };
  }

  // Evitar syncs duplicados concurrentes para la misma propiedad.
  if (inFlight.has(property.id)) {
    return { synced: false, reason: 'already-running' };
  }

  // ¿Está fresca la última sincronización?
  const { data: syncRow, error: syncError } = await supabase
    .from('properties')
    .select('last_sync_at')
    .eq('id', property.id)
    .single();

  if (syncError) {
    console.error('[ical/sync] Error al leer last_sync_at', syncError);
  }

  const lastSyncAt = syncRow?.last_sync_at ? new Date(syncRow.last_sync_at as string) : null;
  const maxAgeMs = getMaxAgeMinutes() * 60 * 1000;
  const isFresh = lastSyncAt !== null && Date.now() - lastSyncAt.getTime() < maxAgeMs;

  if (isFresh) {
    return { synced: false, reason: 'fresh' };
  }

  inFlight.add(property.id);
  try {
    const result = await importAirbnbCalendar(property.airbnb_ical_url, property.id);

    const { error: updateError } = await supabase
      .from('properties')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', property.id);

    if (updateError) {
      console.error('[ical/sync] Error al actualizar last_sync_at', updateError);
    }

    console.log('[ical/sync] Sync on-demand completado', { property: propertySlug, ...result });
    return { synced: true, result };
  } finally {
    inFlight.delete(property.id);
  }
}
