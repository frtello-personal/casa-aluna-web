# 🗺️ Casa Aluna - Hoja de Ruta del Proyecto

**Última actualización**: 9 de noviembre, 2026  
**Estado**: Aprobado - Listo para desarrollo

---

## 📊 Resumen Ejecutivo

**Proyecto**: Plataforma de reservas directas para casa vacacional  
**Alcance**: 1 propiedad, tráfico bajo (<1000 usuarios/mes)  
**Presupuesto**: $0-5 USD/mes  
**Duración total estimada**: 16-24 semanas (4 fases)

---

## 🎯 Objetivos del Proyecto

### Objetivo General
Crear una plataforma web para gestionar reservas de Casa Aluna, reduciendo dependencia de Airbnb y ofreciendo canal directo de reservas con integración de pagos.

### Objetivos Específicos por Fase

**Fase 1**: Mostrar propiedad profesionalmente con calendario visual  
**Fase 2**: Permitir solicitudes de reserva y gestión manual  
**Fase 3**: Centralizar comunicación huésped-host  
**Fase 4**: Automatizar pagos locales e internacionales

---

## 🏗️ Arquitectura Técnica

### Decisión de Arquitectura: **MONOLITO CON NEXT.JS**

#### Justificación
- ✅ **Costo cero**: Vercel Free Tier optimizado para Next.js
- ✅ **Simplicidad**: Frontend y backend en mismo proyecto
- ✅ **Escalabilidad suficiente**: Para volumen esperado
- ✅ **Developer Experience**: Todo en TypeScript, un solo deploy
- ✅ **Mantenibilidad**: Un solo codebase para gestionar

#### Componentes de la Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    VERCEL HOSTING                        │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         NEXT.JS 16 MONOLITH                    │    │
│  │                                                 │    │
│  │  ┌──────────────┐      ┌──────────────────┐  │    │
│  │  │   Frontend   │      │   Backend        │  │    │
│  │  │   (Pages)    │◄────►│  (API Routes +   │  │    │
│  │  │   React 19   │      │  Server Actions) │  │    │
│  │  └──────────────┘      └──────────────────┘  │    │
│  │                                                 │    │
│  └────────────────────────────────────────────────┘    │
│                         │                               │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │      SUPABASE (PostgreSQL)          │
        │  • Database (relational)            │
        │  • Storage (images/videos)          │
        │  • Realtime (chat - Fase 3)         │
        │  • Auth (futuro multi-propiedad)    │
        └─────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌─────────┐    ┌──────────┐    ┌──────────┐
    │ Airbnb  │    │  Resend  │    │  Stripe  │
    │  iCal   │    │  (Email) │    │ (Pagos)  │
    └─────────┘    └──────────┘    └──────────┘
     (Fase 2)       (Fase 2)        (Fase 4)
```

---

## 🛠️ Stack Técnico Completo

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.2.2 | Framework principal (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

### Backend
| Tecnología | Uso |
|------------|-----|
| Next.js API Routes | Endpoints REST |
| Next.js Server Actions | Operaciones de BD (alternativa a API) |
| Vercel Edge Functions | Lógica serverless ligera |

### Base de Datos
| Servicio | Plan | Uso |
|----------|------|-----|
| Supabase PostgreSQL | Free (500MB) | Base de datos principal |
| Supabase Storage | Free (1GB) | Imágenes y videos |
| Supabase Realtime | Free | Chat en tiempo real (Fase 3) |

### Integraciones
| Servicio | Plan | Fase | Uso |
|----------|------|------|-----|
| Airbnb iCal | Gratis | 2 | Sincronización calendario (solo lectura) |
| Resend | Free (3000 emails/mes) | 2 | Notificaciones por email |
| Stripe | Pay per use | 4 | Procesamiento de pagos |
| PostHog | Ya configurado | 1 | Analytics |
| WhatsApp Link | Gratis | 1-4 | Contacto directo |

### Hosting & Deploy
| Servicio | Plan | Recursos |
|----------|------|----------|
| Vercel | Free Tier | 100GB bandwidth/mes, deploy ilimitados |

---

## 🛠️ Stack Técnico Completo

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.2.2 | Framework principal (App Router) |
| React | 19.2.4 | UI Library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |

### Backend
| Tecnología | Uso |
|------------|-----|

---

## 💾 Modelo de Datos

### Esquema de Base de Datos (Supabase/PostgreSQL)

#### Tabla: `properties`
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

#### Tabla: `blocked_dates`
```sql
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  source VARCHAR(50) NOT NULL,
  source_id UUID,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    property_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  )
);

