# Frontend Directory

## Overview

The `frontend/` directory contains the React/Next.js frontend application for ZodiaCore. This is a modern, responsive web application that provides users with an intuitive interface to access comprehensive astrology services across Vedic, Chinese, Western, and Numerology systems.

## Architecture

The frontend follows a component-based architecture with clear separation of concerns:

```
frontend/
├── app/                          # Next.js app router directory
│   ├── (auth)/                   # Authentication routes (login, register)
│   ├── (dashboard)/              # Protected dashboard routes
│   ├── api/                      # API routes for server-side operations
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout component
├── components/                   # Reusable React components
│   ├── ui/                       # Base UI components (buttons, inputs, etc.)
│   ├── forms/                    # Form components
│   ├── charts/                   # Astrology chart visualization components
│   ├── layout/                   # Layout components (header, sidebar, etc.)
│   └── astrology/                # Astrology-specific components
├── lib/                          # Utility functions and configurations
│   ├── api/                      # API client and service functions
│   ├── auth/                     # Authentication utilities
│   ├── utils/                    # General utility functions
│   ├── validations/              # Form validation schemas
│   └── constants/                # Application constants
├── services/                     # External service integrations
├── styles/                       # Additional styling (Tailwind config, etc.)
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── stores/                       # State management (Zustand/Redux)
├── public/                       # Static assets (images, icons, etc.)
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Technology Stack

### Core Framework
- **Next.js 14+**: React framework with App Router
- **React 18+**: UI library with concurrent features
- **TypeScript**: Type-safe JavaScript development

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Animation library
- **React Hook Form**: Form management with validation

### State Management
- **Zustand**: Lightweight state management
- **React Query**: Server state management and caching
- **Context API**: Theme and user preferences

### Charts & Visualization
- **D3.js**: Data visualization for astrology charts
- **Recharts**: React charting library for analytics
- **SVG/Canvas**: Custom astrology chart rendering

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **Vitest**: Unit testing framework
- **Playwright**: End-to-end testing

## Key Features

### User Interface
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: WCAG 2.1 AA compliance with screen reader support
- **Internationalization**: Multi-language support (future enhancement)
- **Dark/Light Mode**: Theme switching capability

### Astrology Features
- **Birth Chart Generation**: Interactive chart creation with visual displays
- **Compatibility Analysis**: Synastry and composite chart analysis
- **Horoscope Display**: Daily, weekly, monthly, and yearly predictions
- **Remedial Suggestions**: Personalized recommendations and guidance
- **Report Generation**: PDF export of detailed astrology reports

### User Experience
- **Progressive Web App**: Offline capability and app-like experience
- **Real-time Updates**: Live transit notifications and alerts
- **Search & Filter**: Advanced filtering of astrology data
- **Bookmarking**: Save favorite charts and readings

## Core Components

### Layout Components (`components/layout/`)
- `Header.tsx` - Navigation header with user menu
- `Sidebar.tsx` - Main navigation sidebar
- `Footer.tsx` - Site footer with links
- `Breadcrumb.tsx` - Navigation breadcrumb component

### Astrology Components (`components/astrology/`)
- `BirthChart.tsx` - Interactive birth chart display
- `PlanetPositions.tsx` - Planetary position visualization
- `AspectGrid.tsx` - Planetary aspect analysis
- `HoroscopeCard.tsx` - Horoscope display component
- `CompatibilityMatrix.tsx` - Relationship compatibility visualization

### Form Components (`components/forms/`)
- `BirthDataForm.tsx` - Birth information input form
- `UserProfileForm.tsx` - User profile management
- `PreferencesForm.tsx` - User preference settings
- `SearchForm.tsx` - Advanced search and filtering

### UI Components (`components/ui/`)
- `Button.tsx` - Customizable button component
- `Input.tsx` - Form input with validation
- `Modal.tsx` - Modal dialog component
- `Toast.tsx` - Notification toast component
- `Loading.tsx` - Loading states and spinners

## API Integration

### API Client (`lib/api/`)
The frontend uses a centralized API client for backend communication:

```typescript
// API client structure
export const apiClient = {
  auth: {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    refresh: (token) => api.post('/auth/refresh', { token })
  },
  astrology: {
    getBirthChart: (userId) => api.get(`/zc1/birth-chart/${userId}`),
    getHoroscope: (params) => api.get('/horoscope', { params }),
    getCompatibility: (data) => api.post('/compatibility', data)
  }
}
```

### Service Layer (`services/`)
- **Authentication Service**: JWT token management and user sessions
- **Astrology Service**: Calculation requests and result caching
- **User Service**: Profile management and preferences
- **Notification Service**: Real-time updates and alerts

## State Management

### Global State (`stores/`)
- **User Store**: Authentication state and user profile
- **Astrology Store**: Chart data and calculation results
- **UI Store**: Theme, layout, and modal states
- **Cache Store**: API response caching and offline support

### Server State (`React Query`)
- **Query Management**: Automatic caching and background updates
- **Mutation Handling**: Optimistic updates and error recovery
- **Background Sync**: Offline queue and conflict resolution

## Routing Structure

### App Router (`app/`)
```
app/
├── page.tsx                    # Landing page
├── (auth)/
│   ├── login/page.tsx         # Login page
│   └── register/page.tsx      # Registration page
├── (dashboard)/
│   ├── page.tsx               # Dashboard home
│   ├── birth-chart/page.tsx   # Birth chart page
│   ├── horoscope/page.tsx     # Horoscope page
│   ├── compatibility/page.tsx # Compatibility page
│   └── profile/page.tsx       # User profile
└── api/
    ├── auth/[...nextauth]/route.ts  # NextAuth routes
    └── astrology/route.ts           # Server-side API routes
