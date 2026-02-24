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

React 19 + TypeScript + Vite 7 SPA. Firebase Auth + Firestore + Storage. React Router v6 con `HashRouter` (requerido por GitHub Pages).

### Entry point flow
- `src/main.tsx` → envuelve todo en `<AuthProvider>` → renderiza `<App>`
- `src/App.tsx` → `<HashRouter>` con `<Menu>` y `<Footer>` persistentes fuera del árbol de rutas, `<Layout>` envuelve todas las rutas

### Routing (`src/App.tsx`)
| Path | Component | Protegida |
|------|-----------|-----------|
| `/` | `HomePage` | No |
| `/juguetes` | `HomePage` | No |
| `/producto/:id` | `ProductDetail` | No |
| `/Login` | `Login` | No |
| `/Register` | `Register` | No |
| `/Admin` | `AdminPanel` | Sí — `ProtecterRouter` |

> La ruta `/Logout` fue eliminada. El logout es una acción, no una página.
> La ruta `/juguetes/:slug` (nested route con Outlet) fue eliminada — reemplazada por `/producto/:id`.

### Auth system (`src/component/auth/`)

**`authContext.tsx`** — fuente central de toda la lógica de autenticación:
- Expone `{ user: User | null, loading: boolean, logout: () => Promise<void> }` via `useAuth()` hook
- `logout()` llama a Firebase `signOut()`, que limpia la sesión de **IndexedDB**
- **Timer de inactividad de 5 minutos**: escucha `mousemove`, `mousedown`, `keydown`, `scroll`, `touchstart`, `click`. Si no hay actividad en 5 min, cierra sesión automáticamente. El timer solo corre cuando hay sesión activa.
- Usa `useRef` para el timer (no genera re-renders)
- **Nota file picker**: el diálogo del OS bloquea eventos del browser. Los componentes que usen `<input type="file">` deben despachar `document.dispatchEvent(new MouseEvent('click', { bubbles: true }))` en el `onChange` para resetear el timer.

**`ProtecterRouter.tsx`** — HOC que redirige a `/Login` si no hay usuario autenticado. Muestra "cargando..." mientras `loading === true`. Props tipadas con `React.PropsWithChildren`.

**Regla importante:** ningún componente debe importar Firebase directamente para hacer logout. Siempre usar `const { logout } = useAuth()`.

### Layout (`src/component/pages/layout/Layout.tsx`)
- Aplica `marginTop: 96px` a todas las páginas para compensar el nav fijo
- Para la ruta `/` no aplica `px-4` ni `items-center`, permitiendo secciones a ancho completo
- Para el resto de rutas aplica `items-center px-4`

### Menu (`src/component/pages/menu/Menu.tsx`)
- **Reactivo al auth**: cuando `user` existe muestra "Admin" + botón "Cerrar sesión"; cuando no hay sesión muestra "Ingresar" + "Registro"
- **Logo dinámico**: usa `useSettings()` → `settings?.logoUrl || logoImg` (fallback a `Logo.jpeg`)
- **Nombre dinámico**: si `settings?.storeName` existe lo muestra en el navbar; si no, muestra "Velas / Santa Marta" hardcodeado
- Logo estático fallback: `src/assets/Images/Logo.jpeg`

### Homepage (`src/component/pages/homePage/`)
`HomePage.tsx` es un orquestador que compone 6 secciones desde `homePage/sections/`:

| Archivo | Sección |
|---------|---------|
| `HeroSection.tsx` | Gradiente oscuro cálido, texto blanco, CTA "Comprar ahora" |
| `CategoryCards.tsx` | "Conoce nuestras Velas" — 2 tarjetas de categoría |
| `ProductsSection.tsx` | "Nuestros Productos" — grid de `<ProductCard/>` con skeleton loader |
| `CandleTypesSection.tsx` | "Tipos de Velas" — 4 categorías en grid |
| `ReviewsSection.tsx` | "Lo que dicen nuestros clientes" — 3 testimonios |
| `NewsletterSection.tsx` | "Regístrate y obtén 10% OFF" — formulario email |

### Login & Register
- Ambos usan `minHeight: calc(100vh - 96px)` para centrar el card correctamente bajo el nav fijo
- Inputs con `onFocus`/`onBlur` que cambian el borde a `--vsm-brand`
- Botón con estado de carga ("Verificando..." / "Creando cuenta...")
- Errores mostrados en caja roja suave
- Register valida: nombre no vacío, contraseña ≥ 6 caracteres, confirmación coincide, maneja `auth/email-already-in-use`
- Register llama `updateProfile(cred.user, { displayName: userName.trim() })` para guardar el nombre en Firebase Auth
- Login redirige a `/Admin` tras autenticación exitosa
- Register redirige a `/Login` tras registro exitoso

