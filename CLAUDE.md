# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server → http://localhost:5173/tiendaVirtual/#/
npm run build      # Type-check + build for production (tsc -b && vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
npm run deploy     # Build and deploy to GitHub Pages (gh-pages -d dist)
```

No test framework is configured in this project.

## Project identity

**Velas Santa Marta** — tienda virtual de velas artesanales ubicada en Santa Marta, Colombia.
Diseño visual inspirado en [velasdelafe.com](https://velasdelafe.com): fondo blanco/gris claro, tipografía Mulish (Google Fonts), color de marca naranja-ámbar `#C96B2B`.

### Design tokens (src/index.css)
```css
--vsm-bg:         #F5F5F5   /* fondo general */
--vsm-white:      #FFFFFF
--vsm-black:      #111111
--vsm-gray:       #E8E8E8   /* bordes */
--vsm-gray-mid:   #777777   /* texto secundario */
--vsm-brand:      #C96B2B   /* naranja marca — botones, acentos */
--vsm-brand-dark: #A8561F   /* hover del color de marca */
```

## Architecture

React 19 + TypeScript + Vite 7 SPA. Firebase Authentication como backend. React Router v6 con `HashRouter` (requerido por GitHub Pages).

### Entry point flow
- `src/main.tsx` → envuelve todo en `<AuthProvider>` → renderiza `<App>`
- `src/App.tsx` → `<HashRouter>` con `<Menu>` y `<Footer>` persistentes fuera del árbol de rutas, `<Layout>` envuelve todas las rutas

### Routing (`src/App.tsx`)
| Path | Component | Protegida |
|------|-----------|-----------|
| `/` | `HomePage` | No |
| `/juguetes` | `HomePage` | No |
| `/juguetes/:slug` | `JugueteDetalle` | No (nested route con Outlet) |
| `/Login` | `Login` | No |
| `/Register` | `Register` | No |
| `/Crear` | `ToyCreate` | No |
| `/Admin` | `AdminPanel` | Sí — `ProtecterRouter` |

> La ruta `/Logout` fue eliminada. El logout es una acción, no una página.

### Auth system (`src/component/auth/`)

**`authContext.tsx`** — fuente central de toda la lógica de autenticación:
- Expone `{ user: User | null, loading: boolean, logout: () => Promise<void> }` via `useAuth()` hook
- `logout()` llama a Firebase `signOut()`, que limpia la sesión de **IndexedDB**
- **Timer de inactividad de 5 minutos**: escucha `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`, `click`. Si no hay actividad en 5 min, cierra sesión automáticamente. El timer solo corre cuando hay sesión activa.
- Usa `useRef` para el timer (no genera re-renders)

**`ProtecterRouter.tsx`** — HOC que redirige a `/Login` si no hay usuario autenticado. Muestra "cargando..." mientras `loading === true`.

**Regla importante:** ningún componente debe importar Firebase directamente para hacer logout. Siempre usar `const { logout } = useAuth()`.

### Layout (`src/component/pages/layaut/Layout.tsx`)
- Aplica `marginTop: 96px` a todas las páginas para compensar el nav fijo (barra anuncio ~28px + nav principal ~68px)
- Para la ruta `/` no aplica `px-4` ni `items-center`, permitiendo secciones a ancho completo
- Para el resto de rutas aplica `items-center px-4`

### Menu (`src/component/pages/menu/Menu.tsx`)
- **Reactivo al auth**: cuando `user` existe muestra "Admin" + botón "Cerrar sesión"; cuando no hay sesión muestra "Ingresar" + "Registro"
- Incluye barra de anuncio negra superior: *"El costo del envío se paga al momento de la entrega"*
- Logo: `src/assets/Images/Logo.jpeg` — reemplazar este archivo para cambiar el logo

### Homepage (`src/component/pages/homePage/HomePage.tsx`)
6 secciones en orden:
1. **Hero** — gradiente oscuro cálido, texto blanco, CTA "Comprar ahora"
2. **"Conoce nuestras Velas"** — 2 tarjetas de categoría (fondo blanco)
3. **"Nuestros Productos"** — grid de `<CardJuguete/>` con `<Outlet/>` para detalle anidado
4. **"Tipos de Velas"** — 4 categorías en grid (Soya, Cera de Abeja, Decorativas, Aromáticas)
5. **Reseñas** — 3 testimonios estáticos
6. **Newsletter** — formulario "Regístrate y obtén 10% OFF" (fondo color de marca)

### Login & Register
- Ambos usan `minHeight: calc(100vh - 96px)` para centrar el card correctamente bajo el nav fijo
- Inputs con `onFocus`/`onBlur` que cambian el borde a `--vsm-brand`
- Botón con estado de carga ("Verificando..." / "Creando cuenta...")
- Errores mostrados en caja roja suave
- Register valida: contraseña ≥ 6 caracteres, confirmación de contraseña coincide, maneja `auth/email-already-in-use`
- Login redirige a `/Admin` tras autenticación exitosa
- Register redirige a `/Login` tras registro exitoso

### Data layer
`src/component/pages/juguetes/JuguetesData.tsx` — array estático de 6 velas (placeholder hasta conectar Firestore):
```ts
interface JugueteProps { title: string; slug: string; content: string; precio: number }
```
Velas: Coco, Sándalo, Lavanda, Marina, Rosa, Canela.

### UI components (`src/IU/`)
- `bottons/Botton.tsx` — botón de marca (`--vsm-brand` bg, blanco, uppercase)
- `cards/juguete.tsx` — grid 2×3 de tarjetas estilo velasdelafe: badge Nuevo/Especial (`#AEFF00`/`#00D4C8`), nombre, precio formateado en COP, botón "Añadir al carrito"

### Footer (`src/component/pages/footer/`)
4 columnas: Logo + Sobre Nosotros | Nuestras Políticas | Más Información | Newsletter inline.
Links definidos en `FooterLinks.ts`.

## Firebase

Solo Firebase Auth inicializado (`getAuth`). Firestore y Storage **no** están configurados aún.

Variables de entorno requeridas en `.env` (no se commitea):
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

### Mejora pendiente (session persistence)
Firebase usa `browserLocalPersistence` por defecto (sesión persiste entre reinicios del navegador). Para el panel admin se recomienda `browserSessionPersistence` (se borra al cerrar la pestaña). Configurar en `src/firebase/firebase.config.ts`:
```ts
import { setPersistence, browserSessionPersistence } from "firebase/auth"
setPersistence(auth, browserSessionPersistence)
```

## Deployment

- Vite base: `/tiendaVirtual/` (GitHub Pages)
- `HashRouter` en vez de `BrowserRouter` para evitar errores 404 en GitHub Pages
- `npm run deploy` hace build y publica la carpeta `dist/` en la rama `gh-pages`