CREATE INDEX idx_blocked_dates_property_dates 
  ON blocked_dates(property_id, start_date, end_date);
```

#### Tabla: `guests`
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

#### Tabla: `bookings`
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_guests INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
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

#### Tabla: `messages` (Fase 3)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

#### Tabla: `payments` (Fase 4)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  transaction_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
```
| Next.js API Routes | Endpoints REST |
| Next.js Server Actions | Operaciones de BD (alternativa a API) |
| Vercel Edge Functions | Lógica serverless ligera |

### Base de Datos
| Servicio | Plan | Uso |
|----------|------|-----|
| Supabase PostgreSQL | Free (500MB) | Base de datos principal |
| Supabase Storage | Free (1GB) | Imágenes y videos |
| Supabase Realtime | Free | Chat en tiempo real (Fase 3) |

### Integraciones
| Servicio | Plan | Fase | Uso |
|----------|------|------|-----|
| Airbnb iCal | Gratis | 2 | Sincronización calendario (solo lectura) |
| Resend | Free (3000 emails/mes) | 2 | Notificaciones por email |
| Stripe | Pay per use | 4 | Procesamiento de pagos |
| PostHog | Ya configurado | 1 | Analytics |
| WhatsApp Link | Gratis | 1-4 | Contacto directo |

### Hosting & Deploy
| Servicio | Plan | Recursos |
|----------|------|----------|
| Vercel | Free Tier | 100GB bandwidth/mes, deploy ilimitados |

---

## 💾 Modelo de Datos

### Esquema de Base de Datos (Supabase/PostgreSQL)

#### Tabla: `properties`
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

#### Tabla: `blocked_dates`
```sql
CREATE TABLE blocked_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  source VARCHAR(50) NOT NULL,
  source_id UUID,
  reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    property_id WITH =,
    daterange(start_date, end_date, '[]') WITH &&
  )
);

CREATE INDEX idx_blocked_dates_property_dates 
  ON blocked_dates(property_id, start_date, end_date);
```

#### Tabla: `guests`
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

#### Tabla: `bookings`
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_guests INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
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

#### Tabla: `messages` (Fase 3)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

---

## 📅 Fases del Proyecto

### **FASE 1: SHOWCASE + CALENDARIO VISUAL**
**Duración estimada**: 2-3 semanas  
**Objetivo**: Mostrar propiedad profesionalmente con calendario visual de disponibilidad

#### Funcionalidades
- ✅ Migración de datos hardcoded a Supabase
- ✅ Galería de imágenes/videos dinámica desde BD
- ✅ Calendario visual mostrando fechas bloqueadas
- ✅ Panel admin básico para host (bloquear fechas manualmente)
- ✅ API Routes para obtener datos de propiedad
- ✅ Deploy en Vercel

#### Entregables
- Base de datos configurada en Supabase
- Datos migrados (property, images, amenities)
- Calendario funcional (solo lectura para usuarios)
- Panel admin para bloqueo manual de fechas
- App deployada en Vercel

#### Sin hacer en esta fase
- ❌ Reservas
- ❌ Sincronización Airbnb
- ❌ Chat
- ❌ Pagos

---

### **FASE 2: SISTEMA DE RESERVAS + SYNC AIRBNB**
**Duración estimada**: 3-4 semanas  
**Objetivo**: Permitir solicitudes de reserva, gestión de huéspedes y sincronización básica con Airbnb

#### Funcionalidades
- ✅ Formulario de solicitud de reserva
- ✅ Validación de fechas disponibles
- ✅ Registro de datos de huéspedes (RGPD compliant)
- ✅ Notificaciones por email (Resend)
- ✅ Panel admin: gestión de reservas (aprobar/rechazar)
- ✅ Importación calendario Airbnb (iCal parsing)
- ✅ Bloqueo automático de fechas en tu calendario al aprobar
- ✅ Link WhatsApp generado con datos de reserva

#### Flujo de Reserva
```
1. Huésped selecciona fechas disponibles
2. Completa formulario (nombre, email, teléfono, WhatsApp)
3. Sistema crea booking (status: pending)
4. Sistema guarda/actualiza guest
5. Host recibe email con detalles
6. Host contacta huésped por WhatsApp (link en email)
7. Si acuerdan, Host aprueba en panel admin
8. Al aprobar:
   - Booking status → approved
   - Se crea blocked_date (source: booking)
   - Se envía email confirmación al huésped
   - Host bloquea manualmente en Airbnb (por ahora)
```

#### Sincronización Airbnb (iCal)
- Import automático cada 4 horas del iCal de Airbnb
- Parse de fechas bloqueadas
- Creación de blocked_dates (source: airbnb)
- Prevención de double-booking

