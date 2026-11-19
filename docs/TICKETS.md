# 🎫 Casa Aluna - Tickets de Desarrollo

**Última actualización**: 9 de noviembre, 2026

---

## 📋 Tabla de Contenidos

- [Fase 1: Showcase + Calendario Visual](#fase-1-showcase--calendario-visual)
- [Fase 2: Sistema de Reservas](#fase-2-sistema-de-reservas)
- [Fase 3: Chat Interno](#fase-3-chat-interno)
- [Fase 4: Integración de Pagos](#fase-4-integración-de-pagos)

---

## Convenciones

**Prioridad**:
- 🔴 Alta (bloqueante)
- 🟡 Media (importante)
- 🟢 Baja (nice to have)

**Estimación**: En puntos de historia (1 punto = ~2-4 horas)

**Estado**: 
- 📝 Por hacer
- 🔨 En progreso
- ✅ Completado
- 🚫 Bloqueado

---

# FASE 1: SHOWCASE + CALENDARIO VISUAL

**Duración total estimada**: 2-3 semanas (52-62 puntos)

---

## 🗂️ EPIC 1.1: Configuración de Infraestructura

### F1-001: Crear proyecto en Supabase
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Crear y configurar proyecto en Supabase para base de datos PostgreSQL.

**Tareas**:
1. Crear cuenta/proyecto en Supabase
2. Configurar región (US East recomendado para Colombia)
3. Obtener credenciales (URL, anon key, service key)
4. Configurar RLS (Row Level Security) básico

**Criterios de aceptación**:
- [ ] Proyecto Supabase creado y accesible
- [ ] Credenciales guardadas en lugar seguro
- [ ] RLS activado en configuración

**Dependencias**: Ninguna

---

### F1-002: Configurar variables de entorno en proyecto
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Configurar archivo `.env.local` con todas las variables necesarias para Fase 1.

**Tareas**:
1. Crear `.env.local` basado en `.env.example`
2. Agregar variables Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   ```
3. Actualizar `.env.example` con nuevas variables
4. Documentar en README cómo obtener cada variable

**Criterios de aceptación**:
- [ ] `.env.local` configurado correctamente
- [ ] App puede conectar a Supabase
- [ ] `.env.example` actualizado
- [ ] `.env.local` en `.gitignore`

**Dependencias**: F1-001

---

### F1-003: Instalar dependencias de Supabase
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar SDK de Supabase y configurar cliente.

**Tareas**:
1. Instalar: `npm install @supabase/supabase-js`
2. Crear `src/lib/supabase/client.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   
   export const supabase = createClient(
     process.env.NEXT_PUBLIC_SUPABASE_URL!,
     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
   );
   ```
3. Crear `src/lib/supabase/server.ts` para Server Components
4. Configurar TypeScript types para BD

**Criterios de aceptación**:
- [ ] `@supabase/supabase-js` instalado
- [ ] Cliente Supabase configurado
- [ ] Puede hacer consultas exitosas
- [ ] Types TypeScript funcionan

**Dependencias**: F1-002

---

## 🗂️ EPIC 1.2: Esquema de Base de Datos

### F1-004: Crear tabla `properties`
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear tabla de propiedades con todos los campos necesarios.

**Tareas**:
1. Crear migration en Supabase:
   ```sql
   CREATE TABLE properties (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     slug VARCHAR(255) UNIQUE NOT NULL,
     type VARCHAR(100),
     description TEXT,
     location VARCHAR(255),
     bedrooms INTEGER,
     bathrooms INTEGER,
     max_guests INTEGER,
     price_low DECIMAL(10,2),
     price_high DECIMAL(10,2),
     cleaning_fee DECIMAL(10,2),
     security_deposit DECIMAL(10,2),
     amenities JSONB,
     images JSONB,
     videos JSONB,
     rules JSONB,
     whatsapp VARCHAR(20),
     airbnb_ical_url TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```
2. Crear índices necesarios
3. Configurar RLS policies (por ahora público read, admin write)
4. Crear TypeScript types correspondientes

**Criterios de aceptación**:
- [ ] Tabla creada exitosamente
- [ ] RLS policies configuradas
- [ ] Types TypeScript generados
- [ ] Puede insertar/leer datos

**Dependencias**: F1-003

---

### F1-005: Crear tabla `blocked_dates`
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Crear tabla para gestionar fechas bloqueadas con constraint de no-overlap.

**Tareas**:
1. Habilitar extensión `btree_gist` en Supabase
2. Crear migration:
   ```sql
   CREATE TABLE blocked_dates (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     source VARCHAR(50) NOT NULL CHECK (source IN ('airbnb', 'manual', 'booking')),
     source_id UUID,
     reason TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW(),
     CONSTRAINT no_overlap EXCLUDE USING gist (
       property_id WITH =,
       daterange(start_date, end_date, '[]') WITH &&
     )
   );
   ```
3. Crear índices para performance
4. Configurar RLS
5. Crear types TypeScript

**Criterios de aceptación**:
- [ ] Tabla creada con constraint de no-overlap
- [ ] Constraint previene fechas duplicadas
- [ ] Índices creados
- [ ] RLS configurado
- [ ] Types generados

**Dependencias**: F1-004

---

### F1-006: Seed inicial de datos (Casa Aluna)
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Migrar datos hardcoded actuales a Supabase.

**Tareas**:
1. Crear script `scripts/seed-property.ts`
2. Mapear datos de `page.tsx` a estructura de BD
3. Insertar propiedad Casa Aluna
4. Verificar integridad de datos

**Criterios de aceptación**:
- [ ] Script ejecuta sin errores
- [ ] Datos de Casa Aluna en BD
- [ ] Imágenes como JSONB correcto
- [ ] Amenities como JSONB correcto

**Dependencias**: F1-005

---

## 🗂️ EPIC 1.3: API Routes

### F1-007: API Route GET `/api/properties/[slug]`
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear endpoint para obtener datos de una propiedad por slug.

**Tareas**:
1. Crear `src/app/api/properties/[slug]/route.ts`
2. Implementar handler GET:
   ```typescript
   export async function GET(
     request: Request,
     { params }: { params: { slug: string } }
   ) {
     const { data, error } = await supabase
       .from('properties')
       .select('*')
       .eq('slug', params.slug)
       .single();
     
     if (error) return Response.json({ error }, { status: 404 });
     return Response.json(data);
   }
   ```
3. Agregar manejo de errores
4. Agregar cache headers apropiados

**Criterios de aceptación**:
- [ ] Endpoint retorna datos correctos
- [ ] Maneja 404 si slug no existe
- [ ] Cache headers configurados
- [ ] Respuesta tipada con TypeScript

**Dependencias**: F1-006

---

### F1-008: API Route GET `/api/properties/[slug]/blocked-dates`
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear endpoint para obtener fechas bloqueadas de una propiedad.

**Tareas**:
1. Crear `src/app/api/properties/[slug]/blocked-dates/route.ts`
2. Implementar handler GET con query params opcionales (start_date, end_date)
3. Retornar array de rangos de fechas
4. Optimizar query con índices

**Criterios de aceptación**:
- [ ] Endpoint retorna fechas bloqueadas
- [ ] Soporta filtrado por rango de fechas
- [ ] Performance < 200ms
- [ ] Formato de respuesta consistente

**Dependencias**: F1-007

---

### F1-009: API Route POST `/api/properties/[slug]/blocked-dates` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Crear endpoint para que host bloquee fechas manualmente.

**Tareas**:
1. Crear endpoint POST
2. Validar input con Zod:
   ```typescript
   const schema = z.object({
     start_date: z.string().date(),
     end_date: z.string().date(),
     reason: z.string().optional(),
   });
   ```
3. Implementar autenticación básica (por ahora API key simple)
4. Insertar en `blocked_dates` con source: 'manual'
5. Manejar errores de overlap

**Criterios de aceptación**:
- [ ] Endpoint valida input
- [ ] Requiere autenticación
- [ ] Previene overlaps
- [ ] Retorna error descriptivo si falla

**Dependencias**: F1-008

---

## 🗂️ EPIC 1.4: Frontend - Calendario

### F1-010: Componente `CalendarGrid`
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Crear componente de calendario visual responsive.

**Tareas**:
1. Crear `src/components/booking/CalendarGrid.tsx`
2. Implementar lógica de generación de días del mes
3. Marcar visualmente fechas bloqueadas
4. Navegación mes anterior/siguiente
5. Responsive mobile-first
6. Uso de `date-fns` para manipulación de fechas

**Props**:
```typescript
interface CalendarGridProps {
  blockedDates: Array<{ start_date: string; end_date: string }>;
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
}
```

**Criterios de aceptación**:
- [ ] Muestra calendario del mes correcto
- [ ] Fechas bloqueadas visualmente distintas
- [ ] Navegación mes funciona
- [ ] Responsive en móvil
- [ ] Accesible (keyboard navigation)

**Dependencias**: F1-008

---

### F1-011: Integrar calendario en página principal
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Reemplazar calendario hardcoded en `page.tsx` con el nuevo dinámico.

**Tareas**:
1. Importar `CalendarGrid` en `src/app/page.tsx`
2. Fetch datos desde API `/api/properties/casa-aluna/blocked-dates`
3. Pasar datos a componente
4. Mantener diseño actual (tab "Disponibilidad")
5. Agregar loading state

**Criterios de aceptación**:
- [ ] Calendario muestra datos de BD
- [ ] Loading state durante fetch
- [ ] Sin errores en consola
- [ ] Funcionalidad existente preservada

**Dependencias**: F1-010

---

### F1-012: Instalar y configurar `date-fns`
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar librería para manipulación de fechas.

**Tareas**:
1. Instalar: `npm install date-fns`
2. Configurar locale español si necesario
3. Crear utilidades en `src/lib/date-utils.ts`:
   - `isDateBlocked()`
   - `getMonthDays()`
   - `formatDateRange()`

**Criterios de aceptación**:
- [ ] `date-fns` instalado
- [ ] Utilidades creadas y testeadas
- [ ] Locale español funciona

**Dependencias**: Ninguna

---

## 🗂️ EPIC 1.5: Panel Admin Básico

### F1-013: Crear ruta admin `/admin`
- **Prioridad**: 🟡 Media
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Crear página básica de administración protegida.

**Tareas**:
1. Crear `src/app/admin/page.tsx`
2. Implementar autenticación básica (por ahora password simple)
3. Layout admin con navegación
4. Dashboard con stats básicos

**Criterios de aceptación**:
- [ ] Ruta `/admin` accesible
- [ ] Requiere password para acceder
- [ ] Layout consistente
- [ ] Dashboard muestra stats básicos

**Dependencias**: Ninguna

---

### F1-014: Panel de bloqueo manual de fechas
- **Prioridad**: 🟡 Media
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Interfaz para que host bloquee fechas manualmente.

**Tareas**:
1. Crear `src/app/admin/calendar/page.tsx`
2. Formulario con date pickers (start_date, end_date, reason)
3. Validación frontend
4. Submit a API POST `/api/properties/[slug]/blocked-dates`
5. Mostrar lista de bloqueos manuales existentes
6. Opción de eliminar bloqueos

**Criterios de aceptación**:
- [ ] Formulario funcional
- [ ] Valida fechas (end >= start)
- [ ] Muestra mensaje éxito/error
- [ ] Lista bloqueos existentes
- [ ] Puede eliminar bloqueos

**Dependencias**: F1-009, F1-013

---

### F1-015: Vistaprevia de calendario admin
- **Prioridad**: 🟢 Baja
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Mostrar calendario con todos los bloqueos en panel admin.

**Tareas**:
1. Reutilizar componente `CalendarGrid`
2. Agregar leyenda (airbnb/manual/booking)
3. Mostrar fuente del bloqueo al hover

**Criterios de aceptación**:
- [ ] Calendario visible en admin
- [ ] Muestra todos los tipos de bloqueo
- [ ] Leyenda clara
- [ ] Tooltip con info al hover

**Dependencias**: F1-010, F1-014

---

## 🗂️ EPIC 1.6: Migración y Refactorización

### F1-016: Refactorizar componente `PropertyCard`
- **Prioridad**: 🟢 Baja
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Actualizar `PropertyCard` para recibir datos dinámicos.

**Tareas**:
1. Modificar props de `PropertyCard`
2. Recibir datos de API en lugar de hardcoded
3. Mantener diseño existente

**Criterios de aceptación**:
- [ ] Componente acepta props dinámicos
- [ ] Diseño sin cambios
- [ ] TypeScript sin errores

**Dependencias**: F1-007

---

### F1-017: Crear types globales de la app
- **Prioridad**: 🟡 Media
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Centralizar definiciones de tipos TypeScript.

**Tareas**:
1. Crear `src/types/database.ts` con tipos de BD
2. Crear `src/types/api.ts` con tipos de API responses
3. Exportar desde `src/types/index.ts`

**Criterios de aceptación**:
- [ ] Todos los tipos centralizados
- [ ] No hay duplicación de tipos
- [ ] Imports consistentes

**Dependencias**: F1-005

---

### F1-018: Actualizar README con instrucciones setup
- **Prioridad**: 🟡 Media
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Documentar proceso de setup del proyecto.

**Tareas**:
1. Actualizar sección de instalación
2. Documentar setup Supabase
3. Documentar variables de entorno
4. Agregar troubleshooting común

**Criterios de aceptación**:
- [ ] README actualizado
- [ ] Instrucciones claras
- [ ] Screenshots si necesario

**Dependencias**: F1-006

---

## 🗂️ EPIC 1.7: Deploy y Testing

### F1-019: Configurar variables de entorno en Vercel
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Configurar environment variables en Vercel dashboard.

**Tareas**:
1. Agregar todas las variables de `.env.local`
2. Verificar que son accesibles desde build
3. Configurar preview/production environments

**Criterios de aceptación**:
- [ ] Variables configuradas en Vercel
- [ ] Build exitoso
- [ ] App funciona en preview

**Dependencias**: F1-002

---

### F1-020: Deploy a producción (Vercel)
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Deploy inicial a producción.

**Tareas**:
1. Conectar repo GitHub con Vercel
2. Configurar settings de build
3. Trigger deploy a producción
4. Configurar dominio custom (si disponible)
5. Verificar SSL activo

**Criterios de aceptación**:
- [ ] App deployada exitosamente
- [ ] Todas las funcionalidades funcionan
- [ ] SSL activo
- [ ] PostHog tracking funciona

**Dependencias**: F1-019

---

### F1-021: Testing manual completo Fase 1
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Suite de testing manual para validar toda la Fase 1.

**Casos de prueba**:
1. ✅ Página principal carga correctamente
2. ✅ Galería de imágenes funciona
3. ✅ Calendario muestra fechas bloqueadas
4. ✅ Navegación de meses funciona
5. ✅ Responsive en móvil/tablet/desktop
6. ✅ Admin puede loguearse
7. ✅ Admin puede bloquear fechas
8. ✅ Bloqueos aparecen en calendario público
9. ✅ Analytics PostHog registra eventos
10. ✅ Performance Lighthouse > 85

**Criterios de aceptación**:
- [ ] Todos los casos pasan
- [ ] Bugs críticos resueltos
- [ ] Documentar bugs menores para backlog

**Dependencias**: F1-020

---

### F1-022: Crear backup de base de datos
- **Prioridad**: 🟡 Media
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Configurar estrategia de backup en Supabase.

**Tareas**:
1. Habilitar daily backups en Supabase (si disponible en free tier)
2. Documentar proceso de restore
3. Crear script de backup manual si necesario

**Criterios de aceptación**:
- [ ] Backups automáticos o proceso documentado
- [ ] Proceso de restore testeado

**Dependencias**: F1-020

---

## 📊 Resumen Fase 1

| Epic | Tickets | Puntos | Prioridad Alta |
|------|---------|--------|----------------|
| 1.1 Infraestructura | 3 | 4 | 3 |
| 1.2 Base de Datos | 3 | 9 | 3 |
| 1.3 API Routes | 3 | 10 | 2 |
| 1.4 Frontend Calendario | 3 | 9 | 3 |
| 1.5 Panel Admin | 3 | 10 | 1 |
| 1.6 Migración | 3 | 5 | 0 |
| 1.7 Deploy | 4 | 7 | 3 |
| **TOTAL** | **22** | **54** | **15** |

---

# FASE 2: SISTEMA DE RESERVAS

**Duración total estimada**: 3-4 semanas (68-78 puntos)

---

## 🗂️ EPIC 2.1: Esquema de Datos - Reservas

### F2-001: Crear tabla `guests`
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear tabla para almacenar información de huéspedes.

**Tareas**:
1. Crear migration:
   ```sql
   CREATE TABLE guests (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     phone VARCHAR(20),
     whatsapp VARCHAR(20),
     country VARCHAR(100),
     document_type VARCHAR(50),
     document_number VARCHAR(100),
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   CREATE INDEX idx_guests_email ON guests(email);
   ```
2. Configurar RLS (guests solo ven sus propios datos)
3. Crear types TypeScript

**Criterios de aceptación**:
- [ ] Tabla creada
- [ ] Email único enforced
- [ ] RLS configurado
- [ ] Types generados

**Dependencias**: Ninguna (puede hacerse en paralelo con Fase 1)

---

### F2-002: Crear tabla `bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Crear tabla para gestionar reservas.

**Tareas**:
1. Crear migration:
   ```sql
   CREATE TABLE bookings (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
     guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
     start_date DATE NOT NULL,
     end_date DATE NOT NULL,
     num_guests INTEGER NOT NULL,
     status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (
       status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')
     ),
     total_nights INTEGER NOT NULL,
     price_per_night DECIMAL(10,2) NOT NULL,
     subtotal DECIMAL(10,2) NOT NULL,
     cleaning_fee DECIMAL(10,2),
     total_price DECIMAL(10,2) NOT NULL,
     special_requests TEXT,
     host_notes TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   CREATE INDEX idx_bookings_property ON bookings(property_id);
   CREATE INDEX idx_bookings_guest ON bookings(guest_id);
   CREATE INDEX idx_bookings_status ON bookings(status);
   CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
   ```
2. Crear trigger para calcular `total_nights` automáticamente
3. Configurar RLS
4. Crear types TypeScript

**Criterios de aceptación**:
- [ ] Tabla creada con constraints
- [ ] Triggers funcionan
- [ ] RLS configurado
- [ ] Types generados

**Dependencias**: F2-001

---

## 🗂️ EPIC 2.2: Formulario de Reserva

### F2-003: Instalar dependencias de formularios
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar librerías para gestión de formularios y validación.

**Tareas**:
1. Instalar: `npm install react-hook-form zod @hookform/resolvers`
2. Crear utilidades de validación en `src/lib/validations/`

**Criterios de aceptación**:
- [ ] Librerías instaladas
- [ ] No hay conflictos de versiones

**Dependencias**: Ninguna

---

### F2-004: Componente `DateRangePicker`
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Crear selector de rango de fechas interactivo.

**Tareas**:
1. Crear `src/components/booking/DateRangePicker.tsx`
2. Permitir selección de check-in y check-out
3. Deshabilitar fechas bloqueadas
4. Validar mínimo 1 noche
5. Highlight visual del rango seleccionado
6. Responsive

**Props**:
```typescript
interface DateRangePickerProps {
  blockedDates: Array<{ start_date: string; end_date: string }>;
  onRangeSelect: (startDate: Date, endDate: Date) => void;
  minNights?: number;
}
```

**Criterios de aceptación**:
- [ ] Usuario puede seleccionar rango
- [ ] Fechas bloqueadas no seleccionables
- [ ] Validación de mínimo noches
- [ ] Callback ejecuta con fechas correctas
- [ ] Responsive

**Dependencias**: F1-012 (date-fns)

---

### F2-005: Componente `BookingForm`
- **Prioridad**: 🔴 Alta
- **Estimación**: 6 puntos
- **Estado**: 📝

**Descripción**:
Formulario completo de solicitud de reserva.

**Tareas**:
1. Crear `src/components/booking/BookingForm.tsx`
2. Campos:
   - Nombre completo
   - Email
   - Teléfono
   - WhatsApp
   - País
   - Número de huéspedes
   - Solicitudes especiales (textarea)
3. Validación con Zod schema
4. Integración con react-hook-form
5. Estados de loading/error/success
6. Mostrar cálculo de precio en tiempo real

**Criterios de aceptación**:
- [ ] Todos los campos validados
- [ ] Muestra errores inline
- [ ] Cálculo precio correcto
- [ ] Loading state durante submit
- [ ] Maneja errores de API

**Dependencias**: F2-003, F2-004

---

### F2-006: Modal de reserva
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Modal que contiene el formulario de reserva.

**Tareas**:
1. Crear `src/components/booking/BookingModal.tsx`
2. Trigger desde botón "Reservar" en página principal
3. Animaciones de apertura/cierre
4. Click outside para cerrar
5. Accesible (ESC para cerrar, focus trap)

**Criterios de aceptación**:
- [ ] Modal abre/cierra correctamente
- [ ] Formulario dentro del modal funciona
- [ ] Accesible
- [ ] Animaciones smooth

**Dependencias**: F2-005

---

## 🗂️ EPIC 2.3: API de Reservas

### F2-007: API Route POST `/api/bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 6 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para crear nuevas solicitudes de reserva.

**Tareas**:
1. Crear `src/app/api/bookings/route.ts`
2. Validar input con Zod
3. Verificar disponibilidad de fechas
4. Crear/actualizar guest en BD
5. Crear booking con status 'pending'
6. Calcular precios automáticamente
7. Prevenir double-booking (transaction)
8. Retornar ID de booking

**Validaciones**:
- [ ] Fechas no solapan con blocked_dates
- [ ] end_date > start_date
- [ ] num_guests <= max_guests
- [ ] Email válido
- [ ] Campos requeridos presentes

**Criterios de aceptación**:
- [ ] Endpoint crea bookings exitosamente
- [ ] Previene double-booking
- [ ] Valida todos los campos
- [ ] Retorna errores descriptivos
- [ ] Performance < 500ms

**Dependencias**: F2-002

---

### F2-008: API Route GET `/api/bookings` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para listar todas las reservas (solo admin).

**Tareas**:
1. Crear handler GET con paginación
2. Filtros opcionales: status, date range
3. Join con guests y properties
4. Ordenar por created_at DESC
5. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Lista todas las reservas
- [ ] Paginación funciona
- [ ] Filtros funcionan
- [ ] Solo accesible por admin

**Dependencias**: F2-007

---

### F2-009: API Route PATCH `/api/bookings/[id]` (admin)
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para que admin apruebe/rechace reservas.

**Tareas**:
1. Crear `src/app/api/bookings/[id]/route.ts`
2. Handler PATCH para actualizar status
3. Si status → 'approved':
   - Crear blocked_date con source: 'booking'
   - Trigger notificación email al guest
4. Si status → 'rejected':
   - Enviar email explicando (opcional)
5. Validar que booking existe y está en 'pending'
6. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Puede aprobar reservas
- [ ] Crea blocked_date al aprobar
- [ ] Envía notificación
- [ ] No puede aprobar booking ya procesado
- [ ] Solo accesible por admin

**Dependencias**: F2-008

---

## 🗂️ EPIC 2.4: Sistema de Notificaciones

### F2-010: Configurar cuenta Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Crear cuenta y configurar Resend para emails.

**Tareas**:
1. Crear cuenta en Resend.com
2. Verificar dominio (o usar test domain)
3. Obtener API key
4. Agregar a variables de entorno: `RESEND_API_KEY`

**Criterios de aceptación**:
- [ ] Cuenta creada
- [ ] API key obtenida
- [ ] Puede enviar emails de prueba

**Dependencias**: Ninguna

---

### F2-011: Instalar SDK Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar y configurar SDK de Resend.

**Tareas**:
1. Instalar: `npm install resend`
2. Crear cliente en `src/lib/email/client.ts`:
   ```typescript
   import { Resend from 'resend';
   export const resend = new Resend(process.env.RESEND_API_KEY);
   ```

**Criterios de aceptación**:
- [ ] SDK instalado
- [ ] Cliente configurado
- [ ] Puede enviar email de prueba

**Dependencias**: F2-010

---

### F2-012: Templates de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Crear templates HTML para diferentes tipos de emails.

**Tareas**:
1. Crear `src/lib/email/templates/`:
   - `booking-request.tsx` (para host)
   - `booking-approved.tsx` (para guest)
   - `booking-rejected.tsx` (para guest)
2. Usar React Email o HTML templates
3. Incluir detalles de reserva
4. Incluir links relevantes (WhatsApp, panel admin)

**Criterios de aceptación**:
- [ ] Templates funcionan
- [ ] Diseño responsive
- [ ] Todos los datos dinámicos se renderizan
- [ ] Links funcionan correctamente

**Dependencias**: F2-011

---

### F2-013: Funciones de envío de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear funciones helper para enviar diferentes emails.

**Tareas**:
1. Crear `src/lib/email/send.ts`
2. Funciones:
   - `sendBookingRequestEmail(to: string, booking: Booking)`
   - `sendBookingApprovedEmail(to: string, booking: Booking)`
   - `sendBookingRejectedEmail(to: string, booking: Booking)`
3. Manejo de errores
4. Logging de emails enviados

**Criterios de aceptación**:
- [ ] Todas las funciones envían emails
- [ ] Manejo de errores robusto
- [ ] Logs para debugging

**Dependencias**: F2-012

---

### F2-014: Integrar notificaciones en API
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Llamar funciones de email desde endpoints de booking.

**Tareas**:
1. En POST `/api/bookings`: enviar email a host
2. En PATCH `/api/bookings/[id]` (approved): enviar email a guest
3. En PATCH (rejected): enviar email a guest
4. No bloquear request si email falla (async)

**Criterios de aceptación**:
- [ ] Emails se envían en momentos correctos
- [ ] Fallos de email no rompen booking
- [ ] Emails se encolan si es posible

**Dependencias**: F2-013, F2-009

---

## 🗂️ EPIC 2.3: API de Reservas

### F2-007: API Route POST `/api/bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 6 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para crear nuevas solicitudes de reserva.

**Tareas**:
1. Crear `src/app/api/bookings/route.ts`
2. Validar input con Zod
3. Verificar disponibilidad de fechas
4. Crear/actualizar guest en BD
5. Crear booking con status 'pending'
6. Calcular precios automáticamente
7. Prevenir double-booking (transaction)
8. Retornar ID de booking

**Validaciones**:
- [ ] Fechas no solapan con blocked_dates
- [ ] end_date > start_date
- [ ] num_guests <= max_guests
- [ ] Email válido
- [ ] Campos requeridos presentes

**Criterios de aceptación**:
- [ ] Endpoint crea bookings exitosamente
- [ ] Previene double-booking
- [ ] Valida todos los campos
- [ ] Retorna errores descriptivos
- [ ] Performance < 500ms

**Dependencias**: F2-002

---

### F2-008: API Route GET `/api/bookings` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para listar todas las reservas (solo admin).

**Tareas**:
1. Crear handler GET con paginación
2. Filtros opcionales: status, date range
3. Join con guests y properties
4. Ordenar por created_at DESC
5. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Lista todas las reservas
- [ ] Paginación funciona
- [ ] Filtros funcionan
- [ ] Solo accesible por admin

**Dependencias**: F2-007

---

### F2-009: API Route PATCH `/api/bookings/[id]` (admin)
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para que admin apruebe/rechace reservas.

**Tareas**:
1. Crear `src/app/api/bookings/[id]/route.ts`
2. Handler PATCH para actualizar status
3. Si status → 'approved':
   - Crear blocked_date con source: 'booking'
   - Trigger notificación email al guest
4. Si status → 'rejected':
   - Enviar email explicando (opcional)
5. Validar que booking existe y está en 'pending'
6. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Puede aprobar reservas
- [ ] Crea blocked_date al aprobar
- [ ] Envía notificación
- [ ] No puede aprobar booking ya procesado
- [ ] Solo accesible por admin

**Dependencias**: F2-008

---

## 🗂️ EPIC 2.4: Sistema de Notificaciones

### F2-010: Configurar cuenta Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Crear cuenta y configurar Resend para emails.

**Tareas**:
1. Crear cuenta en Resend.com
2. Verificar dominio (o usar test domain)
3. Obtener API key
4. Agregar a variables de entorno: `RESEND_API_KEY`

**Criterios de aceptación**:
- [ ] Cuenta creada
- [ ] API key obtenida
- [ ] Puede enviar emails de prueba

**Dependencias**: Ninguna

---

### F2-011: Instalar SDK Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar y configurar SDK de Resend.

**Tareas**:
1. Instalar: `npm install resend`
2. Crear cliente en `src/lib/email/client.ts`:
   ```typescript
   import { Resend } from 'resend';
   export const resend = new Resend(process.env.RESEND_API_KEY);
   ```

**Criterios de aceptación**:
- [ ] SDK instalado
- [ ] Cliente configurado
- [ ] Puede enviar email de prueba

**Dependencias**: F2-010

---

### F2-012: Templates de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Crear templates HTML para diferentes tipos de emails.

**Tareas**:
1. Crear `src/lib/email/templates/`:
   - `booking-request.tsx` (para host)
   - `booking-approved.tsx` (para guest)
   - `booking-rejected.tsx` (para guest)
2. Usar React Email o HTML templates
3. Incluir detalles de reserva
4. Incluir links relevantes (WhatsApp, panel admin)

**Criterios de aceptación**:
- [ ] Templates funcionan
- [ ] Diseño responsive
- [ ] Todos los datos dinámicos se renderizan
- [ ] Links funcionan correctamente

**Dependencias**: F2-011

---

### F2-013: Funciones de envío de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear funciones helper para enviar diferentes emails.

**Tareas**:
1. Crear `src/lib/email/send.ts`
2. Funciones:
   - `sendBookingRequestEmail(to: string, booking: Booking)`
   - `sendBookingApprovedEmail(to: string, booking: Booking)`
   - `sendBookingRejectedEmail(to: string, booking: Booking)`
3. Manejo de errores
4. Logging de emails enviados

**Criterios de aceptación**:
- [ ] Todas las funciones envían emails
- [ ] Manejo de errores robusto
- [ ] Logs para debugging

**Dependencias**: F2-012

---

### F2-014: Integrar notificaciones en API
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Llamar funciones de email desde endpoints de booking.

**Tareas**:
1. En POST `/api/bookings`: enviar email a host
2. En PATCH `/api/bookings/[id]` (approved): enviar email a guest
3. En PATCH (rejected): enviar email a guest
4. No bloquear request si email falla (async)

**Criterios de aceptación**:
- [ ] Emails se envían en momentos correctos
- [ ] Fallos de email no rompen booking
- [ ] Emails se encolan si es posible

**Dependencias**: F2-013, F2-009

---

## 🗂️ EPIC 2.3: API de Reservas

### F2-007: API Route POST `/api/bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 6 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para crear nuevas solicitudes de reserva.

**Tareas**:
1. Crear `src/app/api/bookings/route.ts`
2. Validar input con Zod
3. Verificar disponibilidad de fechas
4. Crear/actualizar guest en BD
5. Crear booking con status 'pending'
6. Calcular precios automáticamente
7. Prevenir double-booking (transaction)
8. Retornar ID de booking

**Validaciones**:
- [ ] Fechas no solapan con blocked_dates
- [ ] end_date > start_date
- [ ] num_guests <= max_guests
- [ ] Email válido
- [ ] Campos requeridos presentes

**Criterios de aceptación**:
- [ ] Endpoint crea bookings exitosamente
- [ ] Previene double-booking
- [ ] Valida todos los campos
- [ ] Retorna errores descriptivos
- [ ] Performance < 500ms

**Dependencias**: F2-002

---

### F2-008: API Route GET `/api/bookings` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para listar todas las reservas (solo admin).

**Tareas**:
1. Crear handler GET con paginación
2. Filtros opcionales: status, date range
3. Join con guests y properties
4. Ordenar por created_at DESC
5. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Lista todas las reservas
- [ ] Paginación funciona
- [ ] Filtros funcionan
- [ ] Solo accesible por admin

**Dependencias**: F2-007

---

### F2-009: API Route PATCH `/api/bookings/[id]` (admin)
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para que admin apruebe/rechace reservas.

**Tareas**:
1. Crear `src/app/api/bookings/[id]/route.ts`
2. Handler PATCH para actualizar status
3. Si status → 'approved':
   - Crear blocked_date con source: 'booking'
   - Trigger notificación email al guest
4. Si status → 'rejected':
   - Enviar email explicando (opcional)
5. Validar que booking existe y está en 'pending'
6. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Puede aprobar reservas
- [ ] Crea blocked_date al aprobar
- [ ] Envía notificación
- [ ] No puede aprobar booking ya procesado
- [ ] Solo accesible por admin

**Dependencias**: F2-008

---

## 🗂️ EPIC 2.4: Sistema de Notificaciones

### F2-010: Configurar cuenta Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Crear cuenta y configurar Resend para emails.

**Tareas**:
1. Crear cuenta en Resend.com
2. Verificar dominio (o usar test domain)
3. Obtener API key
4. Agregar a variables de entorno: `RESEND_API_KEY`

**Criterios de aceptación**:
- [ ] Cuenta creada
- [ ] API key obtenida
- [ ] Puede enviar emails de prueba

**Dependencias**: Ninguna

---

### F2-011: Instalar SDK Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar y configurar SDK de Resend.

**Tareas**:
1. Instalar: `npm install resend`
2. Crear cliente en `src/lib/email/client.ts`:
   ```typescript
   import { Resend } from 'resend';
   export const resend = new Resend(process.env.RESEND_API_KEY);
   ```

**Criterios de aceptación**:
- [ ] SDK instalado
- [ ] Cliente configurado
- [ ] Puede enviar email de prueba

**Dependencias**: F2-010

---

### F2-012: Templates de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Crear templates HTML para diferentes tipos de emails.

**Tareas**:
1. Crear `src/lib/email/templates/`:
   - `booking-request.tsx` (para host)
   - `booking-approved.tsx` (para guest)
   - `booking-rejected.tsx` (para guest)
2. Usar React Email o HTML templates
3. Incluir detalles de reserva
4. Incluir links relevantes (WhatsApp, panel admin)

**Criterios de aceptación**:
- [ ] Templates funcionan
- [ ] Diseño responsive
- [ ] Todos los datos dinámicos se renderizan
- [ ] Links funcionan correctamente

**Dependencias**: F2-011

---

### F2-013: Funciones de envío de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear funciones helper para enviar diferentes emails.

**Tareas**:
1. Crear `src/lib/email/send.ts`
2. Funciones:
   - `sendBookingRequestEmail(to: string, booking: Booking)`
   - `sendBookingApprovedEmail(to: string, booking: Booking)`
   - `sendBookingRejectedEmail(to: string, booking: Booking)`
3. Manejo de errores
4. Logging de emails enviados

**Criterios de aceptación**:
- [ ] Todas las funciones envían emails
- [ ] Manejo de errores robusto
- [ ] Logs para debugging

**Dependencias**: F2-012

---

### F2-014: Integrar notificaciones en API
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Llamar funciones de email desde endpoints de booking.

**Tareas**:
1. En POST `/api/bookings`: enviar email a host
2. En PATCH `/api/bookings/[id]` (approved): enviar email a guest
3. En PATCH (rejected): enviar email a guest
4. No bloquear request si email falla (async)

**Criterios de aceptación**:
- [ ] Emails se envían en momentos correctos
- [ ] Fallos de email no rompen booking
- [ ] Emails se encolan si es posible

**Dependencias**: F2-013, F2-009

---



## 🗂️ EPIC 2.3: API de Reservas

## 🗂️ EPIC 2.5: Panel Admin - Gestión de Reservas

### F2-015: Página listado de reservas `/admin/bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Dashboard para ver todas las reservas.

**Tareas**:
1. Crear `src/app/admin/bookings/page.tsx`
2. Tabla con columnas:
   - ID
   - Guest name
   - Fechas (check-in / check-out)
   - Noches
   - Total
   - Status
   - Acciones
3. Filtros: status, fecha
4. Paginación
5. Loading states

**Criterios de aceptación**:
- [ ] Muestra todas las reservas
- [ ] Filtros funcionan
- [ ] Paginación funciona
- [ ] Responsive

**Dependencias**: F2-008

---

### F2-016: Página detalle de reserva `/admin/bookings/[id]`
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Vista detallada de una reserva individual.

**Tareas**:
1. Crear `src/app/admin/bookings/[id]/page.tsx`
2. Mostrar todos los detalles:
   - Info del guest (con link WhatsApp)
   - Fechas y precios
   - Special requests
   - Timeline de acciones
3. Botones de acción: Aprobar / Rechazar
4. Campo para host_notes

**Criterios de aceptación**:
- [ ] Muestra todos los detalles
- [ ] Botones de acción funcionan
- [ ] Link WhatsApp correcto
- [ ] Actualiza en tiempo real tras acción

**Dependencias**: F2-015

---

### F2-017: Componente de aprobación/rechazo de reserva
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
UI para aprobar o rechazar reservas con confirmación.

**Tareas**:
1. Crear `src/components/admin/BookingActions.tsx`
2. Modal de confirmación antes de aprobar/rechazar
3. Campo opcional para mensaje al guest
4. Llamada a API PATCH
5. Actualizar UI tras éxito

**Criterios de aceptación**:
- [ ] Requiere confirmación
- [ ] Muestra loading durante action
- [ ] Maneja errores con mensajes claros
- [ ] Actualiza status inmediatamente

**Dependencias**: F2-016

---

## 🗂️ EPIC 2.6: Sincronización Airbnb (iCal)

### F2-018: Instalar parser iCal
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar librería para parsear formato iCal.

**Tareas**:
1. Instalar: `npm install ical.js` o `node-ical`
2. Crear utilidad en `src/lib/ical/parser.ts`

**Criterios de aceptación**:
- [ ] Librería instalada
- [ ] Puede parsear archivo iCal de prueba

**Dependencias**: Ninguna

---

### F2-019: Función de import iCal
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Función para importar y procesar calendario iCal de Airbnb.

**Tareas**:
1. Crear `src/lib/ical/import.ts`
2. Función `importAirbnbCalendar(icalUrl: string, propertyId: string)`:
   - Fetch iCal desde URL
   - Parsear eventos
   - Extraer fechas de reservas (DTSTART, DTEND)
   - Comparar con blocked_dates existentes (source: 'airbnb')
   - Insertar nuevos bloqueos
   - Eliminar bloqueos que ya no existen en Airbnb
3. Logging detallado
4. Manejo de errores de red

**Criterios de aceptación**:
- [ ] Importa correctamente desde URL iCal
- [ ] Parsea fechas correctamente
- [ ] Sincroniza cambios (add/remove)
- [ ] No duplica bloqueos
- [ ] Maneja errores gracefully

**Dependencias**: F2-018

---

### F2-020: API Route POST `/api/sync/airbnb` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Endpoint manual para trigger sync con Airbnb.

**Tareas**:
1. Crear `src/app/api/sync/airbnb/route.ts`
2. Llamar función de import iCal
3. Retornar resumen de cambios
4. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Trigger sync exitosamente
- [ ] Retorna resumen (X added, Y removed)
- [ ] Solo accesible por admin

**Dependencias**: F2-019

---

### F2-021: Cron job para sync automático
- **Prioridad**: 🟡 Media
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Configurar job automático para sincronizar cada 4 horas.

**Tareas**:
1. Opción A: Usar Vercel Cron Jobs (si disponible en free tier)
2. Opción B: Usar servicio externo (cron-job.org) que llame al endpoint
3. Configurar frecuencia: cada 4 horas
4. Agregar logging de ejecuciones
5. Notificar admin si falla

**Criterios de aceptación**:
- [ ] Sync ejecuta cada 4 horas
- [ ] Logs de ejecución disponibles
- [ ] Notifica si falla consistentemente

**Dependencias**: F2-020

---

### F2-022: Panel admin para configurar iCal URL
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
UI para que admin configure URL iCal de Airbnb.

**Tareas**:
1. Crear `src/app/admin/settings/page.tsx`
2. Formulario para actualizar `airbnb_ical_url` en property
3. Botón "Sincronizar ahora" (trigger manual)
4. Mostrar última sincronización exitosa

**Criterios de aceptación**:
- [ ] Puede guardar URL iCal
- [ ] Botón de sync manual funciona
- [ ] Muestra timestamp de última sync

**Dependencias**: F2-020

---

### F2-007: API Route POST `/api/bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 6 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para crear nuevas solicitudes de reserva.

**Tareas**:
1. Crear `src/app/api/bookings/route.ts`
2. Validar input con Zod
3. Verificar disponibilidad de fechas
4. Crear/actualizar guest en BD
5. Crear booking con status 'pending'
6. Calcular precios automáticamente
7. Prevenir double-booking (transaction)
8. Retornar ID de booking

**Validaciones**:
- [ ] Fechas no solapan con blocked_dates
- [ ] end_date > start_date
- [ ] num_guests <= max_guests
- [ ] Email válido
- [ ] Campos requeridos presentes

**Criterios de aceptación**:
- [ ] Endpoint crea bookings exitosamente
- [ ] Previene double-booking
- [ ] Valida todos los campos
- [ ] Retorna errores descriptivos
- [ ] Performance < 500ms

**Dependencias**: F2-002

---

### F2-008: API Route GET `/api/bookings` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para listar todas las reservas (solo admin).

**Tareas**:
1. Crear handler GET con paginación
2. Filtros opcionales: status, date range
3. Join con guests y properties
4. Ordenar por created_at DESC
5. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Lista todas las reservas
- [ ] Paginación funciona
- [ ] Filtros funcionan
- [ ] Solo accesible por admin

**Dependencias**: F2-007

---

### F2-009: API Route PATCH `/api/bookings/[id]` (admin)
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Endpoint para que admin apruebe/rechace reservas.

**Tareas**:
1. Crear `src/app/api/bookings/[id]/route.ts`
2. Handler PATCH para actualizar status
3. Si status → 'approved':
   - Crear blocked_date con source: 'booking'
   - Trigger notificación email al guest
4. Si status → 'rejected':
   - Enviar email explicando (opcional)
5. Validar que booking existe y está en 'pending'
6. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Puede aprobar reservas
- [ ] Crea blocked_date al aprobar
- [ ] Envía notificación
- [ ] No puede aprobar booking ya procesado
- [ ] Solo accesible por admin

**Dependencias**: F2-008

---

## 🗂️ EPIC 2.4: Sistema de Notificaciones

### F2-010: Configurar cuenta Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Crear cuenta y configurar Resend para emails.

**Tareas**:
1. Crear cuenta en Resend.com
2. Verificar dominio (o usar test domain)
3. Obtener API key
4. Agregar a variables de entorno: `RESEND_API_KEY`

**Criterios de aceptación**:
- [ ] Cuenta creada
- [ ] API key obtenida
- [ ] Puede enviar emails de prueba

**Dependencias**: Ninguna

---

### F2-011: Instalar SDK Resend
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar y configurar SDK de Resend.

**Tareas**:
1. Instalar: `npm install resend`
2. Crear cliente en `src/lib/email/client.ts`:
   ```typescript
   import { Resend } from 'resend';
   export const resend = new Resend(process.env.RESEND_API_KEY);
   ```

**Criterios de aceptación**:
- [ ] SDK instalado
- [ ] Cliente configurado
- [ ] Puede enviar email de prueba

**Dependencias**: F2-010

---

### F2-012: Templates de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Crear templates HTML para diferentes tipos de emails.

**Tareas**:
1. Crear `src/lib/email/templates/`:
   - `booking-request.tsx` (para host)
   - `booking-approved.tsx` (para guest)
   - `booking-rejected.tsx` (para guest)
2. Usar React Email o HTML templates
3. Incluir detalles de reserva
4. Incluir links relevantes (WhatsApp, panel admin)

**Criterios de aceptación**:
- [ ] Templates funcionan
- [ ] Diseño responsive
- [ ] Todos los datos dinámicos se renderizan
- [ ] Links funcionan correctamente

**Dependencias**: F2-011

---

### F2-013: Funciones de envío de emails
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear funciones helper para enviar diferentes emails.

**Tareas**:
1. Crear `src/lib/email/send.ts`
2. Funciones:
   - `sendBookingRequestEmail(to: string, booking: Booking)`
   - `sendBookingApprovedEmail(to: string, booking: Booking)`
   - `sendBookingRejectedEmail(to: string, booking: Booking)`
3. Manejo de errores
4. Logging de emails enviados

**Criterios de aceptación**:
- [ ] Todas las funciones envían emails
- [ ] Manejo de errores robusto
- [ ] Logs para debugging

**Dependencias**: F2-012

---

### F2-014: Integrar notificaciones en API
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Llamar funciones de email desde endpoints de booking.

**Tareas**:
1. En POST `/api/bookings`: enviar email a host
2. En PATCH `/api/bookings/[id]` (approved): enviar email a guest
3. En PATCH (rejected): enviar email a guest
4. No bloquear request si email falla (async)

**Criterios de aceptación**:
- [ ] Emails se envían en momentos correctos
- [ ] Fallos de email no rompen booking
- [ ] Emails se encolan si es posible

**Dependencias**: F2-013, F2-009

---
## 🗂️ EPIC 2.5: Panel Admin - Gestión de Reservas

### F2-015: Página listado de reservas `/admin/bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Dashboard para ver todas las reservas.

**Tareas**:
1. Crear `src/app/admin/bookings/page.tsx`
2. Tabla con columnas:
   - ID
   - Guest name
   - Fechas (check-in / check-out)
   - Noches
   - Total
   - Status
   - Acciones
3. Filtros: status, fecha
4. Paginación
5. Loading states

**Criterios de aceptación**:
- [ ] Muestra todas las reservas
- [ ] Filtros funcionan
- [ ] Paginación funciona
- [ ] Responsive

**Dependencias**: F2-008

---

### F2-016: Página detalle de reserva `/admin/bookings/[id]`
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Vista detallada de una reserva individual.

**Tareas**:
1. Crear `src/app/admin/bookings/[id]/page.tsx`
2. Mostrar todos los detalles:
   - Info del guest (con link WhatsApp)
   - Fechas y precios
   - Special requests
   - Timeline de acciones
3. Botones de acción: Aprobar / Rechazar
4. Campo para host_notes

**Criterios de aceptación**:
- [ ] Muestra todos los detalles
- [ ] Botones de acción funcionan
- [ ] Link WhatsApp correcto
- [ ] Actualiza en tiempo real tras acción

**Dependencias**: F2-015

---

### F2-017: Componente de aprobación/rechazo de reserva
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
UI para aprobar o rechazar reservas con confirmación.

**Tareas**:
1. Crear `src/components/admin/BookingActions.tsx`
2. Modal de confirmación antes de aprobar/rechazar
3. Campo opcional para mensaje al guest
4. Llamada a API PATCH
5. Actualizar UI tras éxito

**Criterios de aceptación**:
- [ ] Requiere confirmación
- [ ] Muestra loading durante action
- [ ] Maneja errores con mensajes claros
- [ ] Actualiza status inmediatamente

**Dependencias**: F2-016

---

## 🗂️ EPIC 2.6: Sincronización Airbnb (iCal)

### F2-018: Instalar parser iCal
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar librería para parsear formato iCal.

**Tareas**:
1. Instalar: `npm install ical.js` o `node-ical`
2. Crear utilidad en `src/lib/ical/parser.ts`

**Criterios de aceptación**:
- [ ] Librería instalada
- [ ] Puede parsear archivo iCal de prueba

**Dependencias**: Ninguna

---

### F2-019: Función de import iCal
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Función para importar y procesar calendario iCal de Airbnb.

**Tareas**:
1. Crear `src/lib/ical/import.ts`
2. Función `importAirbnbCalendar(icalUrl: string, propertyId: string)`:
   - Fetch iCal desde URL
   - Parsear eventos
   - Extraer fechas de reservas (DTSTART, DTEND)
   - Comparar con blocked_dates existentes (source: 'airbnb')
   - Insertar nuevos bloqueos
   - Eliminar bloqueos que ya no existen en Airbnb
3. Logging detallado
4. Manejo de errores de red

**Criterios de aceptación**:
- [ ] Importa correctamente desde URL iCal
- [ ] Parsea fechas correctamente
- [ ] Sincroniza cambios (add/remove)
- [ ] No duplica bloqueos
- [ ] Maneja errores gracefully

**Dependencias**: F2-018

---

### F2-020: API Route POST `/api/sync/airbnb` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Endpoint manual para trigger sync con Airbnb.

**Tareas**:
1. Crear `src/app/api/sync/airbnb/route.ts`
2. Llamar función de import iCal
3. Retornar resumen de cambios
4. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Trigger sync exitosamente
- [ ] Retorna resumen (X added, Y removed)
- [ ] Solo accesible por admin

**Dependencias**: F2-019

---

### F2-021: Cron job para sync automático
- **Prioridad**: 🟡 Media
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Configurar job automático para sincronizar cada 4 horas.

**Tareas**:
1. Opción A: Usar Vercel Cron Jobs (si disponible en free tier)
2. Opción B: Usar servicio externo (cron-job.org) que llame al endpoint
3. Configurar frecuencia: cada 4 horas
4. Agregar logging de ejecuciones
5. Notificar admin si falla

**Criterios de aceptación**:
- [ ] Sync ejecuta cada 4 horas
- [ ] Logs de ejecución disponibles
- [ ] Notifica si falla consistentemente

**Dependencias**: F2-020

---

### F2-022: Panel admin para configurar iCal URL
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
UI para que admin configure URL iCal de Airbnb.

**Tareas**:
1. Crear `src/app/admin/settings/page.tsx`
2. Formulario para actualizar `airbnb_ical_url` en property
3. Botón "Sincronizar ahora" (trigger manual)
4. Mostrar última sincronización exitosa

**Criterios de aceptación**:
- [ ] Puede guardar URL iCal
- [ ] Botón de sync manual funciona
- [ ] Muestra timestamp de última sync

**Dependencias**: F2-020

---
## 🗂️ EPIC 2.5: Panel Admin - Gestión de Reservas

### F2-015: Página listado de reservas `/admin/bookings`
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Dashboard para ver todas las reservas.

**Tareas**:
1. Crear `src/app/admin/bookings/page.tsx`
2. Tabla con columnas:
   - ID
   - Guest name
   - Fechas (check-in / check-out)
   - Noches
   - Total
   - Status
   - Acciones
3. Filtros: status, fecha
4. Paginación
5. Loading states

**Criterios de aceptación**:
- [ ] Muestra todas las reservas
- [ ] Filtros funcionan
- [ ] Paginación funciona
- [ ] Responsive

**Dependencias**: F2-008

---

### F2-016: Página detalle de reserva `/admin/bookings/[id]`
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Vista detallada de una reserva individual.

**Tareas**:
1. Crear `src/app/admin/bookings/[id]/page.tsx`
2. Mostrar todos los detalles:
   - Info del guest (con link WhatsApp)
   - Fechas y precios
   - Special requests
   - Timeline de acciones
3. Botones de acción: Aprobar / Rechazar
4. Campo para host_notes

**Criterios de aceptación**:
- [ ] Muestra todos los detalles
- [ ] Botones de acción funcionan
- [ ] Link WhatsApp correcto
- [ ] Actualiza en tiempo real tras acción

**Dependencias**: F2-015

---

### F2-017: Componente de aprobación/rechazo de reserva
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
UI para aprobar o rechazar reservas con confirmación.

**Tareas**:
1. Crear `src/components/admin/BookingActions.tsx`
2. Modal de confirmación antes de aprobar/rechazar
3. Campo opcional para mensaje al guest
4. Llamada a API PATCH
5. Actualizar UI tras éxito

**Criterios de aceptación**:
- [ ] Requiere confirmación
- [ ] Muestra loading durante action
- [ ] Maneja errores con mensajes claros
- [ ] Actualiza status inmediatamente

**Dependencias**: F2-016

---

## 🗂️ EPIC 2.6: Sincronización Airbnb (iCal)

### F2-018: Instalar parser iCal
- **Prioridad**: 🔴 Alta
- **Estimación**: 1 punto
- **Estado**: 📝

**Descripción**:
Instalar librería para parsear formato iCal.

**Tareas**:
1. Instalar: `npm install ical.js` o `node-ical`
2. Crear utilidad en `src/lib/ical/parser.ts`

**Criterios de aceptación**:
- [ ] Librería instalada
- [ ] Puede parsear archivo iCal de prueba

**Dependencias**: Ninguna

---

### F2-019: Función de import iCal
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Función para importar y procesar calendario iCal de Airbnb.

**Tareas**:
1. Crear `src/lib/ical/import.ts`
2. Función `importAirbnbCalendar(icalUrl: string, propertyId: string)`:
   - Fetch iCal desde URL
   - Parsear eventos
   - Extraer fechas de reservas (DTSTART, DTEND)
   - Comparar con blocked_dates existentes (source: 'airbnb')
   - Insertar nuevos bloqueos
   - Eliminar bloqueos que ya no existen en Airbnb
3. Logging detallado
4. Manejo de errores de red

**Criterios de aceptación**:
- [ ] Importa correctamente desde URL iCal
- [ ] Parsea fechas correctamente
- [ ] Sincroniza cambios (add/remove)
- [ ] No duplica bloqueos
- [ ] Maneja errores gracefully

**Dependencias**: F2-018

---

### F2-020: API Route POST `/api/sync/airbnb` (admin)
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Endpoint manual para trigger sync con Airbnb.

**Tareas**:
1. Crear `src/app/api/sync/airbnb/route.ts`
2. Llamar función de import iCal
3. Retornar resumen de cambios
4. Requiere autenticación admin

**Criterios de aceptación**:
- [ ] Trigger sync exitosamente
- [ ] Retorna resumen (X added, Y removed)
- [ ] Solo accesible por admin

**Dependencias**: F2-019

---

### F2-021: Cron job para sync automático
- **Prioridad**: 🟡 Media
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Configurar job automático para sincronizar cada 4 horas.

**Tareas**:
1. Opción A: Usar Vercel Cron Jobs (si disponible en free tier)
2. Opción B: Usar servicio externo (cron-job.org) que llame al endpoint
3. Configurar frecuencia: cada 4 horas
4. Agregar logging de ejecuciones
5. Notificar admin si falla

**Criterios de aceptación**:
- [ ] Sync ejecuta cada 4 horas
- [ ] Logs de ejecución disponibles
- [ ] Notifica si falla consistentemente

**Dependencias**: F2-020

---

### F2-022: Panel admin para configurar iCal URL
- **Prioridad**: 🟡 Media
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
UI para que admin configure URL iCal de Airbnb.

**Tareas**:
1. Crear `src/app/admin/settings/page.tsx`
2. Formulario para actualizar `airbnb_ical_url` en property
3. Botón "Sincronizar ahora" (trigger manual)
4. Mostrar última sincronización exitosa

**Criterios de aceptación**:
- [ ] Puede guardar URL iCal
- [ ] Botón de sync manual funciona
- [ ] Muestra timestamp de última sync

**Dependencias**: F2-020

---

## 📊 Resumen Fase 2

| Epic | Tickets | Puntos | Prioridad Alta |
|------|---------|--------|----------------|
| 2.1 Esquema Reservas | 2 | 7 | 2 |
| 2.2 Formulario | 4 | 15 | 3 |
| 2.3 API Reservas | 3 | 14 | 2 |
| 2.4 Notificaciones | 5 | 11 | 4 |
| 2.5 Panel Admin | 3 | 13 | 3 |
| 2.6 Sync Airbnb | 5 | 16 | 1 |
| 2.7 Testing/Deploy | 3 | 8 | 2 |
| **TOTAL** | **25** | **84** | **17** |

---

# FASE 3: CHAT INTERNO

**Duración total estimada**: 2-3 semanas (42-48 puntos)

---

## 🗂️ EPIC 3.1: Esquema de Datos - Chat

### F3-001: Crear tabla `messages`
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Crear tabla para mensajes del chat.

**Tareas**:
1. Crear migration:
   ```sql
   CREATE TABLE messages (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
     sender_id UUID NOT NULL,
     sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('guest', 'host')),
     message TEXT NOT NULL,
     read BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   CREATE INDEX idx_messages_booking ON messages(booking_id);
   CREATE INDEX idx_messages_created ON messages(created_at DESC);
   ```
2. Configurar RLS (guest ve solo sus mensajes)
3. Habilitar Realtime en tabla
4. Crear types TypeScript

**Criterios de aceptación**:
- [ ] Tabla creada
- [ ] RLS configurado
- [ ] Realtime habilitado
- [ ] Types generados

**Dependencias**: Ninguna (independiente)

---

### F3-002: Configurar Supabase Realtime
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Habilitar y configurar Realtime en Supabase.

**Tareas**:
1. Habilitar Realtime en tabla messages (Supabase dashboard)
2. Configurar RLS policies para subscriptions
3. Crear utilidad para suscribirse a cambios:
   ```typescript
   // src/lib/supabase/realtime.ts
   export function subscribeToMessages(bookingId: string, callback: Function)
   ```

**Criterios de aceptación**:
- [ ] Realtime habilitado
- [ ] Subscripciones funcionan
- [ ] Callbacks ejecutan correctamente

**Dependencias**: F3-001

---

## 🗂️ EPIC 3.2: Componentes de Chat

### F3-003: Componente `ChatBubble`
- **Prioridad**: 🔴 Alta
- **Estimación**: 2 puntos
- **Estado**: 📝

**Descripción**:
Componente individual de mensaje en el chat.

**Tareas**:
1. Crear `src/components/chat/ChatBubble.tsx`
2. Diseño estilo WhatsApp:
   - Mensajes guest: alineados izquierda, color gris
   - Mensajes host: alineados derecha, color azul
3. Mostrar timestamp
4. Indicador de leído/no leído

**Props**:
```typescript
interface ChatBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}
```

**Criterios de aceptación**:
- [ ] Diseño correcto según sender
- [ ] Timestamp visible
- [ ] Responsive

**Dependencias**: Ninguna

---

### F3-004: Componente `ChatWindow`
- **Prioridad**: 🔴 Alta
- **Estimación**: 5 puntos
- **Estado**: 📝

**Descripción**:
Ventana principal de chat con lista de mensajes.

**Tareas**:
1. Crear `src/components/chat/ChatWindow.tsx`
2. Lista de mensajes con scroll automático al último
3. Integración con subscription Realtime
4. Auto-scroll al recibir nuevo mensaje
5. Loading state inicial
6. Empty state si no hay mensajes

**Props**:
```typescript
interface ChatWindowProps {
  bookingId: string;
  currentUserId: string;
  currentUserType: 'guest' | 'host';
}
```

**Criterios de aceptación**:
- [ ] Muestra mensajes en orden cronológico
- [ ] Scroll funciona correctamente
- [ ] Nuevos mensajes aparecen en tiempo real
- [ ] Responsive

**Dependencias**: F3-002, F3-003

---

### F3-005: Componente `ChatInput`
- **Prioridad**: 🔴 Alta
- **Estimación**: 3 puntos
- **Estado**: 📝

**Descripción**:
Input para escribir y enviar mensajes.

**Tareas**:
1. Crear `src/components/chat/ChatInput.tsx`
2. Textarea con auto-resize
3. Botón de enviar
4. Enter para enviar, Shift+Enter para nueva línea
5. Validación (no vacío, max 2000 caracteres)
6. Loading state durante envío

**Criterios de aceptación**:
- [ ] Textarea responsive
- [ ] Atajos de teclado funcionan
- [ ] Validación correcta
- [ ] No permite enviar mensajes vacíos

**Dependencias**: Ninguna

---

### F3-006: Componente `ChatContainer` (completo)
- **Prioridad**: 🔴 Alta
- **Estimación**: 4 puntos
- **Estado**: 📝

**Descripción**:
Container que integra ventana + input.

**Tareas**:
1. Crear `src/components/chat/ChatContainer.tsx`
2. Integrar `ChatWindow` + `ChatInput`
3. Manejo de estado de mensajes
4. Función para enviar mensaje (POST a API)
5. Indicador de "escribiendo..." (opcional)

**Criterios de aceptación**:
- [ ] Chat funcional end-to-end
- [ ] Mensajes se envían y reciben en tiempo real
- [ ] Estado sincronizado correctamente

**Dependencias**: F3-004, F3-005

---