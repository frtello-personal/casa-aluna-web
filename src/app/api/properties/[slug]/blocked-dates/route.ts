import { NextResponse } from 'next/server';
import { getBlockedDates } from '@/lib/availability/blocked-dates';
import { maybeSyncFromAirbnb } from '@/lib/ical/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/properties/[slug]/blocked-dates
 *
 * Devuelve los bloqueos de fechas (airbnb + manual + booking) de una propiedad.
 * Endpoint público de solo lectura, usado por el calendario de la página principal.
 *
 * Antes de responder, sincroniza bajo demanda con Airbnb (foreground) si la última
 * sincronización tiene más de `ICAL_SYNC_MAX_AGE_MINUTES` minutos (default 60).
 * Así el calendario siempre devuelve datos frescos sin depender de un cron.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  let synced = false;
  try {
    const sync = await maybeSyncFromAirbnb(slug);
    synced = sync.synced;
  } catch (error) {
    // Un fallo de sync no debe impedir mostrar la disponibilidad ya almacenada.
    console.error('[api/properties/blocked-dates] Sync on-demand falló', error);
  }

  try {
    const blockedDates = await getBlockedDates(slug);
    return NextResponse.json({ ok: true, synced, blockedDates });
  } catch (error) {
    // Loguear el detalle solo en el servidor; no exponerlo al cliente.
    console.error('[api/properties/blocked-dates] Error', error);
    return NextResponse.json(
      { ok: false, error: 'No se pudo obtener la disponibilidad.' },
      { status: 500 },
    );
  }
}
