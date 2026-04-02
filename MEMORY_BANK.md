# Casa Aluna Web - Memory Bank

**Last Updated**: April 1, 2026  
**Project Status**: Phase 1 - Initial Development

---

## 📋 Project Overview

### Business Context
**Casa Aluna** is a vacation rental direct booking platform targeting the Colombian market. The platform aims to provide property owners with a direct booking channel, reducing dependency on third-party platforms like Airbnb and Vrbo while offering guests a seamless booking experience.

### Core Value Proposition
- **Direct Bookings**: Eliminate commission fees from OTA platforms
- **Local Focus**: Optimized for Colombian market (COP currency, local payment methods)
- **Seamless Experience**: Modern, fast, mobile-first booking flow
- **Owner Control**: Full control over pricing, availability, and guest communication

### Target Audience
- **Primary**: Property owners in Colombia seeking direct booking channels
- **Secondary**: Domestic and international travelers looking for vacation rentals in Colombia

---

## 🏗️ Technical Architecture

### Technology Stack

#### Frontend & Framework
- **Next.js** (App Router recommended for latest features)
- **React** (latest stable version)
- **TypeScript** (for type safety and better DX)
- **Tailwind CSS** (for rapid, responsive UI development)

#### Analytics & Tracking
- **PostHog**: Product analytics, feature flags, session recording
  - Track user behavior and conversion funnels
  - A/B testing capabilities for optimization
  - Heatmaps and session replays

#### Payment Processing
- **PayU Latam**: Primary payment gateway for Colombia
  - Supports Colombian payment methods (PSE, credit/debit cards)
  - COP currency handling
  - Installment payments (cuotas)

#### Communication
- **WhatsApp Business API**: Booking requests and guest communication
  - Phase 1: Direct booking requests via WhatsApp
  - Phase 2: Automated notifications and confirmations

#### Future Integrations
- **Airbnb Calendar Sync** (Phase 2)
- **Vrbo Calendar Sync** (Phase 2)
- **iCal Protocol** for calendar synchronization

### Hosting & Deployment
- **Vercel** (recommended for Next.js projects)
  - Automatic deployments from Git
  - Edge functions for optimal performance
  - Preview deployments for testing

---

## 🎯 Development Phases

### Phase 1: Property Showcase + WhatsApp Booking
**Goal**: Launch MVP with property listings and WhatsApp-based booking requests

#### Features
1. **Property Listings**
   - Property detail pages with descriptions
   - High-quality image galleries
   - Amenities and features list
   - Location information and maps
   - Pricing display (per night, cleaning fees, etc.)

2. **WhatsApp Integration**
   - "Book Now" CTA that opens WhatsApp
   - Pre-filled message with property details and dates
   - Direct communication channel with property owner

3. **Analytics Setup**
   - PostHog integration
   - Track page views, CTA clicks, WhatsApp conversions
   - User journey mapping

4. **Basic SEO**
   - Meta tags and Open Graph
   - Sitemap generation
   - Structured data for properties

#### Success Metrics
- Property page views
- WhatsApp click-through rate
- Booking request conversion rate

---

### Phase 2: Full Payment + Calendar Sync
**Goal**: Enable direct online payments and automated availability management

#### Features
1. **Payment Integration**
   - PayU checkout flow
   - Secure payment processing
   - Payment confirmation emails
   - Booking confirmation system

2. **Calendar Management**
   - Real-time availability calendar
   - Airbnb calendar sync (iCal import)
   - Vrbo calendar sync (iCal import)
   - Block dates for maintenance/personal use
   - Automatic availability updates

3. **Booking Management**
   - Booking dashboard for owners
   - Guest information collection
   - Booking status tracking
   - Cancellation handling

4. **Automated Communications**
   - WhatsApp booking confirmations
   - Payment receipts
   - Pre-arrival information
   - Post-stay follow-ups

#### Success Metrics
- Payment completion rate
- Calendar sync accuracy
- Booking management efficiency
- Guest satisfaction scores

---

## 🎨 Design & UX Guidelines

### Design Principles
1. **Mobile-First**: Majority of users will browse on mobile devices
2. **Fast Loading**: Optimize images, use Next.js Image component
3. **Clear CTAs**: Prominent booking buttons and contact options
4. **Trust Signals**: Reviews, verified badges, clear policies
5. **Local Context**: Spanish language, COP currency, Colombian imagery

### Color Palette
- **Primary**: Warm, inviting colors (suggest: earth tones, ocean blues)
- **Secondary**: Complementary accent colors
- **Neutral**: Grays for text and backgrounds
- **Success**: Green for confirmations
- **Warning**: Yellow/orange for alerts
- **Error**: Red for errors

### Typography
- **Headings**: Bold, clear, readable
- **Body**: Comfortable reading size (16px minimum)
- **Mobile**: Larger touch targets (44px minimum)

