'use client';

import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { PropertyMap } from '@/components/property/PropertyMap';
import { AmenityIcon } from '@/components/ui/AmenityIcon';
import { Modal } from '@/components/ui/Modal';
import { ImageGallery, type GalleryImage } from '@/components/ui/ImageGallery';
import { fullDescriptionText } from '@/data/fullDescription';

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600'] });

const property = {
  name: 'Casa Aluna',
  type: 'Casa de vacaciones',
  location: 'Colombia',
  bedrooms: 4,
  bathrooms: 5,
  guests: 14,
  rating: 5.0,
  reviewCount: 25,
  pricelow: '1.200.000',
  whatsapp: '+573165353326',
  description: (showModal: () => void) => (
    <>
      🌿 Escápate a Casa Aluna, una espectacular casa de descanso con servicio de limpieza incluido, diseñada para disfrutar en familia o amigos. Ubicada en Rozo, a solo 20 minutos del aeropuerto y de Cali. Aquí encontrarás amplios espacios, habitaciones y baños muy cómodos, piscina y jacuzzi climatizado, hermosos jardines y una atmósfera de tranquilidad donde la brisa, el canto de los pájaros y la visita de loros hacen parte de cada amanecer.
      <button onClick={showModal} style={{ background: 'none', border: 'none', color: '#1e3a5f', textDecoration: 'underline', cursor: 'pointer', fontSize: 'inherit', marginLeft: '5px' }}>
        Leer más
      </button>
    </>
  ),
  fullDescription: fullDescriptionText,
  amenities: [
    { icon: 'wifi', label: 'WiFi' }, { icon: 'pool', label: 'Piscina' },
    { icon: 'kitchen', label: 'Cocina equipada' }, { icon: 'airConditioning', label: 'Aire acondicionado' },
    { icon: 'jacuzzi', label: 'Jacuzzi' }, { icon: 'parking', label: 'Estacionamiento' },
    { icon: 'smartTv', label: 'Smart TV' }, { icon: 'security', label: 'Seguridad 24/7' },
    { icon: 'hotWater', label: 'Agua caliente' },
  ],
  rates: [
    { label: 'Temporada baja (por noche)', price: '$1.200.000 COP' },
    { label: 'Temporada alta (por noche)', price: '$1.500.000 COP' },
    { label: 'Semana Santa / Diciembre', price: '$3.000.000 COP' },
    { label: 'Tarifa de limpieza', price: 'Incluida' },
    { label: 'Depósito de seguridad', price: '$500.000 COP' },
  ],
  rules: [
    'Máximo 14 huéspedes',   '👥Todos los huéspedes deben enviar una foto de su documento de identificación oficial y completar el formulario previo a la llegada. Es posible que volvamos a solicitar esta información durante el alojamiento con fines de verificación.',
    '🔊 Respetamos la paz del entorno: No está permitido el uso de parlantes de sonido diferente al que se encuentra en Casa Aluna. El bafle debe permanecer solo dentro de la casa.',
    '🎉 No se permiten fiestas, ni música fuerte. El horario de silencio debe respetarse después de las 10:00 p. m. por consideración a los vecinos.',
    '🚭 Queda estrictamente prohibido fumar en el interior de la propiedad (incluyendo tabaco, cannabis u otras sustancias). Tampoco se permite el uso de drogas. La violación de esta regla dará lugar a una sanción de COP$300.000',
    '✋ Está prohibido el ingreso de personas adicionales a los registrados en la reserva.',
    '🐾 El ingreso de mascotas No está permitido, si tienes algún caso puntual se considerará el ingreso dependiendo el tipo y tamaño de la mascota. (Previo aviso).',
    '✋ Todo menor de edad debe ingresar en compañía de sus padres o tutor legal.',
    '👶 Los niños deben estar bajo supervisión constante, especialmente alrededor de los balcones, las ventanas o el jacuzzi (si corresponde).',
    '🚫 Estamos firmemente en contra de la explotación sexual de niños y adolescentes. Cualquier comportamiento sospechoso será reportado inmediatamente a las autoridades.',
    '🚫 Esta prohibido el uso de polvora.',
  ],
  images: [
    { src: '/images/galery/casa-aluna-hero.avif', alt: 'Casa Aluna - Vista principal', label: 'Vista principal' },
    { src: '/images/galery/casa-aluna-principal.avif', alt: 'Casa Aluna - Área principal', label: 'Área principal' },
  ] as GalleryImage[],
  reviewsList: [
    { initials: 'MG', name: 'María González', date: 'Marzo 2026', text: 'Increíble propiedad. La vista al mar es espectacular y las instalaciones están en perfecto estado. Definitivamente volveremos.' },
    { initials: 'JP', name: 'Juan Pérez', date: 'Febrero 2026', text: 'Excelente atención y una casa impecable. El acceso directo a la playa es un plus enorme. Muy recomendada.' },
    { initials: 'SL', name: 'Sarah Lewis', date: 'Enero 2026', text: 'Amazing place! The beach access and pool made our vacation unforgettable. The host was very responsive.' },
  ],
  reviewImages: [
    '1Reseñas Casa Aluna.JPG',
    '1.1Reseñas Casa Aluna.JPG',
    '2Reseñas Casa Aluna.JPG',
    '3Reseñas Casa Aluna.JPG',
    '4Reseñas Casa Aluna.JPG',
    '5Reseñas Casa Aluna.JPG',
    '6Reseñas Casa Aluna.JPG',
    '7Reseñas Casa Aluna.JPG',
    '8Reseñas Casa Aluna.JPG',
    '9. Reseñas Casa Aluna 4 estrellas.JPG',
    '10. Reseñas Casa Aluna.JPG',
  ].map((file, i): GalleryImage => ({
    src: `/images/resenas/${encodeURIComponent(file)}`,
    alt: `Reseña ${i + 1} de Casa Aluna`,
    label: `Reseña ${i + 1}`,
  })),
};

