# Casino Game Lobby

A modern casino game lobby built with Next.js 14, featuring real-time search, category filtering, and infinite scroll pagination. The entire application is driven by URL parameters, making it easy to bookmark and share specific views.

## Features

- 🎰 **Three View Modes**: Lobby with game rows, category grid, and search results
- 🔍 **Real-time Search**: Debounced search (300ms) that updates the URL
- ♾️ **Infinite Scroll**: Smooth loading as you scroll down category grids
- 🎨 **Dark Casino Theme**: A sleek dark design with purple and gold accents
- 📱 **Mobile-First**: Fully responsive from 375px mobile to desktop
- ⭐ **Persistent Favorites**: Save your favorite games to localStorage
- 🖼️ **Optimized Images**: Next.js Image with blur placeholders for smooth loading
- ⚡ **Smart Caching**: React Query prevents unnecessary API calls
- 🧪 **Tested**: Unit tests for core functionality

## Quick Start

```bash
# Install dependencies
yarn install

# Run development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## How It Works

The app uses **URL parameters** as the single source of truth for navigation:

- **`/`** — Shows the main lobby with horizontal game rows
- **`/?category=slots`** — Displays a full grid of slot games with infinite scroll
- **`/?search=blackjack`** — Shows search results in a grid layout
- **`/?search=poker&category=slots`** — Combines search with category filter

This means the browser's back/forward buttons work perfectly, and you can bookmark or share any view.

## Tech Stack

- **Next.js 14** with App Router and TypeScript
- **React Query 5** for server state and caching
- **Zustand** for client state (just favorites!)
- **Axios** for API calls
- **SCSS Modules** for styling with a mobile-first approach
- **Framer Motion** for animations
- **Jest + React Testing Library** for tests

## Project Structure

Here's what you'll find in the codebase:

### Core Files

- **`src/app/page.tsx`** — Main page that switches between lobby/category/search modes based on URL
- **`src/app/layout.tsx`** — Root layout with React Query provider
- **`src/store/useGameStore.ts`** — Zustand store (only handles favorites)

### Components

- **`components/lobby/`** — LobbyView, GameRow, HeroBanner, ProviderRow
- **`components/game/`** — GameCard (with compact/full variants) and GameCardSkeleton
- **`components/grid/`** — CategoryGrid and SearchResultsGrid for full-page views
- **`components/layout/`** — Header and CategoryNav
- **`components/ui/`** — SearchBar, EmptyState, ErrorState

### Hooks

- **`useGames`** — Infinite scroll query for category grids
- **`useGameSearch`** — Search endpoint query
- **`useGameRow`** — Fetches 10 games for lobby rows
- **`useInfiniteScroll`** — IntersectionObserver wrapper

### Services

- **`gamesApi.ts`** — Axios client with typed functions for fetching games

## Key Architecture Decisions

### Why URL-Driven?

Instead of managing view state in Zustand or React state, the URL parameters tell the app what to show. This makes the code simpler and gives users a better experience (shareable links, working back button).

### Zustand for Favorites Only

The store is intentionally minimal — it only manages favorites that need to persist to localStorage. Everything else (search query, selected category) comes from the URL. Server data stays in React Query's cache where it belongs.

### Independent Queries Per Row

Each GameRow in the lobby makes its own React Query request. This means if one category fails to load, the others still work. It's a bit more API calls, but the fault isolation is worth it.

### Mobile-First SCSS

All styles use `min-width` media queries, starting from mobile and scaling up. Variables and mixins keep everything consistent.

## API Integration

**Base URL:** `https://jpapi-staging.jackpot.bet`

### Endpoints

**`GET /casino/games`**

- Parameters: `limit`, `offset`, `sort`, `order`, `category`, `vendor[]`
- Returns paginated game list with total count

**`GET /casino/games/search?query=`**

- Searches games by name
- Returns array of matching games

### Game Object

Each game has: `slug`, `name`, `vendor`, `thumbnail`, `thumbnailBlur`, `borderColor`, `categories`, `theoreticalPayOut`, `hasFunMode`, `favorite`, `featured`

## Component Details

### GameCard

The workhorse component with two variants:

- **Compact**: Used in lobby rows (shows name + thumbnail)
- **Full**: Used in grids (adds vendor, RTP badge, FUN badge)

### GameRow

Horizontal scrolling row with arrow navigation on desktop. Each row independently fetches its category's games.

### CategoryGrid / SearchResultsGrid

Full-page grids with infinite scroll. As you scroll down, the IntersectionObserver triggers `fetchNextPage` from React Query.

### SearchBar

Debounces user input for 300ms, then updates the URL. Only fires search API calls when query is 2+ characters.

## Testing

```bash
# Run all tests
yarn test

# Watch mode
yarn test:watch

# Coverage report
yarn test:coverage
```

Current test coverage:

- **Store**: Tests for favorite toggling and persistence
- **GameCard**: Variant rendering, badges, favorite interactions
- **GameCardSkeleton**: Count rendering and variants

## Development Commands

```bash
yarn dev              # Start dev server at localhost:3000
yarn build            # Production build
yarn start            # Start production server
yarn lint             # Run ESLint
yarn test             # Run tests
```

## Known Limitations

**What's Not Included:**

- Advanced filters (vendor selection, sorting options) — kept it simple for now
- Hero banner carousel — currently just a static promotional image
- Game launch functionality — cards aren't clickable yet
- Authentication — Login/Register buttons are UI-only
- Cross-tab sync for favorites — uses localStorage, doesn't sync across tabs

**Browser Support:**

- Modern browsers only (Chrome, Firefox, Safari, Edge)
- Requires IntersectionObserver and CSS `aspect-ratio`

## What I Learned

Building this was a great exercise in balancing simplicity with functionality. The URL-driven architecture was a game-changer — it made the code much cleaner than managing view state in a store. React Query's infinite scroll support is fantastic once you understand `getNextPageParam`. And keeping Zustand minimal (just favorites) prevented the common mistake of duplicating server data in client state.

The trickiest part was getting the debounced search to work smoothly with URL updates without causing infinite loops. The key was proper cleanup in the useEffect.

## Future Improvements

If I had more time, I'd add:

- Vendor filtering in the grid views
- Sort options (by RTP, by popularity, alphabetically)
- Click-to-play functionality with game iframes
- Wishlist/favorites view as a separate page
- Animations when games enter/exit favorites
- Better error handling (retry with exponential backoff)
- E2E tests with Playwright

## License

This is a portfolio project — feel free to reference it, but please don't copy it wholesale.

## Contact

Built by **Jeyasurya** as a technical showcase. Questions or feedback? Open an issue!