---

## 💻 Code Standards & Conventions

### File Structure
```
casa-aluna-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (marketing)/        # Marketing pages group
│   │   ├── (booking)/          # Booking flow group
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── property/           # Property-specific components
│   │   └── booking/            # Booking-specific components
│   ├── lib/                    # Utility functions
│   │   ├── analytics/          # PostHog helpers
│   │   ├── payments/           # PayU integration
│   │   └── whatsapp/           # WhatsApp helpers
│   ├── types/                  # TypeScript type definitions
│   ├── hooks/                  # Custom React hooks
│   └── config/                 # Configuration files
├── public/                     # Static assets
│   ├── images/
│   └── icons/
├── prisma/                     # Database schema (if using Prisma)
└── tests/                      # Test files
```

### Naming Conventions
- **Components**: PascalCase (e.g., `PropertyCard.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_GUESTS`)
- **Types/Interfaces**: PascalCase with descriptive names (e.g., `PropertyDetails`)

### Component Patterns
```typescript
// Prefer functional components with TypeScript
interface PropertyCardProps {
  property: Property;
  onBookClick: () => void;
}

export function PropertyCard({ property, onBookClick }: PropertyCardProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### Code Quality
- **ESLint**: Enforce code standards
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict mode enabled
- **Testing**: Jest + React Testing Library

---

## 🔌 Integration Specifications

### PostHog Analytics

#### Setup
```typescript
// lib/analytics/posthog.ts
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
```

#### Key Events to Track
- `property_viewed`: User views property details
- `booking_initiated`: User clicks "Book Now"
- `whatsapp_clicked`: User clicks WhatsApp CTA
- `payment_started`: User begins payment flow (Phase 2)
- `payment_completed`: Successful payment (Phase 2)
- `calendar_synced`: Calendar sync completed (Phase 2)

---

### PayU Integration (Phase 2)

#### Configuration
- **Merchant ID**: Store in environment variables
- **API Key**: Secure storage, never commit to Git
- **Account ID**: Colombia-specific account
- **Test Mode**: Use sandbox for development

#### Payment Flow
1. User selects dates and guests
2. Calculate total (nights × rate + cleaning fee + taxes)
3. Create PayU payment form
4. Redirect to PayU checkout
5. Handle payment confirmation webhook
6. Send booking confirmation

#### Supported Payment Methods
- Credit cards (Visa, Mastercard, Amex)
- Debit cards
- PSE (Colombian bank transfers)
- Cash payments (Efecty, Baloto)

---

### WhatsApp Business API

#### Phase 1: Simple Link Integration
```typescript
// lib/whatsapp/generateBookingLink.ts
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
```

#### Phase 2: WhatsApp Business API
- Automated booking confirmations
- Payment reminders
- Check-in instructions
- Post-stay feedback requests

---

### Calendar Synchronization (Phase 2)

#### iCal Protocol
- Import Airbnb calendar via iCal URL
- Import Vrbo calendar via iCal URL
- Export Casa Aluna calendar for other platforms
- Sync frequency: Every 4-6 hours

#### Conflict Resolution
- External bookings take precedence
- Block dates immediately upon booking
- Manual override capability for owners

---

## 🌍 Colombia-Specific Considerations

### Localization
- **Language**: Spanish (primary), English (secondary)
- **Currency**: Colombian Peso (COP)
- **Date Format**: DD/MM/YYYY
- **Time Zone**: America/Bogota (UTC-5)

### Payment Preferences
1. **PSE**: Most popular online payment method
2. **Credit Cards**: Widely accepted, installment options important
3. **Cash**: Efecty and Baloto for cash payments
4. **Bank Transfers**: Common for larger amounts

### Legal & Compliance
- **Tax**: IVA (VAT) considerations for tourist accommodations
- **Tourist Tax**: Some cities require tourist tax collection
- **Data Privacy**: Colombian data protection laws
- **Terms & Conditions**: Spanish language, Colombian jurisdiction

### Cultural Considerations
- Family-friendly messaging
- Emphasis on safety and security
- Local landmarks and attractions
- Transportation information (distance to airports, bus terminals)

---

## 📊 Key Performance Indicators (KPIs)

### Phase 1 KPIs
- **Traffic**: Unique visitors, page views
- **Engagement**: Time on site, pages per session
- **Conversion**: WhatsApp click rate, booking requests
- **Sources**: Organic, direct, referral, social

### Phase 2 KPIs
- **Bookings**: Total bookings, booking value
- **Conversion Rate**: Visitors → bookings
- **Payment Success**: Payment completion rate
- **Calendar Accuracy**: Sync success rate, double-booking incidents
- **Revenue**: Total revenue, average booking value

---

## 🔐 Security & Privacy

### Data Protection
- **SSL/TLS**: HTTPS everywhere
- **Environment Variables**: Secure storage of API keys
- **Payment Data**: PCI compliance via PayU
- **User Data**: Minimal collection, secure storage
- **GDPR/Local Laws**: Compliance with data protection regulations

### Best Practices
- Never store credit card information
- Hash and salt passwords (if user accounts added)
- Rate limiting on API endpoints
- Input validation and sanitization
- Regular security audits

---

## 🚀 Deployment Strategy

### Environments
1. **Development**: Local development with hot reload
2. **Staging**: Preview deployments for testing
3. **Production**: Live site on custom domain

### CI/CD Pipeline
- **Git Workflow**: Feature branches → PR → Main
- **Automated Tests**: Run on every PR
- **Preview Deployments**: Automatic Vercel previews
- **Production Deploy**: Merge to main triggers deployment

### Environment Variables
```
# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

