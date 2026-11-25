import { createAdminClient } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';

/** Fuente de un bloqueo de fechas. */
export type BlockedDateSource = 'airbnb' | 'manual' | 'booking';

/** Bloqueo de fechas tal como lo consume la UI. */
export interface BlockedDate {
  id: string;
  property_id: string;
  /** Fecha de inicio inclusiva, formato YYYY-MM-DD. */
  start_date: string;
  /** Fecha de fin exclusiva, formato YYYY-MM-DD. */
  end_date: string;
  source: BlockedDateSource;
  reason: string | null;
}

/** Propiedad mínima necesaria para las consultas de disponibilidad. */
export interface PropertyLookup {
  id: string;
  airbnb_ical_url: string | null;
}

/**
 * Normaliza un slug para comparaciones tolerantes:
 * minúsculas, sin espacios ni guiones. Ej: "Casa Aluna" -> "casaaluna".
 */
function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/[\s-]+/g, '');
}

/**
 * Busca una propiedad por slug de forma tolerante (case-insensitive, ignorando
 * espacios y guiones), ya que en la BD el slug puede estar como "Casa Aluna"
 * mientras las rutas públicas usan "casa-aluna".
 */
export async function findPropertyBySlug(
  supabase: SupabaseClient,
  propertySlug: string,
): Promise<PropertyLookup | null> {
  const target = normalizeSlug(propertySlug);

  const { data, error } = await supabase
    .from('properties')
    .select('id, slug, airbnb_ical_url');

  if (error || !data) {
    console.error('[availability] Error al listar propiedades', error);
    return null;
  }

  const match = (data as Array<{ id: string; slug: string; airbnb_ical_url: string | null }>).find(
    (p) => normalizeSlug(p.slug) === target,
  );

  if (!match) {
    console.error('[availability] No se encontró la propiedad con slug normalizado', target);
    return null;
  }

  return { id: match.id, airbnb_ical_url: match.airbnb_ical_url };
}

/**
 * Devuelve todos los bloqueos de fechas de una propiedad (por slug).
 * Pensado para Server Components / Route Handlers.
 */
export async function getBlockedDates(propertySlug: string): Promise<BlockedDate[]> {
  const supabase = createAdminClient();

  const property = await findPropertyBySlug(supabase, propertySlug);
  if (!property) return [];

  const { data, error } = await supabase
    .from('blocked_dates')
    .select('id, property_id, start_date, end_date, source, reason')
    .eq('property_id', property.id)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('[availability] Error al leer blocked_dates', error);
    return [];
  }

  return (data ?? []) as BlockedDate[];
}

/**
 * Devuelve la URL iCal de Airbnb configurada para una propiedad (por slug).
 */
export async function getAirbnbIcalUrl(propertySlug: string): Promise<string | null> {
  const supabase = createAdminClient();
  const property = await findPropertyBySlug(supabase, propertySlug);
  return property?.airbnb_ical_url ?? null;
}

