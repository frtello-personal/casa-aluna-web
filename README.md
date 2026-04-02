# Casa Aluna Web

Vacation rental direct booking platform for the Colombian market.

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Analytics**: PostHog (Phase 1)
- **Payments**: PayU Latam (Phase 2)
- **Communication**: WhatsApp Business API

## 📋 Project Structure

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
│   │   ├── payments/           # PayU integration (Phase 2)
│   │   └── whatsapp/           # WhatsApp helpers
│   ├── types/                  # TypeScript type definitions
│   ├── hooks/                  # Custom React hooks
│   └── config/                 # Configuration files
├── public/                     # Static assets
│   ├── images/
│   └── icons/
└── tests/                      # Test files
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/frtello-personal/casa-aluna-web.git
cd casa-aluna-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Development Phases

### Phase 1: Property Showcase + WhatsApp Booking (Current)
- Property listings with image galleries
- WhatsApp integration for booking requests
- PostHog analytics setup
- Basic SEO optimization

### Phase 2: Full Payment + Calendar Sync (Upcoming)
- PayU payment integration
- Calendar management and sync (Airbnb, Vrbo)
- Booking management dashboard
- Automated communications

## 🌍 Colombia-Specific Features

- **Language**: Spanish (primary), English (secondary)
- **Currency**: Colombian Peso (COP)
- **Date Format**: DD/MM/YYYY
- **Time Zone**: America/Bogota (UTC-5)
- **Payment Methods**: PSE, credit/debit cards, cash payments

## 📚 Documentation

For detailed project information, architecture decisions, and development guidelines, see [MEMORY_BANK.md](./MEMORY_BANK.md).

## 🔐 Environment Variables

See `.env.example` for all required environment variables. Key variables:

- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog analytics key
- `WHATSAPP_BUSINESS_PHONE` - WhatsApp business phone number
- `PAYU_*` - PayU payment credentials (Phase 2)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/description`
2. Commit your changes: `git commit -m 'Add feature'`
3. Push to the branch: `git push origin feature/description`
4. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 📞 Support

For questions or support, please contact the project maintainers.