# Payment (Phase 2)
PAYU_MERCHANT_ID=
PAYU_API_KEY=
PAYU_ACCOUNT_ID=
PAYU_TEST_MODE=

# WhatsApp
WHATSAPP_BUSINESS_PHONE=

# Database (Phase 2)
DATABASE_URL=

# General
NEXT_PUBLIC_SITE_URL=
```

---

## 📝 Content Strategy

### Property Listings
- **Title**: Clear, descriptive (e.g., "Modern Beachfront Apartment in Cartagena")
- **Description**: 200-500 words, highlight unique features
- **Amenities**: Comprehensive list with icons
- **House Rules**: Clear expectations
- **Location**: Neighborhood description, nearby attractions
- **Photos**: Minimum 10 high-quality images

### SEO Optimization
- **Meta Titles**: Include location and property type
- **Meta Descriptions**: Compelling, 150-160 characters
- **Alt Text**: Descriptive image alt text
- **URL Structure**: `/properties/[city]/[property-slug]`
- **Schema Markup**: Use schema.org/VacationRental

---

## 🎓 Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

### PostHog
- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Next.js Integration](https://posthog.com/docs/libraries/next-js)

### PayU
- [PayU Latam Documentation](https://developers.payulatam.com/)
- [PayU Colombia Integration](https://developers.payulatam.com/latam/en/docs/integrations.html)

### WhatsApp Business
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [WhatsApp Click to Chat](https://faq.whatsapp.com/general/chats/how-to-use-click-to-chat)

---

## 🐛 Troubleshooting & Common Issues

### Development Issues
- **Port Already in Use**: Kill process or use different port
- **Module Not Found**: Run `npm install` or `pnpm install`
- **TypeScript Errors**: Check type definitions, run `tsc --noEmit`

### Integration Issues
- **PostHog Not Tracking**: Check API key, verify initialization
- **WhatsApp Link Not Working**: Verify phone number format (+57...)
- **Payment Failures**: Check PayU credentials, test mode settings

---

## 📅 Project Timeline

### Phase 1 (Estimated: 4-6 weeks)
- Week 1-2: Project setup, design system, basic pages
- Week 3-4: Property listings, image galleries, WhatsApp integration
- Week 5: PostHog integration, analytics setup
- Week 6: Testing, SEO optimization, launch

### Phase 2 (Estimated: 6-8 weeks)
- Week 1-2: Database setup, booking system architecture
- Week 3-4: PayU integration, payment flow
- Week 5-6: Calendar sync implementation
- Week 7: Booking management dashboard
- Week 8: Testing, refinement, launch

---

## 🤝 Collaboration & Communication

### Code Reviews
- All changes via Pull Requests
- At least one approval required
- Address all comments before merging

### Documentation
- Update this memory bank as project evolves
- Document all API integrations
- Maintain changelog for major updates

### Version Control
- **Main Branch**: Production-ready code
- **Feature Branches**: `feature/description`
- **Bug Fixes**: `fix/description`
- **Commit Messages**: Clear, descriptive, conventional commits

---

## 📌 Quick Reference

### Important Links
- **Repository**: https://github.com/frtello-personal/casa-aluna-web
- **Production URL**: TBD
- **Staging URL**: TBD
- **Design Files**: TBD

### Key Contacts
- **Project Owner**: TBD
- **Developer**: TBD
- **Designer**: TBD

### Support Resources
- **PostHog Support**: support@posthog.com
- **PayU Support**: https://developers.payulatam.com/
- **Vercel Support**: https://vercel.com/support

---

## 🔄 Changelog

### Version 1.0.0 (April 1, 2026)
- Initial memory bank creation
- Project structure defined
- Phase 1 and Phase 2 roadmap established
- Technical stack documented
- Integration specifications outlined

---

**Note**: This memory bank is a living document. Update it as the project evolves, new decisions are made, and requirements change. Keep it as the single source of truth for the Casa Aluna Web project.
