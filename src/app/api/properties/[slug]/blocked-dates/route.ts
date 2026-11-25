import { NextResponse } from 'next/server';
import { getBlockedDates } from '@/lib/availability/blocked-dates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/properties/[slug]/blocked-dates
 *
 * Devuelve los bloqueos de fechas (airbnb + manual + booking) de una propiedad.
 * Endpoint público de solo lectura, usado por el calendario de la página principal.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const blockedDates = await getBlockedDates(slug);
    return NextResponse.json({ ok: true, blockedDates });
  } catch (error) {
    // Loguear el detalle solo en el servidor; no exponerlo al cliente.
    console.error('[api/properties/blocked-dates] Error', error);
    return NextResponse.json(
      { ok: false, error: 'No se pudo obtener la disponibilidad.' },
      { status: 500 },
    );
  }
}
