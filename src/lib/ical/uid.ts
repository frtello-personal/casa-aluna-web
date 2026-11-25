import { createHash } from 'node:crypto';

/**
 * Namespace fijo (UUID) para derivar identificadores deterministas a partir
 * del UID de los eventos iCal de Airbnb.
 *
 * Así, un mismo evento de Airbnb siempre produce el mismo UUID, lo que nos permite
 * usar `source_id` en `blocked_dates` para detectar altas/bajas entre sincronizaciones.
 */
const AIRBNB_ICAL_NAMESPACE = '6c4b2a1a-9f3e-4d2b-8a7c-1e5f0b9d3a21';

/**
 * Convierte un UUID (sin guiones) a bytes.
 */
function uuidToBytes(uuid: string): Buffer {
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}

/**
 * Formatea 16 bytes como UUID estándar (8-4-4-4-12) con la versión y variante de v5.
 */
function bytesToUuid(bytes: Buffer): string {
  const hex = bytes.toString('hex');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

/**
 * Genera un UUID v5 (sistema de nombres basado en SHA-1) a partir de un UID iCal.
 * Implementación mínima conforme a RFC 4122, sin dependencias externas.
 * El mismo UID siempre devuelve el mismo UUID.
 */
export function icalUidToUuid(uid: string): string {
  const namespaceBytes = uuidToBytes(AIRBNB_ICAL_NAMESPACE);
  const hash = createHash('sha1')
    .update(namespaceBytes)
    .update(Buffer.from(uid, 'utf8'))
    .digest()
    .subarray(0, 16);

  // Ajustar versión (5) y variante (RFC 4122) según spec.
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;

  return bytesToUuid(Buffer.from(hash));
}