#### Entregables
- CRUD completo de bookings y guests
- Sistema de notificaciones (Resend)
- Panel admin con dashboard de reservas
- Parser iCal funcional
- Job/cron para sync periódico

---

### **FASE 3: CHAT INTERNO**
**Duración estimada**: 2-3 semanas  
**Objetivo**: Centralizar comunicación huésped-host dentro de la app

#### Funcionalidades
- ✅ Chat en tiempo real (Supabase Realtime)
- ✅ UI de chat tipo WhatsApp Web
- ✅ Notificaciones de mensajes no leídos
- ✅ Historial de conversaciones por booking
- ✅ Opción de aprobar reserva desde el chat

#### Flujo Actualizado
```
1. Huésped solicita reserva
2. Se abre chat automáticamente asociado al booking
3. Huésped y host conversan en la app
4. Si acuerdan, host aprueba desde el chat
5. Flujo de aprobación igual que Fase 2
```

#### Entregables
- Componente de chat funcional
- Sistema de notificaciones en tiempo real
- Indicadores de mensajes no leídos
- Historial persistente

---

---

## 💰 Análisis de Costos

### Costos por Fase

| Fase | Hosting | BD | Email | Pagos | Total/mes |
|------|---------|----|----|-------|-----------|
| **Fase 1** | $0 (Vercel) | $0 (Supabase Free) | N/A | N/A | **$0** |
| **Fase 2** | $0 | $0 | $0 (Resend Free) | N/A | **$0** |
| **Fase 3** | $0 | $0 | $0 | N/A | **$0** |
| **Fase 4** | $0 | $0 | $0 | Solo % transacción | **$0 fijo** |

### Límites Free Tier (monitorear)

| Servicio | Límite Free | Qué pasa si superas |
|----------|-------------|---------------------|
| Vercel | 100GB bandwidth/mes | Upgrade a Pro ($20/mes) |
| Supabase | 500MB BD + 2GB bandwidth | Upgrade a Pro ($25/mes) |
| Resend | 3000 emails/mes | Upgrade a pay-as-you-go ($1/1000 emails) |
| Stripe | N/A (solo comisión) | N/A |

**Nota**: Con 1 propiedad y <1000 usuarios/mes, no deberías superar ningún límite.

---

## 🔄 Estrategia de Sincronización Airbnb

### Opción Implementada: **iCal Import (Unidireccional)**

#### Cómo funciona
1. Airbnb proporciona URL iCal pública del calendario
2. Tu app importa y parsea el iCal cada 4 horas (cron job)
3. Fechas ocupadas en Airbnb se marcan en `blocked_dates` (source: airbnb)
4. Calendario UI muestra todas las fechas bloqueadas (airbnb + manual + bookings)

#### Limitaciones
- ⚠️ **Solo lectura**: No puedes bloquear EN Airbnb desde tu app
- ⚠️ **Delay**: Sync cada 4 horas (no en tiempo real)
- ⚠️ **Bloqueo manual requerido**: Host debe bloquear en Airbnb tras aprobar reserva

#### Workflow de Bloqueo
```
Reserva aprobada en tu app → Host recibe recordatorio por email
→ Host abre Airbnb manualmente → Bloquea las fechas
→ En 4 horas, tu app confirma el bloqueo via iCal
```

### Futuro: **API Oficial Airbnb (Bidireccional)**

#### Cuándo considerarlo
- Si volumen de reservas > 20/mes
- Si el bloqueo manual se vuelve insostenible
- Si quieres automatización total

#### Requisitos
- Solicitar acceso a Airbnb (puede tardar 3-6 meses)
- Demostrar volumen de negocio
- Implementar OAuth y cumplir políticas Airbnb

**Decisión**: Posponer hasta validar demanda en Fase 2-3.

### **FASE 4: INTEGRACIÓN DE PAGOS**
**Duración estimada**: 4-6 semanas  
**Objetivo**: Procesar pagos locales (PSE) e internacionales (tarjetas)

#### Funcionalidades
- ✅ Integración Stripe Checkout
- ✅ Soporte PSE (Colombia)
- ✅ Soporte tarjetas internacionales
- ✅ Webhooks para confirmación de pagos
- ✅ Generación de recibos/facturas
- ✅ Bloqueo automático calendario tras pago exitoso
- ✅ Política de cancelaciones y reembolsos

#### Flujo de Pago
```
1. Huésped solicita reserva
2. Conversación en chat (opcional)
3. Host aprueba reserva
4. Sistema genera link de pago Stripe
5. Huésped recibe email con link de pago
6. Huésped paga (PSE o tarjeta)
7. Webhook confirma pago → payment status: completed
8. Booking status → confirmed
9. Se bloquea calendario local automáticamente
10. Host bloquea manualmente en Airbnb (o API si disponible)
11. Se envían confirmaciones finales
```

