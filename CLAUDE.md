# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Type-check + build for production (tsc -b && vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
npm run deploy     # Build and deploy to GitHub Pages (gh-pages -d dist)
```

No test framework is configured in this project.

## Architecture

This is a React + TypeScript + Vite toy store (tienda virtual) SPA using Firebase Authentication and React Router v6.

**Entry point flow:**
- `src/main.tsx` wraps the app in `<AuthProvider>` (from `src/component/auth/authContext.tsx`), then renders `<App>`
- `src/App.tsx` sets up `<HashRouter>` with a persistent `<Menu>` and `<Footer>` outside the route tree, and a `<Layout>` wrapper around all routes

**Routing (`src/App.tsx`):**
| Path | Component | Notes |
|------|-----------|-------|
| `/` | `HomePage` | |
| `/juguetes/:slug` | `JugueteDetalle` | Nested under `/juguetes` |
| `/Login` | `Login` | |
| `/Register` | `Register` | |
| `/Crear` | `ToyCreate` | |
| `/Logout` | `Logout` | |
| `/Admin` | `AdminPanel` | Wrapped in `ProtecterRouter` |

**Auth system (`src/component/auth/`):**
- `authContext.tsx` — `AuthProvider` subscribes to Firebase `onAuthStateChanged` and exposes `{ user, loading }` via `useAuth()` hook
- `ProtecterRouter.tsx` — redirects unauthenticated users to `/Login`; shows a loading state while auth resolves

**Firebase (`src/firebase/firebase.config.ts`):**
- Only Firebase Auth is initialized (`getAuth`). No Firestore or Storage configured yet.
- All config values come from `VITE_` environment variables. Create a `.env` file at the project root with these keys:
  ```
  VITE_FIREBASE_API_KEY=
  VITE_FIREBASE_AUTH_DOMAIN=
  VITE_FIREBASE_PROJECT_ID=
  VITE_FIREBASE_STORAGE_BUCKET=
  VITE_FIREBASE_MESSAGING_SENDER_ID=
  VITE_FIREBASE_APP_ID=
  VITE_FIREBASE_MEASUREMENT_ID=
  ```

**Data layer:**
- `src/component/pages/juguetes/JuguetesData.tsx` holds toy data as a static in-memory array (placeholder for a future DB/API call). The `JugueteProps` interface defines `{ title, slug, content, precio }`.

**UI components (`src/IU/`):**
- `bottons/Botton.tsx` and `bottons/Botton_Back.tsx` — reusable button components
- `cards/juguete.tsx` — card grid component that maps over `juguetesData` and links to `/juguetes/:slug`

**Deployment:**
- Vite base is set to `/tiendaVirtual/` for GitHub Pages hosting
- `HashRouter` is used (not `BrowserRouter`) to support GitHub Pages routing without server-side config
