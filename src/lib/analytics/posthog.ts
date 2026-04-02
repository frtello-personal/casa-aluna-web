/**
 * PostHog Analytics Integration
 * Phase 1: Track user behavior and conversion funnels
 */

import posthog from 'posthog-js';

export const initPostHog = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      },
    });
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window !== 'undefined') {
    posthog.capture(eventName, properties);
  }
};

// Key events for Phase 1
export const analytics = {
  propertyViewed: (propertyId: string, propertyName: string) => {
    trackEvent('property_viewed', { propertyId, propertyName });
  },
  bookingInitiated: (propertyId: string, propertyName: string) => {
    trackEvent('booking_initiated', { propertyId, propertyName });
  },
  whatsappClicked: (propertyId: string, propertyName: string) => {
    trackEvent('whatsapp_clicked', { propertyId, propertyName });
  },
};
