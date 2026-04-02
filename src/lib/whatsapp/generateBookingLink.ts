/**
 * Generate WhatsApp booking link with pre-filled message
 * Phase 1: Simple link integration for booking requests
 */

export function generateWhatsAppLink(
  phoneNumber: string,
  propertyName: string,
  checkIn: string,
  checkOut: string,
  guests: number
): string {
  const message = encodeURIComponent(
    `Hola! Me interesa reservar ${propertyName}\n` +
    `Check-in: ${checkIn}\n` +
    `Check-out: ${checkOut}\n` +
    `Huéspedes: ${guests}`
  );
  
  return `https://wa.me/${phoneNumber}?text=${message}`;
}
