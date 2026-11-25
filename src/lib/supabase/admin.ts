import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase para uso exclusivo en el servidor (Route Handlers, Server Components).
 *
 * - Si `SUPABASE_SERVICE_ROLE_KEY` está definida, la usa (bypassa RLS) — necesario para
 *   que el cron de sincronización pueda escribir en `blocked_dates` sin depender de
 *   políticas RLS de escritura.
 * - Si no, cae a la publishable key (sujeta a RLS).
 *
 * NO importar este módulo desde código de cliente.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const key = serviceRoleKey || publishableKey;

  if (!supabaseUrl || !key) {
    throw new Error(
      'Faltan variables de entorno de Supabase (NEXT_PUBLIC_SUPABASE_URL y una key).',
    );
  }

  return createSupabaseClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