### Data layer — Catálogo público

**`src/ui/cards/ProductCard.tsx`** — tarjeta del catálogo:
- Lee `product.images[]`; si no existe usa `product.imageUrl` como fallback
- Crossfade al hover si hay ≥ 2 imágenes (opacity transition 0.4s)
- Badge "Agotado" si `stock === 0`; botón deshabilitado
- Link a `/producto/${product.id}`

**`src/component/pages/producto/ProductDetail.tsx`** — página de detalle dedicada:
- Ruta propia `/producto/:id`; obtiene el ID de `useParams()`
- `Promise.all` para cargar producto + categorías desde Firestore en paralelo
- Columna izquierda (60%): imagen principal con zoom (scale 1.08) al hover + fade 150ms al cambiar, miniaturas horizontales scrolleables (ocultas si solo hay 1 imagen), miniatura activa con borde `var(--vsm-brand)`
- Columna derecha (40%): badge categoría, nombre, precio, descripción, bloque aroma (si `product.aroma` existe), selector de cantidad, botón "Agregar al carrito", info de envío
- Skeleton loader mientras carga; página 404 amigable si el producto no existe
- Responsive: columnas apiladas en móvil (`grid-cols-1` → `grid-cols-[3fr_2fr]`)
- Botón "Volver al catálogo" enlaza a `/juguetes`

**`Product.images?: string[]`** — campo opcional; backwards compatible con `imageUrl`
**`Product.aroma?: string`** — campo opcional; si existe se muestra en el detalle del producto

### Footer (`src/component/pages/footer/`)
4 columnas: Logo + Sobre Nosotros | Nuestras Políticas | Más Información | Newsletter inline.
Links definidos en `FooterLinks.ts`.

---

## Admin Panel (`src/component/pages/admin/`)

Panel completo con 3 secciones accesible en `/#/Admin` (protegida por `ProtecterRouter`).

### Shell — `Admin.tsx`
- Layout: header (título + saludo + logout) + sidebar 200px desktop / tab row mobile + `<main>`
- Saludo: `user?.displayName ?? user?.email ?? 'Admin'`
- Secciones: `dashboard` | `productos` | `configuracion` (tipo `AdminSection`)
- Sidebar activo: `backgroundColor: var(--vsm-brand)`, blanco; inactivo: transparente, `var(--vsm-gray-mid)`

### Dashboard — `dashboard/Dashboard.tsx`
- Dos `onSnapshot` simultáneos: `collection(db,'products')` + `collection(db,'categories')`
- Stats calculadas en cliente: `totalProductos`, `totalCategorias`, `sinStock` (stock === 0)
- 3 tarjetas con `borderTop: 3px solid color`; la de sinStock usa rojo `#DC2626`
- Skeleton loading con 3 boxes grises mientras cargan

### Productos — `products/ProductList.tsx`
- Dos `onSnapshot`: products + categories (para resolver `categoryId` → nombre)
- Tabs: "Productos" | "Categorías" (tipo `ProductsTab`)
- Tabla paginada: `ITEMS_PER_PAGE = 10`, reset página cuando cambia la lista
- Columnas: imagen (48px con fallback), nombre, categoría, precio COP, stock (rojo si 0), acciones
- "Nuevo Producto" → `ProductForm` sin `product`; "Editar" → `ProductForm` con `product`; "Eliminar" → `ConfirmDialog`

### Formulario producto — `products/ProductForm.tsx`
- Modo create (`!product`) vs edit (`!!product`)
- Campos: nombre, descripción, precio, stock, categoría (select), URL imagen (texto), archivo imagen
- File input despacha `click` sintético en `onChange` para resetear el timer de inactividad
- Flujo create con imagen: `addDoc` → obtener ID → `uploadBytes` → `updateDoc` con URL
- El upload de imagen es **no-fatal**: si falla, el producto se guarda de todas formas y se muestra un aviso
- `price` y `stock` son `number | ''` para permitir campo vacío → al guardar `Number(val) || 0`

### Categorías — `products/CategoryList.tsx`
- `onSnapshot` en `collection(db,'categories')` ordenado por `createdAt asc`
- CRUD inline: agregar, editar (input inline), eliminar con `ConfirmDialog`
- Validación: nombre vacío o duplicado → error inline
- Eliminar muestra mensaje: "Esto no eliminará los productos asociados."

### Configuración — `settings/Settings.tsx`
- Carga inicial: `getDoc(doc(db,'settings','general'))` (no onSnapshot)
- Campos: storeName, description, email, phone, social (instagram, facebook, whatsapp, tiktok)
- Logo: file input → `uploadBytes` a ruta fija `logos/store-logo.{ext}` (sobreescribe) → `getDownloadURL`
  - Preview local con `URL.createObjectURL`; reset file input con `key={fileInputKey}` state
