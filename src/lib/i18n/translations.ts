/**
 * i18n Translations for Casa Aluna
 * Spanish (default) and English support
 */

export type Locale = 'es' | 'en';

export const translations = {
  es: {
    property: {
      bedrooms: 'Habitaciones',
      bathrooms: 'Baños',
      guests: 'Huéspedes',
      perNight: 'por noche',
      bookNow: 'Reservar Ahora',
      description: 'Descripción',
      amenities: 'Amenidades',
      location: 'Ubicación',
    },
    amenities: {
      wifi: 'WiFi',
      pool: 'Piscina',
      kitchen: 'Cocina Completa',
      ac: 'Aire Acondicionado',
      jacuzzi: 'Jacuzzi',
      parking: 'Estacionamiento',
      tv: 'TV por Cable',
      washer: 'Lavadora',
      hotWater: 'Agua Caliente',
      security: 'Seguridad 24/7',
      balcony: 'Balcón',
    },
  },
  en: {
    property: {
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      guests: 'Guests',
      perNight: 'per night',
      bookNow: 'Book Now',
      description: 'Description',
      amenities: 'Amenities',
      location: 'Location',
    },
    amenities: {
      wifi: 'WiFi',
      pool: 'Pool',
      kitchen: 'Full Kitchen',
      ac: 'Air Conditioning',
      Jacuzzi: 'Jacuzzi',
      parking: 'Parking',
      tv: 'Cable TV',
      washer: 'Washer',
      hotWater: 'Hot Water',
      security: '24/7 Security',
      balcony: 'Balcony',
      oceanView: 'Ocean View',
    },
  },
};

export function getTranslations(locale: Locale = 'es') {
  return translations[locale] || translations.es;
}
