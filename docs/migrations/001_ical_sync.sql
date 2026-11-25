-- Migración: soporte para sincronización iCal de Airbnb
-- Ejecutar en el SQL Editor de Supabase.
--
-- 1) Índice único compuesto requerido por el upsert del importador
--    (onConflict: 'property_id,source,source_id').
--    Nota: los registros 'manual'/'booking' suelen tener source_id NULL; en Postgres
--    los NULL no colisionan en un índice único, así que no se afectan entre sí.
CREATE UNIQUE INDEX IF NOT EXISTS blocked_dates_property_source_sourceid_key
  ON blocked_dates (property_id, source, source_id);

-- 2) (Opcional) Marca de última sincronización exitosa en la propiedad.
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMPTZ;
