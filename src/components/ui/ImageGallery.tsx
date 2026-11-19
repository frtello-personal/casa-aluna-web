'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

export interface GalleryImage {
  src: string;
  alt: string;
  label?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  /** Número máximo de miniaturas visibles en la cuadrícula. */
  visibleCount?: number;
  /** Texto del enlace que abre el visor completo. */
  moreLabel?: string;
  /** Si es false, solo se muestra el enlace que abre el visor (sin cuadrícula). */
  showGrid?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  visibleCount = 6,
  moreLabel = 'Más imágenes',
  showGrid = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const openAt = useCallback((index: number) => {
    setCurrent(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length);
  }, [images.length]);

  // Navegación por teclado y bloqueo del scroll de fondo mientras el visor está abierto.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, close, prev, next]);

  if (images.length === 0) return null;

  const thumbnails = images.slice(0, visibleCount);
  const activeImage = images[current];

  return (
    <>
      {showGrid && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {thumbnails.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`Ver ${img.alt}`}
              style={{
                position: 'relative',
                height: '150px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                background: '#f3f4f6',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 900px) 33vw, 300px"
                style={{ objectFit: 'cover' }}
              />
              {img.label && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '16px 12px 12px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.95)',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                    textAlign: 'left',
                  }}
                >
                  {img.label}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => openAt(0)}
        style={{
          marginTop: '14px',
          background: 'none',
          border: 'none',
          padding: 0,
          color: '#1e3a5f',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
        }}
      >
        {moreLabel}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar visor"
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '32px',
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            &times;
          </button>

          <button
            type="button"
            onClick={e => { e.stopPropagation(); prev(); }}
            aria-label="Imagen anterior"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>

          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1000px',
              height: '80vh',
            }}
          >
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          <button
            type="button"
            onClick={e => { e.stopPropagation(); next(); }}
            aria-label="Imagen siguiente"
            style={{
              position: 'absolute',
              right: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ›
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: 0,
              right: 0,
              textAlign: 'center',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '13px',
            }}
          >
            {activeImage.label ? `${activeImage.label} · ` : ''}
            {current + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};
