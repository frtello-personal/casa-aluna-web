/**
 * Site-wide configuration
 */

export const siteConfig = {
  name: "Casa Aluna",
  description: "Vacation rental direct booking platform for Colombia",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  locale: "es-CO",
  currency: "COP",
  timezone: "America/Bogota",
  whatsapp: {
    businessPhone: process.env.WHATSAPP_BUSINESS_PHONE || "+57",
  },
};
