import { NextResponse, type NextRequest } from 'next/server';
import { importAirbnbCalendar } from '@/lib/ical/import';
import { findPropertyBySlug } from '@/lib/availability/blocked-dates';
import { createAdminClient } from '@/lib/supabase/admin';

// El sync siempre debe ejecutarse en runtime Node (node-ical + fetch sin caché).
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Slug de la propiedad a sincronizar. */
const PROPERTY_SLUG = 'casa-aluna';

/**
 * Verifica la autenticación del endpoint (fail-closed).
 * Acepta, en este orden:
 *  - `Authorization: Bearer <CRON_SECRET>` (header que Vercel Cron envía automáticamente
 *    cuando existe la variable de entorno CRON_SECRET).
 *  - header `x-sync-api-key: <SYNC_API_KEY>` (para cron externo / disparos manuales).
 *  - `Authorization: Bearer <SYNC_API_KEY>`.
 * Si no hay ninguna de las dos keys configuradas, se DENIEGA el acceso por seguridad.
 */
function isAuthorized(request: NextRequest): boolean {
  const syncApiKey = process.env.SYNC_API_KEY;
  const cronSecret = process.env.CRON_SECRET;

  if (!syncApiKey && !cronSecret) {
    console.error('[sync/airbnb] Ni SYNC_API_KEY ni CRON_SECRET están configuradas — acceso denegado');
    return false;
  }

  const auth = request.headers.get('authorization');
  const headerKey = request.headers.get('x-sync-api-key');

  if (cronSecret && auth === `Bearer ${cronSecret}`) return true;
  if (syncApiKey && headerKey === syncApiKey) return true;
  if (syncApiKey && auth === `Bearer ${syncApiKey}`) return true;

  return false;
}

/**
 * POST /api/sync/airbnb
 *
 * Dispara una sincronización manual (o vía cron) del calendario iCal de Airbnb
 * hacia `blocked_dates`. Requiere el header de autenticación si `SYNC_API_KEY` está definida.
 */
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: 'No autorizado' }, { status: 401 });
  }

  const startedAt = new Date().toISOString();

  try {
    const supabase = createAdminClient();
    const property = await findPropertyBySlug(supabase, PROPERTY_SLUG);
    if (!property) {
      console.error('[sync/airbnb] Propiedad no encontrada:', PROPERTY_SLUG);
      return NextResponse.json(
        { ok: false, error: 'Propiedad no encontrada.' },
        { status: 404 },
      );
    }

    if (!property.airbnb_ical_url) {
      return NextResponse.json(
        { ok: false, error: 'La propiedad no tiene una URL iCal configurada.' },
        { status: 400 },
      );
    }

    const result = await importAirbnbCalendar(property.airbnb_ical_url, property.id);

    console.log('[sync/airbnb] Sync completado', { startedAt, ...result });

    return NextResponse.json({
      ok: true,
      property: PROPERTY_SLUG,
      startedAt,
      finishedAt: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    // Loguear el detalle solo en el servidor; no exponerlo al cliente.
    console.error('[sync/airbnb] Sync falló', error);
    return NextResponse.json(
      { ok: false, error: 'No se pudo completar la sincronización.' },
      { status: 500 },
    );
  }
}

/** GET para permitir disparos simples desde el navegador/cron-job.org (misma lógica). */
export async function GET(request: NextRequest) {
  return POST(request);
}
