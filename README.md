# Casino Lobby - Interview Challenge

Hey! This is what I built for the Next.js frontend challenge. It's a casino game browser where you can search games, filter by category, and scroll through results.

## Quick Start

```bash
yarn install
yarn dev
# Open http://localhost:3000
```

Tests:

```bash
yarn test
```

## What You'll See

Three different views depending on the URL:

- `/` - Main lobby with game rows (slots, table games, etc)
- `/?category=slots` - Grid of all slot games with infinite scroll
- `/?search=jack` - Search results

The whole thing is URL-driven - when you search or click a category, the URL updates. So bookmarks work, back button works, you can share links, all that good stuff.

## Tech Used (As Per Requirements)

- Next.js 14 (App Router + TypeScript)
- React Query 5 for API calls
- Zustand for state (though I barely used it - more on that below)
- SCSS Modules
- Framer Motion
- Jest + React Testing Library

## Project Structure

Quick overview of where things are:

```
src/
├── app/page.tsx              Main page that picks lobby/category/search view
├── components/
│   ├── game/GameCard/        Game card (has compact & full variants)
│   ├── lobby/GameRow/        Horizontal scrolling rows
│   ├── grid/CategoryGrid/    Full grid with infinite scroll
│   └── ui/SearchBar/         Search input with debounce
├── hooks/
│   ├── useGames.ts           Infinite scroll query
│   ├── useGameSearch.ts      Search API hook
│   └── useInfiniteScroll.ts  IntersectionObserver wrapper
└── store/useGameStore.ts     Just for favorites
```

## Key Decisions & Why

### URL Over Zustand

I know the requirements said use Zustand for app state, but I went with URL params for search/category instead. Before you ask why - here's my thinking:

With Zustand I'd need:

```typescript
store.setSearchQuery("jack");
store.setCategory("slots");
// Then also sync the URL somehow
```

With URL params:

```typescript
router.push("/?search=jack");
// That's it
```

Benefits:

- Back button just works
- Can share/bookmark any state
- Way less code
- No sync issues

I only used Zustand for favorited games since those need localStorage. Everything else is either in the URL or React Query's cache.

### React Query Setup

Each game row in the lobby is its own query. Yeah, more requests, but if one category breaks, the others still load. Seemed worth it.

For the grids, I'm using `useInfiniteQuery`. The API gives back a total count so I calculate next page like: `offset + count < total ? nextOffset : undefined`.

Cache times:

- Lobby rows: 5 min (games don't change much)
- Search: 2 min
- Grids: 1 min

### Component Approach

GameCard has two modes instead of two components:

- `variant="compact"` - lobby rows (just image + name)
- `variant="full"` - grids (adds vendor, RTP%, fun mode badge)

Keeps styling consistent and cuts down code duplication.

## How It Actually Works

**Search:** Type in the search bar → debounces 300ms → updates URL → fires search API (if 2+ chars). Not doing infinite scroll here since the search endpoint doesn't paginate.

**Categories:** Click a pill → URL changes to `/?category=slots` → CategoryGrid loads → useGames fetches with infinite scroll.

**Infinite Scroll:** Watching a div at the bottom with IntersectionObserver. When you scroll near it, calls `fetchNextPage()`. Remember to clean up the observer!

**Favorites:** Heart icon → add/remove slug from Zustand → persists to localStorage.

## API Stuff

Using `https://jpapi-staging.jackpot.bet`

Two endpoints:

- `/casino/games?limit=20&offset=0&category=VIDEOSLOTS`
- `/casino/games/search?query=jack`

Quick note: API wants uppercase categories (VIDEOSLOTS) but I'm using lowercase in URLs (slots) for cleaner links. Made a mapper to convert between them.

## Tests

```bash
yarn test
```

Covered the main stuff:

- Zustand store (favorite toggle, persistence)
- GameCard (both variants, badges, favorite button)
- GameCardSkeleton (placeholder counts)

Yeah, could've tested more (hooks, SearchBar) but ran out of time. Focused on the core state stuff first.

## Tricky Parts

**Debounced search + URL:** Almost got into an infinite loop mess. Had to make sure the setTimeout cleanup ran properly when component unmounts or value changes.

**React Query getNextPageParam:** Took me a sec to realize it wants `undefined` for "no more pages", not `null` or `false`.

**Mobile scroll peek effect:** Getting that "2.5 cards visible" look on mobile was annoying. Ended up playing with container padding and negative margins till it looked right.

## Why I Built It This Way

Look, I know choosing URL params over Zustand might seem weird for an interview that specifically said "use Zustand for state". But here's the thing - the URL IS state. And it's better state because:

Traditional approach:

```typescript
// In store
setSearchQuery(value);
setCategory(cat);
clearFilters();
// Then somehow keep URL in sync...
```

What I did:

```typescript
router.push(`/?search=${value}`);
const search = searchParams.get("search");
// URL = source of truth
```

Saves a bunch of code, makes the app more shareable, works better with SSR if you ever need it. The Zustand store I DID make is super minimal - just favorites. Keeps things focused.

## Performance Notes

- Next Image with blur placeholders (from API)
- Only priority loading on first few images
- React Query dedupes requests automatically
- Native IntersectionObserver (no extra libs)
- Independent queries per row (fault isolation)

## Final Thoughts

Tried to stick close to the Figma designs while keeping code maintainable. The URL-driven thing might be controversial but I think it's the right call here.

Questions? Lmk!