const TABS = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'imagenes', label: 'Imágenes' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'ubicacion', label: 'Ubicación' },
  { id: 'tarifas', label: 'Tarifas' },
  { id: 'disponibilidad', label: 'Disponibilidad' },
  { id: 'resenas', label: 'Reseñas' },
];

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const UNAVAILABLE = [4, 5, 11, 12, 18, 19];

function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<number | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); setSelected(null); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); setSelected(null); };

  return (
    <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '20px', border: '1px solid #f3f4f6', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <button onClick={prev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px', padding: '4px 8px' }}>◀</button>
        <span style={{ fontSize: '14px', fontWeight: '500' }}>{MONTHS[month]} {year}</span>
        <button onClick={next} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px', padding: '4px 8px' }}>▶</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
        {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(d => (
          <div key={d} style={{ fontSize: '11px', color: '#9ca3af', padding: '4px 0', fontWeight: '500' }}>{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
          const unavail = UNAVAILABLE.includes(d);
          const isSel = selected === d;
          return (
            <div
              key={d}
              onClick={() => !unavail && setSelected(d)}
              style={{
                padding: '7px 4px',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: unavail ? 'default' : 'pointer',
                background: isSel ? '#1e3a5f' : 'transparent',
                color: isSel ? 'white' : unavail ? '#d1d5db' : '#374151',
                textDecoration: unavail ? 'line-through' : 'none',
                fontWeight: isSel ? '500' : '400',
              }}
            >{d}</div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', fontSize: '11px', color: '#6b7280' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e5e7eb', display: 'inline-block' }} /> No disponible
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#bfdbfe', display: 'inline-block' }} /> Disponible
        </span>
      </div>
    </div>
  );
}

function generateWhatsAppLink(phone: string): string {
  const msg = encodeURIComponent('Hola! Me interesa reservar Casa Aluna. Por favor indíquenme disponibilidad y detalles.');
  return `https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`;
}

export default function CasaAlunaPage() {
  const [activeTab, setActiveTab] = useState('descripcion');
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showFullDescriptionModal, setShowFullDescriptionModal] = useState(false);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveTab(e.target.id); }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    TABS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const c = { border: '1px solid #f3f4f6', padding: '40px 48px', borderBottom: '1px solid #f3f4f6' } as const;

    const formatDescription = (text: string) => {
    const normalizedText = text.replace(/\\\\n/g, '\n');
    const paragraphs = normalizedText.split(/\n{2,}/); // Divide por dos o más saltos de línea para los párrafos

    return paragraphs.map((paragraph, pIndex) => {
      const lines = paragraph.split('\n');
      return (
        <React.Fragment key={pIndex}>
          {lines.map((line, lIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null; // Ignorar líneas vacías después de recortar

            if (trimmedLine.startsWith('•')) {
              return <li key={`${pIndex}-${lIndex}`} style={{ marginBottom: '8px', fontSize: '15px', color: '#4b5563', lineHeight: '1.75', marginLeft: '20px' }}>{trimmedLine.substring(1).trim()}</li>;
            }
            if (trimmedLine.startsWith('✔')) {
              return <li key={`${pIndex}-${lIndex}`} style={{ marginBottom: '8px', fontSize: '15px', color: '#4b5563', lineHeight: '1.75', marginLeft: '20px' }}>{trimmedLine.substring(1).trim()}</li>;
            }
            if (trimmedLine.startsWith('🔒 Reglas de la casa') || trimmedLine.startsWith('El espacio') || trimmedLine.startsWith('Acceso de los huéspedes') || trimmedLine.startsWith('Otros aspectos a destacar')) {
              return <h3 key={`${pIndex}-${lIndex}`} style={{ fontSize: '18px', fontWeight: '600', marginTop: '24px', marginBottom: '12px' }}>{trimmedLine}</h3>;
            }
            if (trimmedLine.startsWith('🛏️') || trimmedLine.startsWith('🏡') || trimmedLine.startsWith('💦') || trimmedLine.startsWith('🌴') || trimmedLine.startsWith('🛎️') || trimmedLine.startsWith('🦋')) {
              return <h3 key={`${pIndex}-${lIndex}`} style={{ fontSize: '18px', fontWeight: '600', marginTop: '24px', marginBottom: '12px' }}>{trimmedLine}</h3>;
            }
            // Los párrafos que comienzan con '🌿' ahora serán <p> normales
            return <p key={`${pIndex}-${lIndex}`} style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.75', marginBottom: '16px' }}>{trimmedLine}</p>;
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <main className={jakarta.className} style={{ background: 'white', minHeight: '100vh' }}>

      {/* Hero — full width */}
      <div style={{ position: 'relative', width: '100%', height: '460px', background: '#0f2744', display: 'flex', alignItems: 'flex-end' }}>
        <Image
          src="/images/casa-aluna-hero.jpg"
          alt="Casa Aluna - Vista principal"
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center center', zIndex: 0 }}
          priority
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.38)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '32px 48px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', padding: '3px 10px', background: 'rgba(255,255,255,0.1)', display: 'inline-block', marginBottom: '10px' }}>
            {property.type}
          </span>
          <h1 style={{ fontSize: '34px', fontWeight: '600', color: 'white', margin: '0 0 6px' }}>{property.name}</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', margin: 0 }}>📍 {property.location}</p>
        </div>
        <button
          onClick={() => scrollToSection('imagenes')}
          style={{ position: 'absolute', bottom: '24px', right: '48px', zIndex: 2, background: 'rgba(255,255,255,0.92)', color: '#1e3a5f', border: 'none', borderRadius: '8px', padding: '9px 16px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
        >
          Ver más fotos
        </button>
      </div>

      {/* Centered content wrapper */}
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Stats bar */}
        <div style={{ display: 'flex', borderBottom: '1px solid #f3f4f6' }}>
          {[
            { num: property.bedrooms, label: 'Habitaciones' },
            { num: property.bathrooms, label: 'Baños' },
            { num: property.guests, label: 'Huéspedes' },
            { num: `${property.rating}★`, label: 'Calificación' },
          ].map((s, i, arr) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '18px 8px', borderRight: i < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827' }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Sticky nav tabs */}
        <div ref={tabsRef} style={{ position: 'sticky', top: 0, zIndex: 20, display: 'flex', overflowX: 'auto', borderBottom: '1px solid #f3f4f6', background: 'white', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => scrollToSection(tab.id)} className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`} style={{}}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        <div style={{ paddingBottom: '100px' }}>

          <section id="descripcion" style={c}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Descripción</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.75' }}>{property.description(() => setShowFullDescriptionModal(true))}</p>
          </section>

          <section id="imagenes" style={c}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Imágenes</h2>
            <ImageGallery images={property.images} moreLabel="Más imágenes" />
          </section>

          <section id="servicios" style={c}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Servicios</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {property.amenities.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', flexShrink: 0 }}>
                    <AmenityIcon name={a.icon} size={24} />
                  </div>
                  <span style={{ fontSize: '14px', color: '#374151' }}>{a.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="ubicacion" style={c}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Ubicación</h2>
            <PropertyMap location="JJM4+QP, Palmira, Valle del Cauca" />
            <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '12px', lineHeight: '1.6' }}>Colombia · Acceso directo a la playa · A 10 min del aeropuerto</p>
          </section>

          <section id="tarifas" style={c}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Tarifas (mínimo 2 noches)</h2>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <tbody>
                {property.rates.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 0', color: '#4b5563' }}>{r.label}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '500', color: '#111827' }}>{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '16px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '16px' }}>
              <p style={{ fontSize: '13px', color: '#92400e', fontWeight: '500', marginBottom: '8px' }}>Normas de reserva</p>
              {property.rules.map((r, i) => <p key={i} style={{ fontSize: '13px', color: '#b45309', marginBottom: '4px' }}>· {r}</p>)}
            </div>
          </section>

          <section id="disponibilidad" style={c}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Disponibilidad</h2>
            <Calendar />
          </section>

          <section id="resenas" style={{ ...c, borderBottom: 'none' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Reseñas</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '32px', fontWeight: '600' }}>5.0</span>
              <div>
                <div style={{ color: '#f59e0b', fontSize: '16px' }}>★★★★★</div>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{property.reviewCount} reseñas</div>
              </div>
            </div>
            {property.reviewsList.map((r, i) => (
              <div key={i} style={{ borderBottom: i < property.reviewsList.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: '20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '500', color: '#1d4ed8', flexShrink: 0 }}>{r.initials}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500' }}>{r.name}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>{r.date}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: '#f59e0b', fontSize: '13px' }}>★★★★★</div>
                </div>
                <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.65' }}>{r.text}</p>
              </div>
            ))}
            <ImageGallery images={property.reviewImages} showGrid={false} moreLabel="Más reseñas" />
          </section>

        </div>
      </div>

      {/* Sticky bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 30, background: 'white', borderTop: '1px solid #f3f4f6', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{property.name}</div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            desde <span style={{ color: '#111827', fontWeight: '600', fontSize: '16px' }}>${property.pricelow}</span> COP / noche
          </div>
        </div>
        <a href={generateWhatsAppLink(property.whatsapp)} target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500', padding: '12px 22px', borderRadius: '10px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Reservar ahora
        </a>
      </div>

      {showFullDescriptionModal && (
        <Modal title="Descripción Completa" isOpen={showFullDescriptionModal} onClose={() => setShowFullDescriptionModal(false)}>
          {formatDescription(property.fullDescription)}
        </Modal>
      )}
    </main>
  );
}