- Guardar: `setDoc(..., { merge: true })` con `serverTimestamp()`
- Banner éxito verde 3 segundos; error en caja roja

### Shared UI — `shared/`
- **`AdminModal.tsx`**: overlay fixed zIndex 50, cierra con X / click overlay / ESC, bloquea scroll del body
- **`ConfirmDialog.tsx`**: wrapper sobre AdminModal, botón "Cancelar" (gris) + "Eliminar" (rojo `#DC2626`)

---

## Firebase

Auth + Firestore + Storage inicializados en `src/firebase/firebase.config.ts`.
Exports: `auth`, `db`, `storage`.

### Colecciones Firestore
| Colección | Campos clave |
|-----------|-------------|
| `products` | `name`, `description`, `price`, `stock`, `categoryId`, `imageUrl`, `images?`, `aroma?`, `createdAt`, `updatedAt` |
| `categories` | `name`, `createdAt` |
| `settings/general` | `storeName`, `logoUrl`, `description`, `email`, `phone`, `social`, `updatedAt` |

### Storage paths
- `logos/store-logo.{ext}` — logo de la tienda (ruta fija, siempre sobreescribe)
- `products/{productId}/image.{ext}` — imagen por producto

### Reglas Firestore
```
match /settings/{id}   { allow read: if true; allow write: if request.auth != null; }
match /products/{id}   { allow read: if true; allow write: if request.auth != null; }
match /categories/{id} { allow read: if true; allow write: if request.auth != null; }
```

### Reglas Storage
```
match /logos/{path=**}    { allow read: if true; allow write: if request.auth != null; }
match /products/{path=**} { allow read: if true; allow write: if request.auth != null; }
```

### Variables de entorno (`.env`, no se commitea)
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
Firebase usa `browserLocalPersistence` por defecto. Para el panel admin se recomienda `browserSessionPersistence`:
```ts
import { setPersistence, browserSessionPersistence } from "firebase/auth"
setPersistence(auth, browserSessionPersistence)
```

---

## Services (`src/services/`)

### `settingsService.ts`
Encapsula toda la lógica Firebase de configuración de la tienda. `Settings.tsx` no importa Firebase directamente.

| Función | Descripción |
|---------|-------------|
| `fetchSettings()` | `getDoc` de `settings/general` → `StoreSettings \| null` |
| `uploadLogo(file)` | Sube a `logos/store-logo.{ext}` → retorna download URL |
| `saveSettings(data, logoUrl)` | `setDoc` con `merge: true` + `serverTimestamp()` |

---

## Hooks y Types

### `src/hooks/useSettings.ts`
- `onSnapshot` en `doc(db,'settings','general')`
- Error handler silencioso (usuarios no autenticados no rompen el navbar)
- Retorna `{ settings: StoreSettings | null, loading: boolean }`
- Usado en `Menu.tsx` para logo y nombre dinámicos

### `src/hooks/useFilePickerReset.ts`
- Retorna `resetTimer()`: despacha un `click` sintético en `document`
- Usar en el `onChange` de cualquier `<input type="file">` para resetear el timer de inactividad del auth context (el diálogo del OS bloquea eventos del browser mientras está abierto)

### `src/hooks/useCollection.ts`
- Genérico: `useCollection<T>(collectionName, ...constraints)` → `{ data: T[], loading: boolean }`
- Suscribe con `onSnapshot`, mapea docs a `{ id, ...data }`, hace unsubscribe en cleanup
- Acepta `QueryConstraint` opcionales (ej: `orderBy('createdAt', 'asc')`)

### `src/types/admin.ts`
Interfaces centralizadas: `Product`, `Category`, `SocialLinks`, `StoreSettings`, `ProductFormData`, `SettingsFormData`, `AdminSection`, `ProductsTab`

---

## Pendiente (próximas sesiones)
- Gestión de pedidos / carrito
- `browserSessionPersistence` para el panel admin

## Archivos que NO se modifican
`authContext.tsx`, `ProtecterRouter.tsx`, `Footer.tsx`, `Login.tsx`, `index.css`

## Deployment

- Vite base: `/tiendaVirtual/` (GitHub Pages)
- `HashRouter` en vez de `BrowserRouter` para evitar errores 404 en GitHub Pages
- `npm run deploy` hace build y publica la carpeta `dist/` en la rama `gh-pages`

## Commits
- Nunca incluir Co-Authored-By en los mensajes de commit
- El autor siempre soy yo
