# Casino Game Lobby

A modern, responsive casino game lobby built with Next.js 16, React 19, TypeScript, and SCSS. Features a dual-view system (lobby/grid), infinite scroll pagination, real-time search, and advanced filtering capabilities.

## Features

- 🎰 **Dual View Modes**: Lobby view with horizontal game rows and full grid view with filters
- 🔍 **Real-time Search**: Debounced search with 300ms delay and 2-character minimum
- ♾️ **Infinite Scroll**: Seamless game loading using IntersectionObserver
- 🎨 **Dark Casino Theme**: Navy/purple color scheme with gold accents
- 📱 **Mobile-First Design**: Responsive layouts with mobile bottom sheet filters
- ⭐ **Favorites System**: Persistent favorites saved to localStorage
- 🖼️ **Optimized Images**: Next.js Image with blur placeholders
- ⚡ **Performance**: Independent queries per section for fault isolation
- 🧪 **Tested**: Unit tests with Jest and React Testing Library

## Setup

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate test coverage
yarn test:coverage
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Tech Stack

- **Framework**: Next.js 16.2 (App Router)
- **React**: 19.2
- **TypeScript**: 5.x
- **State Management**: Zustand 5.0
- **Data Fetching**: TanStack React Query 5.99
- **HTTP Client**: Axios 1.15
- **Styling**: SCSS (Sass 1.99) with CSS Modules
- **Animations**: Framer Motion 12.38
- **Testing**: Jest 30 + React Testing Library 16
- **Linting**: ESLint 9 with Next.js config

## Architecture Decisions

### State Management Strategy

- **Zustand** for global UI state (view mode, filters, search, favorites)
- **React Query** for server state with automatic caching and invalidation
- **Persist middleware** for favorites stored in localStorage
- Clear separation between UI state and server cache

### View Mode System

Two distinct view modes driven by Zustand store:

- **Lobby Mode**: Horizontal scrolling rows per category, hero banner, provider showcase
- **Grid Mode**: Full-page responsive grid with sidebar filters (desktop) or bottom sheet (mobile)
- Search automatically switches to grid/search mode

### Data Fetching Patterns

- **Independent React Query per GameRow**: Fault isolation—one failed category doesn't break others
- **Infinite scroll with useInfiniteQuery**: 20 games per page, offset-based pagination
- **Debounced search**: 300ms delay with 2-character minimum to reduce API calls
- **5-minute staleTime**: Balances freshness with performance

### Responsive Design

- **Mobile-first SCSS**: Custom `respond-to` mixin for breakpoints (sm/md/lg/xl)
- **Dual FilterPanel personality**: Bottom sheet on mobile, sticky sidebar on desktop
- **Peek effect**: Shows 2.5 cards on mobile to indicate horizontal scroll
- **Adaptive grid**: 2 → 3 → 4 → 5 columns based on viewport

### Performance Optimizations

- **Next.js Image**: Automatic optimization with blur placeholders
- **IntersectionObserver**: Native infinite scroll (no library overhead)
- **Skeleton loading**: Matches final layout to prevent layout shift
- **Priority loading**: First 3-10 images per section get priority flag
- **Query deduplication**: React Query prevents redundant API calls

### Error Handling

- **Page-level error boundary**: Catches and displays errors gracefully
- **Component-level error states**: Each data-fetching component handles its own errors
- **Retry functionality**: All error states include retry buttons
- **Development logging**: API errors logged to console in dev mode only

## Component Hierarchy

