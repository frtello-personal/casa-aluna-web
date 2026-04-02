// Core type definitions for Casa Aluna

export interface Property {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  pricePerNight: number;
  cleaningFee: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  whatsappNumber: string;
}

export interface BookingRequest {
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
}
