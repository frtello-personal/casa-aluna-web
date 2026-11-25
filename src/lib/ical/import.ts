import { createAdminClient } from '@/lib/supabase/admin';
import { parseIcal } from './parser';
import { icalUidToUuid } from './uid';

/** Resumen de una ejecución de sincronización. */
export interface SyncResult {
  /** Bloqueos nuevos insertados. */
  added: number;
  /** Bloqueos de Airbnb eliminados por ya no existir en el iCal. */
  removed: number;
  /** Bloqueos de Airbnb que se mantienen sin cambios. */
  kept: number;
  /** Total de eventos válidos leídos del iCal. */
  total: number;
  /** Mensajes de error no fatales (p. ej. un evento con fecha inválida). */
  errors: string[];
}

interface ExistingBlockedDate {
  id: string;
  source_id: string | null;
}

/**
 * Descarga y procesa el calendario iCal público de Airbnb, sincronizando la tabla
 * `blocked_dates` (source = 'airbnb') para la propiedad indicada.
 *
 * Estrategia de sincronización (unidireccional Airbnb -> Casa Aluna):
 *  1. Fetch del iCal desde la URL pública.
 *  2. Parse de los VEVENT a rangos de fechas.
 *  3. Upsert de cada evento usando `source_id` = UUID v5 derivado del UID del iCal.
 *  4. Eliminación de los bloqueos 'airbnb' cuyo `source_id` ya no aparece en el iCal.
 *
 * Los bloqueos con source 'manual' o 'booking' NO se tocan.
 *
 * @param icalUrl URL pública del calendario iCal de Airbnb.
 * @param propertyId UUID de la propiedad en Supabase.
 */
export async function importAirbnbCalendar(
  icalUrl: string,
  propertyId: string,
): Promise<SyncResult> {
  const result: SyncResult = { added: 0, removed: 0, kept: 0, total: 0, errors: [] };

  if (!icalUrl) {
    throw new Error('La propiedad no tiene configurada una URL iCal de Airbnb.');
  }

  // 1. Fetch del iCal
  let icalBody: string;
  try {
    const response = await fetch(icalUrl, {
      headers: { Accept: 'text/calendar, text/plain, */*' },
      // El iCal de Airbnb cambia con frecuencia; nunca cachear.
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    icalBody = await response.text();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`No se pudo descargar el iCal de Airbnb: ${message}`);
  }

  // 2. Parse
  const events = parseIcal(icalBody);
  result.total = events.length;

  const supabase = createAdminClient();

  // 3. Construir filas a upsert (deduplicando por source_id)
  const rowsBySourceId = new Map<
    string,
    {
      property_id: string;
      start_date: string;
      end_date: string;
      source: 'airbnb';
      source_id: string;
      reason: string | null;
    }
  >();

  for (const event of events) {
    if (event.endDate <= event.startDate) {
      result.errors.push(`Evento ${event.uid} con rango inválido (${event.startDate} -> ${event.endDate}).`);
      continue;
    }
    const sourceId = icalUidToUuid(event.uid);
    rowsBySourceId.set(sourceId, {
      property_id: propertyId,
      start_date: event.startDate,
      end_date: event.endDate,
      source: 'airbnb',
      source_id: sourceId,
      reason: event.summary ?? null,
    });
  }

  const rows = Array.from(rowsBySourceId.values());
  const incomingSourceIds = new Set(rowsBySourceId.keys());

  // 4. Leer bloqueos de Airbnb existentes para esta propiedad
  const { data: existing, error: existingError } = await supabase
    .from('blocked_dates')
    .select('id, source_id')
    .eq('property_id', propertyId)
    .eq('source', 'airbnb');

  if (existingError) {
    throw new Error(`Error al leer blocked_dates existentes: ${existingError.message}`);
  }

  const existingRows = (existing ?? []) as ExistingBlockedDate[];
  const existingBySourceId = new Map<string, ExistingBlockedDate>();
  for (const row of existingRows) {
    if (row.source_id) existingBySourceId.set(row.source_id, row);
  }

  // 5. Upsert de los eventos entrantes
  if (rows.length > 0) {
    const { error: upsertError } = await supabase
      .from('blocked_dates')
      .upsert(rows, { onConflict: 'property_id,source,source_id' });

    if (upsertError) {
      throw new Error(`Error al sincronizar blocked_dates: ${upsertError.message}`);
    }
  }

  // 6. Eliminar los que ya no existen en el iCal
  const toRemoveIds = existingRows
    .filter((row) => !row.source_id || !incomingSourceIds.has(row.source_id))
    .map((row) => row.id);

  if (toRemoveIds.length > 0) {
    const { error: deleteError } = await supabase
      .from('blocked_dates')
      .delete()
      .in('id', toRemoveIds);

    if (deleteError) {
      throw new Error(`Error al eliminar blocked_dates obsoletos: ${deleteError.message}`);
    }
  }

  // 7. Calcular resumen
  for (const sourceId of incomingSourceIds) {
    if (existingBySourceId.has(sourceId)) {
      result.kept += 1;
    } else {
      result.added += 1;
    }
  }
  result.removed = toRemoveIds.length;

  return result;
}
