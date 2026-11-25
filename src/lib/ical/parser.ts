import ical, { type VEvent } from 'node-ical';

/**
 * Evento iCal normalizado que usamos internamente.
 * Las fechas se manejan como strings `YYYY-MM-DD` (fecha de calendario, sin hora),
 * que es el formato que espera la columna DATE de Postgres.
 */
export interface NormalizedIcalEvent {
  /** UID original del evento iCal (identificador estable de la reserva/bloqueo en Airbnb). */
  uid: string;
  /** Fecha de inicio inclusiva en formato YYYY-MM-DD. */
  startDate: string;
  /** Fecha de fin exclusiva en formato YYYY-MM-DD (convención iCal: DTEND es exclusivo). */
  endDate: string;
  /** Resumen del evento (en Airbnb suele ser "Reserved" / "Airbnb (Not available)"). */
  summary?: string;
}

/**
 * Convierte un Date a string YYYY-MM-DD usando sus componentes UTC.
 * node-ical devuelve fechas en UTC para eventos all-day, por lo que usamos
 * getUTC* para evitar corrimientos de día por zona horaria.
 */
function toDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parsea un cuerpo iCal (texto) y devuelve los eventos normalizados.
 *
 * - Ignora VTIMEZONE, VCALENDAR y cualquier componente que no sea VEVENT.
 * - Ignora eventos sin UID o sin fechas válidas.
 * - Si un evento no tiene `end`, se asume que dura un día (end = start + 1 día).
 *
 * @param icalBody Contenido completo del archivo .ics
 * @returns Lista de eventos normalizados
 */
export function parseIcal(icalBody: string): NormalizedIcalEvent[] {
  const parsed = ical.sync.parseICS(icalBody);
  const events: NormalizedIcalEvent[] = [];

  for (const key of Object.keys(parsed)) {
    const component = parsed[key];
    if (!component || component.type !== 'VEVENT') continue;

    const event = component as VEvent;
    if (!event.uid || !event.start) continue;

    const start = new Date(event.start);
    if (Number.isNaN(start.getTime())) continue;

    let end: Date;
    if (event.end) {
      end = new Date(event.end);
    } else {
      // Sin DTEND: asumimos un evento de un día.
      end = new Date(start.getTime());
      end.setUTCDate(end.getUTCDate() + 1);
    }
    if (Number.isNaN(end.getTime())) continue;

    events.push({
      uid: event.uid,
      startDate: toDateString(start),
      endDate: toDateString(end),
      summary: event.summary || undefined,
    });
  }

  return events;
}