```
src/
├── app/
│   ├── error.tsx              # Next.js error boundary
│   ├── layout.tsx             # Root layout with React Query provider
│   ├── loading.tsx            # Page-level loading skeleton
│   ├── page.tsx               # Main page with view mode routing
│   ├── globals.scss           # Global styles import
│   └── page.module.scss       # Page-specific styles
├── components/
│   ├── game/
│   │   ├── GameCard/          # Dual-variant card (compact/full)
│   │   └── GameCardSkeleton/  # Loading placeholder
│   ├── grid/
│   │   ├── FilterPanel/       # Multi-select filters (vendors, categories, sort)
│   │   ├── GameGrid/          # Infinite scroll grid view
│   │   └── SortBar/           # Active filters + mobile filter button
│   ├── layout/
│   │   ├── CategoryNav/       # Horizontal category tabs
│   │   └── Header/            # Logo, search, auth buttons
│   ├── lobby/
│   │   ├── GameRow/           # Horizontal game row (10 games)
│   │   ├── HeroBanner/        # Promo banner with gradient
│   │   └── ProviderRow/       # Featured game providers
│   └── ui/
│       ├── BottomSheet/       # Mobile modal with drag-to-dismiss
│       ├── EmptyState/        # No results state
│       ├── ErrorState/        # Error display with retry
│       └── SearchBar/         # Debounced search input
├── hooks/
│   ├── useGameRow.ts          # Fetch 10 games for lobby row
│   ├── useGames.ts            # Infinite scroll query with filters
│   ├── useGameSearch.ts       # Search endpoint query
│   └── useInfiniteScroll.ts   # IntersectionObserver hook
├── services/
│   └── gamesApi.ts            # Typed Axios API client
├── store/
│   └── useGameStore.ts        # Zustand state management
├── styles/
│   ├── _variables.scss        # Design tokens (colors, spacing, breakpoints)
│   ├── _mixins.scss           # Reusable SCSS mixins
│   └── _reset.scss            # Modern CSS reset
└── types/
    └── game.types.ts          # TypeScript interfaces and types
```

## API Integration

**Base URL**: `https://jpapi-staging.jackpot.bet`

### Endpoints

**GET /casino/games**

- Fetches paginated games list
- Query params: `limit`, `offset`, `sort`, `order`, `category`, `vendor[]`, `excludeCategory`
- Returns: `{ success: boolean, data: { count, total, items: Game[] } }`

**GET /casino/games/search**

- Searches games by name
- Query params: `query` (string)
- Returns: `{ success: boolean, data: { items: Game[] } }`

### Game Object Schema

```typescript
interface Game {
  enabled: boolean;
  name: string;
  slug: string;
  vendor: string;
  description: string;
  thumbnail: string;
  thumbnailBlur: string; // Base64 data URL
  borderColor: string; // Hex color
  categories: string[];
  theoreticalPayOut: number;
  restrictedTerritories: string[];
  hasFunMode: boolean;
  featured: boolean;
  favorite: boolean;
}
```

## Known Limitations

### API Constraints

- **Offset-based pagination**: API does not support cursor-based pagination; using offset may cause duplicates if data changes during scroll
- **Search isolation**: Search endpoint does not support simultaneous filtering by vendor/category
- **No sorting on search**: Search results cannot be sorted by RTP or popularity

### Feature Gaps

- **No authentication**: Login/Register buttons are static UI elements
- **No game launch**: Cards are not clickable; no game iframe integration
- **No provider filtering**: ProviderRow cards are not functional
- **No real-time updates**: Favorites don't sync across tabs (localStorage only)

### Browser Support

- Modern browsers only (ES2020+)
- IntersectionObserver required (no IE11 support)
- CSS `aspect-ratio` required (no fallback)

## Testing

```bash
# Run all tests
yarn test

# Watch mode for development
yarn test:watch

# Generate coverage report
yarn test:coverage
```

### Test Coverage

- **Store**: Zustand state mutations (toggleFavorite, clearFilters, openGridView)
- **GameCard**: Variant rendering, RTP/FUN badges, favorite toggle, event propagation
- **GameCardSkeleton**: Count prop, default values, variant rendering

## Project Commands

```bash
# Development
yarn dev              # Start dev server (localhost:3000)
yarn build            # Production build
yarn start            # Start production server

# Code Quality
yarn lint             # Run ESLint
yarn tsc --noEmit     # TypeScript type check

# Testing
yarn test             # Run Jest tests
yarn test:watch       # Watch mode
yarn test:coverage    # Coverage report
```

## Environment Variables

No environment variables required for basic functionality. API base URL is hardcoded in `src/services/gamesApi.ts`.

For production, consider:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.jackpot.bet
```

## License

Proprietary - All rights reserved

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For issues or questions, please open an issue in the repository.