```

## Styling Approach

### Design System
- **Color Palette**: Astrology-themed colors with accessibility compliance
- **Typography**: Hierarchical text styles with proper contrast ratios
- **Spacing**: Consistent spacing scale using Tailwind utilities
- **Components**: Reusable component library with consistent styling

### Responsive Design
- **Mobile-First**: Base styles for mobile, enhanced for larger screens
- **Breakpoint System**: Tailwind's responsive utilities
- **Touch-Friendly**: Appropriate touch targets and gestures
- **Performance**: Optimized CSS with purging and minification

## Performance Optimization

### Build Optimization
- **Code Splitting**: Route-based and component-based splitting
- **Image Optimization**: Next.js Image component with lazy loading
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Caching**: Aggressive caching strategies for static assets

### Runtime Performance
- **Virtual Scrolling**: For large lists and chart data
- **Memoization**: React.memo and useMemo for expensive operations
- **Debouncing**: Input debouncing for search and API calls
- **Progressive Loading**: Lazy loading of non-critical components

## Testing Strategy

### Unit Tests (`__tests__/`)
- Component testing with React Testing Library
- Hook testing with custom render utilities
- Utility function testing
- API client testing with mocked responses

### Integration Tests
- Page-level testing with Playwright
- API integration testing
- Form submission and validation testing
- Authentication flow testing

### E2E Tests
- Critical user journey testing
- Cross-browser compatibility testing
- Mobile responsiveness testing
- Performance testing

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Build Process
```bash
# Build for production
npm run build

# Start production server
npm start

# Analyze bundle size
npm run analyze
```

## Configuration

### Environment Variables
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.zodiacore.com
NEXT_PUBLIC_WS_URL=wss://ws.zodiacore.com

# Authentication
NEXTAUTH_URL=https://zodiacore.com
NEXTAUTH_SECRET=your-secret-key

# Analytics
NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID

# Feature Flags
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_PWA=true
```

### Next.js Configuration (`next.config.js`)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['api.zodiacore.com'],
  },
  i18n: {
    locales: ['en', 'es', 'fr'],
    defaultLocale: 'en',
  },
}

module.exports = nextConfig
```

## Deployment

### Build Output
- **Static Generation**: Marketing pages and documentation
- **Server-Side Rendering**: Dynamic astrology pages
- **API Routes**: Serverless function deployment
- **Image Optimization**: Automatic image optimization and CDN

### Hosting
- **Vercel**: Recommended for Next.js deployment
- **Netlify**: Alternative with good Next.js support
- **Self-hosted**: Docker container deployment

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari 14+, Chrome Mobile 90+
- **Progressive Enhancement**: Graceful degradation for older browsers

## Accessibility

### WCAG Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliance for text and UI elements
- **Focus Management**: Proper focus indicators and management

### Inclusive Design
- **Font Scaling**: Respect user's font size preferences
- **Reduced Motion**: Respect prefers-reduced-motion setting
- **High Contrast**: Support for high contrast mode
- **Alternative Text**: Descriptive alt text for images

## Future Enhancements

### Advanced Features
- **Real-time Collaboration**: Multi-user chart analysis
- **AI-Powered Insights**: Machine learning recommendations
- **Social Features**: Community discussions and sharing
- **Mobile App**: React Native companion app

### Performance Improvements
- **Edge Computing**: Global CDN with edge functions
- **WebAssembly**: Heavy calculations in WebAssembly
- **Service Worker**: Advanced offline capabilities
- **Streaming**: Real-time data streaming for live updates

### Developer Experience
- **Storybook**: Component documentation and testing
- **Design System**: Comprehensive design system documentation
- **Type Safety**: 100% TypeScript coverage
- **Automated Testing**: Comprehensive test automation