#### Consideraciones
- **Stripe fees**: ~2.9% + $0.30 USD por transacción
- **PSE adicional**: ~$0.50 USD por transacción
- **Reembolsos**: Política a definir (ej: 100% si >30 días antes)

#### Entregables
- Integración completa Stripe
- Webhooks configurados y seguros
- Dashboard de pagos para host
- Recibos automáticos
- Política de cancelaciones implementada
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_booking ON messages(booking_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

#### Tabla: `payments` (Fase 4)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  transaction_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);

---

## 🎯 Métricas de Éxito por Fase

### Fase 1: Showcase
- [ ] 100% datos migrados correctamente
- [ ] Calendario visual funcional
- [ ] 0 errores críticos en producción
- [ ] Tiempo de carga < 2 segundos

### Fase 2: Reservas
- [ ] > 80% solicitudes de reserva completadas
- [ ] < 5 min tiempo de respuesta host (objetivo)
- [ ] 0 double-bookings
- [ ] Sync Airbnb funcional (4h delay aceptable)

### Fase 3: Chat
- [ ] > 90% conversaciones inician desde app (vs WhatsApp)
- [ ] Mensajes en tiempo real (< 1 seg latencia)
- [ ] 0 mensajes perdidos

### Fase 4: Pagos
- [ ] > 95% tasa de éxito en pagos
- [ ] < 2% tasa de chargebacks
- [ ] Tiempo checkout < 3 min
- [ ] 100% pagos reconciliados con bookings

---

## 🔒 Consideraciones de Seguridad

### Datos Sensibles
- [ ] Nunca almacenar datos de tarjetas (Stripe maneja todo)
- [ ] Hash/encrypt datos de documentos de huéspedes
- [ ] Implementar Row Level Security (RLS) en Supabase
- [ ] Variables de entorno para todas las API keys

### RGPD / Privacidad (Colombia - Ley 1581)
- [ ] Consentimiento explícito para guardar datos
- [ ] Política de privacidad visible
- [ ] Opción de eliminar cuenta/datos
- [ ] Datos mínimos necesarios

### Rate Limiting
- [ ] Limitar llamadas a API (Vercel Middleware)
- [ ] CAPTCHA en formularios críticos (opcional Fase 2)

---

## 📱 Responsive & UX

### Mobile-First
- ✅ 80%+ usuarios en móvil (esperado)
- ✅ Tailwind responsive utilities
- ✅ Touch targets > 44x44px
- ✅ Optimización imágenes (Next.js Image)

### Performance
- ✅ Lighthouse score > 90
- ✅ Lazy loading de imágenes
- ✅ Code splitting automático (Next.js)
- ✅ CDN global (Vercel Edge Network)

---

## 🚀 Deploy & CI/CD

### Estrategia de Branches
```
main (production)
  ← develop (staging)
      ← feature/* (desarrollo)
```

### Pipeline
1. Commit a feature branch
2. Vercel crea preview deployment automático
3. Merge a develop → Deploy a staging
4. Merge a main → Deploy a producción
5. PostHog tracking en todos los entornos

### Rollback
- Instant rollback en Vercel (1 click)
- DB migrations con Supabase Migration Tool

---

## 📚 Recursos y Referencias

### Documentación Clave
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Airbnb iCal Format](https://www.airbnb.com/help/article/99)

### Librerías Recomendadas
```json
{
  "@supabase/supabase-js": "^2.x",
  "stripe": "^14.x",
  "resend": "^3.x",
  "ical.js": "^1.x",
  "date-fns": "^3.x",
  "zod": "^3.x",
  "react-hook-form": "^7.x"
}
```

---

## ✅ Checklist Pre-Lanzamiento (Fase 1)

- [ ] Supabase proyecto creado
- [ ] Variables de entorno configuradas
- [ ] Datos migrados y validados
- [ ] Tests manuales completados
- [ ] Responsive verificado (móvil/tablet/desktop)
- [ ] Analytics PostHog funcionando
- [ ] SEO básico implementado
- [ ] Dominio configurado
- [ ] SSL activo
- [ ] Backup strategy definida

---

## 📞 Contacto y Soporte

**Proyecto Owner**: [Tu Nombre]  
**Developer**: [Tu Nombre]  
**Repositorio**: https://github.com/frtello-personal/casa-aluna-web

---

**Nota**: Este roadmap es un documento vivo. Actualizar después de cada fase completada.
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
```