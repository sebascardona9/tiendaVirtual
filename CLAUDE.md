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
Diseño visual de estética cálida/artesanal: tipografía **Cormorant Garamond** (títulos serif) + **DM Sans** (cuerpo), paleta tierra-ámbar.

### Design tokens (src/index.css)
```css
--vsm-bg:         #FAF7F2   /* warm white — fondo general */
--vsm-white:      #FFFFFF
--vsm-black:      #1A1208   /* warm dark */
--vsm-gray:       #E4D9CC   /* warm gray — bordes, skeletons */
--vsm-gray-mid:   #7A6248   /* warm brown — texto secundario */
--vsm-brand:      #C8732A   /* amber — botones, acentos */
--vsm-brand-dark: #A8561F   /* amber hover */
--vsm-bg-warm:    #F5EFE4   /* cream */
```

### Tipografía
- **Títulos `h1`, `h2`, `h3`**: `Cormorant Garamond` serif — pesos 300 / 400 / 600 + itálicas
- **Cuerpo**: `DM Sans` — pesos 300 / 400 / 500
- Import en `index.css` vía Google Fonts

---

## Principio de arquitectura: SRP (Single Responsibility Principle)

Todo el panel admin y las páginas complejas siguen SRP. Cada archivo tiene **una única responsabilidad**:

| Capa | Responsabilidad | Ejemplo |
|------|----------------|---------|
| **Servicio** (`*.service.ts`) | Toda la lógica Firebase (Firestore/Storage). Los componentes no importan Firebase directamente. | `aromas.service.ts` |
| **Hook de datos** (`use*.ts`) | Suscripción reactiva a Firestore vía `useCollection`. Wrapper fino. | `useAromas.ts` |
| **Orquestador** (`*Section.tsx`, `*List.tsx` padre) | Estado local, handlers, coordina hijos. Sin lógica de UI propia. | `AromasSection.tsx` |
| **Lista** (`*List.tsx`) | Tabla/lista pura, 100% props-driven. Solo emite eventos. Sin estado. | `AromasList.tsx` |
| **Formulario** (`*Form.tsx`) | Estado local mínimo del form. Llama al servicio. Siempre dentro de `AdminModal`. | `AromaForm.tsx` |
| **Modal de eliminación** (`*DeleteModal.tsx`) | Lógica de bloqueo referencial + ConfirmDialog. | `AtributoDeleteModal.tsx` |
| **Componente hoja** | UI pura sin side effects. | `ColorPreview.tsx`, `ToggleSwitch.tsx` |

### Patrón CRUD admin (replicar al añadir nuevas entidades)

```
src/services/entidad.service.ts          → checkDependencies, delete, toggle, save
src/hooks/useEntidad.ts                  → wrapper fino sobre useCollection
src/component/pages/admin/.../
  EntidadSection.tsx                     → estado: showForm, editItem, deleteTarget, blockInfo, toggleLoading
  EntidadList.tsx                        → tabla pura: props aromas, toggleLoading, onToggle, onEdit, onDelete
  EntidadForm.tsx                        → AdminModal + form local + llama a service
  EntidadDeleteModal.tsx                 → blockInfo===null→spinner | deps>0→bloqueado | deps===0→ConfirmDialog
```

**Regla de eliminación**: siempre soft-delete (`active: false` / `activo: false`), nunca `deleteDoc`. Verificar dependencias activas antes con `checkDependencies` y mostrar bloqueo si las hay.

**Nombres de campos**: productos/categorías usan inglés (`active`, `createdAt`). Aromas/colores usan español (`activo`, `creadoEn`) — mantener consistencia dentro de cada colección.

---

## Architecture

React 19 + TypeScript + Vite 7 SPA. Firebase Auth + Firestore + Storage. React Router v6 con `HashRouter` (requerido por GitHub Pages).

### Entry point flow
- `src/main.tsx` → envuelve todo en `<AuthProvider>` → renderiza `<App>`
- `src/App.tsx` → `<HashRouter>` con `<Menu>` y `<Footer>` persistentes fuera del árbol de rutas, `<Layout>` envuelve todas las rutas

### Routing (`src/App.tsx`)
| Path | Component | Protegida |
|------|-----------|-----------|
| `/` | `HomePage` | No |
| `/catalogo` | `CatalogPage` | No |
| `/contacto` | `ContactPage` | No |
| `/producto/:id` | `ProductDetail` | No |
| `/carrito` | `CartPage` | No |
| `/checkout` | `CheckoutPage` | No |
| `/orden-confirmada` | `OrdenConfirmadaPage` | No |
| `/Login` | `Login` | No |
| `/Register` | `Register` | No |
| `/Admin` | `AdminPanel` | Sí — `ProtecterRouter` |

> La ruta `/Logout` fue eliminada. El logout es una acción, no una página.
> La ruta `/catalogo/:slug` (nested route con Outlet) fue eliminada — reemplazada por `/producto/:id`.

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
- **Nombre dinámico**: si `settings?.storeName` existe lo muestra en el navbar
- **Icono carrito** con badge: usa `useCartContext()` → `totalItems`. Badge ámbar `var(--vsm-brand)` con contador. Solo visible si `totalItems > 0`.
- Logo estático fallback: `src/assets/Images/Logo.jpeg`
- Links de nav: Inicio | + Productos | Nosotros | Contacto

### Homepage (`src/component/pages/homePage/`)
`HomePage.tsx` es el **orquestador de datos y de secciones**. Abre **3 listeners únicos** en Firestore y pasa los datos como props a las 4 secciones:

```
HomePage.tsx
  ├─ useCollection<Product>('products', where active=true)      → products, loading
  ├─ useCollection<Category>('categories', where active=true)   → categories, loading
  └─ useCollection<Subcategory>('subcategories', where active=true) → subcategories, loading
```

> **Optimización de lecturas Firestore**: antes cada sección abría su propio `onSnapshot` sobre `products`, resultando en 4 listeners duplicados. Con el patrón actual se reduce a 1 → ahorra **62% de lecturas** en la página más visitada y triplica el umbral del plan gratuito (de ~15k a ~44k visitas/mes antes de cobrar).

| Archivo | Sección | Props recibe |
|---------|---------|-------------|
| `HeroSection.tsx` | Carrusel dinámico + texto CTA + video de fondo | `products`, `loading` |
| `CategoryCards.tsx` | "Conoce nuestras Velas" — tarjeta por cada categoría activa | `products`, `categories`, `loading` |
| `ProductsSection.tsx` | "Nuestros Productos" — grid de `<ProductCard/>` | `products`, `loading` |
| `CandleTypesSection.tsx` | "Explora nuestras colecciones" — subcategorías activas | `products`, `subcategories`, `loading` |

> `NewsletterSection.tsx` y `ReviewsSection.tsx` fueron eliminadas (contenido hardcodeado).

**`HeroSection.tsx`** — recibe `{ products, loading }` desde `HomePage`:
- `HeroCarousel` ordena `products` por `createdAt` desc, máximo 8 — sin llamada a Firestore propia
- Si hay `heroVideoURL` en settings: muestra video de fondo y oculta el carrusel
- Rotación automática cada 3 s; pausa 5 s al interactuar manualmente
- Estilos de animación en `HeroSection.css`
- Responsive: `grid-cols-1` → `lg:grid-cols-2`
- `useSettings()` sigue llamándose internamente (solo para video/texto hero)

**`CategoryCards.tsx`** — recibe `{ products, categories, loading }` desde `HomePage`:
- `useMemo` → `Map<categoryId, Product[]>` para agrupar productos por categoría
- Solo muestra categorías con ≥1 producto activo
- Cada tarjeta contiene `<ProductCarousel>` (rotación cada 5 s) + nombre + descripción + link
- Link "Ver productos →" → `/catalogo?categoria=<id>`
- Grid: `grid-cols-1 md:grid-cols-2` (3 columnas si ≥3 categorías)
- Skeleton de 3 tarjetas; estado vacío si no hay categorías con productos

**`CandleTypesSection.tsx`** — recibe `{ products, subcategories, loading }` desde `HomePage`:
- `useMemo` → `Map<subcategoryId, imageUrl>`: primera imagen disponible de cada subcategoría
- Si no hay subcategorías activas → `return null` (no ocupa espacio)
- Cada tarjeta: imagen real del primer producto de esa subcategoría (fallback 🕯️)
- Link → `/catalogo?categoria=${sub.categoryId}` (pre-selecciona la categoría padre)
- Grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`

**`ProductsSection.tsx`** — recibe `{ products, loading }` desde `HomePage`. Productos ya filtrados con `where active=true`.

### ContactPage (`src/component/pages/contacto/`)
Ruta `/contacto`. Componentes extraídos en `contacto/components/` (SRP):
- `ContactForm.tsx` — formulario: nombre, email, asunto, mensaje → guarda en colección `messages`
- `InfoCard.tsx` — tarjeta de contacto con hover elevación + sombra ámbar
- `WhatsAppButton.tsx` — botón verde (`#25D366`, `wa.me/{phone}`)
- `InstagramLink.tsx` — link con SVG
- `FadeIn.tsx` — wrapper `IntersectionObserver` para scroll animations

`ContactPage.tsx` — orquestador:
- **Hero**: `minHeight: 60vh`, fondo `#1A1208`, radial glow ámbar, título Cormorant italic peso 300
- **Sección principal** (2 columnas `grid auto-fit minmax(300px,1fr)`): info cards a la izquierda, formulario a la derecha
- **Quote banner**: fondo oscuro, frase italic
- Datos de contacto desde `useSettings()`; formulario guarda `{ name, email, phone, subject, message, createdAt, read: false }`
- Estilos en `ContactPage.css` (spinner + keyframe `contactFadeUp`)

### CatalogPage (`src/component/pages/catalog/CatalogPage.tsx`)
- Ruta `/catalogo`
- Lee `?categoria=` al montar: `useState(searchParams.get('categoria'))` para pre-seleccionar categoría al llegar desde CategoryCards o CandleTypesSection
- Suscripciones: `categories` + `subcategories` + `products` con `where('active','==',true)`
- Orden client-side por `createdAt` (evita índices compuestos en Firestore)
- **Fila 1**: chips de categoría (Todos | Cat A | Cat B…)
- **Fila 2**: chips de subcategoría (solo cuando hay categoría seleccionada)
- Filtro de integridad referencial: productos cuya categoría/subcategoría no esté activa se ocultan
- Grid responsive: `grid-cols-2 / md:grid-cols-3 / lg:grid-cols-4`
- Estado vacío con botón "Ver todos los productos"

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

**`src/ui/carousels/ProductCarousel.tsx`** — carrusel de imágenes puro (sin texto):
- Props: `products: Product[]`, `autoIntervalMs?`, `pauseAfterMs?`
- Usa `useCarousel` hook
- Slide con fade, flechas ‹/› overlay circular, dots en borde inferior
- Clic en imagen → `navigate('/producto/:id')`
- `loading="lazy"` en todas las imágenes; placeholder 🕯️ si sin imagen o sin productos

**`src/component/pages/producto/ProductDetail.tsx`** — página de detalle:
- Ruta `/producto/:id`; obtiene el ID de `useParams()`
- Producto: `onSnapshot` en tiempo real (garantiza datos frescos en todos los navegadores)
- Categorías: `getDocs` una sola vez (cambian poco, no requieren RT)
- Columna izquierda (60%): `<ProductGallery>` — imagen principal con zoom + fade, miniaturas
- Columna derecha (40%): `<ProductInfo>` — nombre, precio, badge categoría, descripción, `<ProductoAtributosSelector>`, stock, cantidad, botón carrito
- Skeleton loader (`<SkeletonDetail>`); página 404 amigable (`<NotFoundProduct>`)
- Responsive: `grid-cols-1` → `grid-cols-[3fr_2fr]`
- Componentes extraídos en `producto/components/` (SRP)

**Selectores de aroma y color — `producto/components/`** (SRP):

| Componente | Responsabilidad |
|------------|----------------|
| `ProductoAtributosSelector.tsx` | Orquestador: carga aromas/colores activos via `useAtributosProducto`, maneja estado de selección, comunica validez al padre |
| `ProductoAromaSelector.tsx` | Chips seleccionables de aroma. Hoja pura — sin estado ni efectos |
| `ProductoColorSwatch.tsx` | Swatches circulares con `codigoHex`. Hoja pura — sin estado ni efectos |

- Aromas y colores son **atributos globales de la tienda**, NO campos del producto. El cliente los elige al momento de comprar.
- Los selectores se muestran **solo si hay ítems activos** en Firestore — `return null` si ambas colecciones están vacías.
- Ninguno pre-seleccionado por defecto. Selección requerida antes de agregar al carrito (validación en `ProductInfo`).
- `ProductoAtributos.tsx` — archivo deprecado, stub vacío. Ya no se usa.

**`ProductInfo.tsx`** — columna derecha del detalle:
- Estado `atributosOk` (bool) actualizado por `ProductoAtributosSelector` via `onValidChange`
- Estado `showAtributosError` (bool): se activa al pulsar "Agregar al carrito" sin selección completa
- Estado `seleccion: AtributosSeleccion` actualizado via `onSelectionChange`
- Estado `addedFeedback` (bool): botón se pone verde y muestra "¡Agregado! ✓" durante 2 s
- `handleAddToCart` llama `agregarItem({ productoId, nombre, precio, imagen, cantidad, stock, aroma, color, colorHex })`
- `handleValidChange` y `handleSelectionChange` memoizados con `useCallback`

**`Product.images?: string[]`** — campo opcional; backwards compatible con `imageUrl`
**`Product.active: boolean`** — backwards compat: filtrar con `p.active !== false` en homepage; `where('active','==',true)` en CatalogPage

### Footer (`src/component/pages/footer/`)
4 columnas: Logo + Sobre Nosotros | Nuestras Políticas | Más Información | Newsletter inline.
Links definidos en `FooterLinks.ts`.

---

## Admin Panel (`src/component/pages/admin/`)

Panel completo accesible en `/#/Admin` (protegida por `ProtecterRouter`).

### Shell — `Admin.tsx`
- Layout: header (título + saludo + logout) + sidebar 200px desktop / tab row mobile + `<main>`
- Saludo: `user?.displayName ?? user?.email ?? 'Admin'`
- Secciones: `dashboard` | `productos` | `ordenes` | `configuracion` | `mensajes` (tipo `AdminSection`)
- Sidebar activo: `backgroundColor: var(--vsm-brand)`, blanco; inactivo: transparente, `var(--vsm-gray-mid)`
- Badge de mensajes no leídos: `useCollection<Message>('messages')` → filtra `!m.read` → muestra contador en sidebar y tab mobile

### Dashboard — `dashboard/Dashboard.tsx`
- Dos `onSnapshot` simultáneos: `collection(db,'products')` + `collection(db,'categories')`
- Stats calculadas en cliente: `totalProductos`, `totalCategorias`, `sinStock` (stock === 0)
- 3 tarjetas con `borderTop: 3px solid color`; la de sinStock usa rojo `#DC2626`
- Skeleton loading con 3 boxes grises mientras cargan

### Productos — `products/ProductList.tsx`
- `onSnapshot`: products + categories + subcategories
- **3 tabs**: `'productos'` | `'categorias'` | `'atributos'` (tipo `ProductsTab`)
- Tab productos: tabla paginada (`ITEMS_PER_PAGE = 10`), soft-delete, toggle activo
- Tab categorías: `<CategoryList>` — gestión de categorías y subcategorías
- Tab atributos: `<AtributosTab>` — gestión de aromas y colores

### Formulario producto — `products/ProductForm.tsx`
- Modo create (`!product`) vs edit (`!!product`)
- Campos: nombre, descripción, precio, stock, categoría, subcategoría, activo, imágenes
- **No incluye selectores de aroma ni color** — esos son atributos globales que el cliente elige al comprar
- Flujo create con imagen: `addDoc` → obtener ID → `uploadBytes` → `updateDoc` con URL
- Componentes extraídos en `products/form/` (SRP):
  - `ProductFields.tsx` — nombre, descripción, precio, stock, categoría, subcategoría, activo
  - `ProductImageManager.tsx` — gestión de imágenes (upload, reorder, delete)

### Categorías — `products/CategoryList.tsx`
- Tres `onSnapshot`: categories + subcategories + products (para counters)
- Componentes en `products/categories/` (SRP): `CategoryRow`, `SubcategoryPanel`, `AddCategoryForm`
- **ToggleSwitch** inline: activa/desactiva categorías y subcategorías
- **Filas expandibles**: ▼/▲ muestra subcats + formulario nueva subcategoría
- **Bloqueo referencial al eliminar**: `checkCategoryDependencies` / `checkSubcategoryDependencies`
- **Toggle con cascade**: desactivar categoría → batch desactiva todas sus subcategorías
- **Editar nombre**: batch actualiza `categoryName`/`subcategoryName` en docs relacionados

### Atributos — `products/` → `settings/atributos/` (tab en ProductList)
Gestión de aromas y colores. Componentes en `settings/atributos/` (SRP):

| Componente | Responsabilidad |
|------------|----------------|
| `AtributosTab.tsx` | Layout: encabezado + `<AromasSection>` + divisor + `<ColoresSection>` |
| `AromasSection.tsx` | Orquestador: estado showForm/editAroma/deleteTarget/blockInfo/toggleLoading |
| `ColoresSection.tsx` | Orquestador: mismo patrón para colores |
| `AromasList.tsx` | Tabla pura: nombre, descripción, activo (toggle), acciones |
| `ColoresList.tsx` | Tabla pura: preview hex + nombre, activo, acciones |
| `AromaForm.tsx` | AdminModal + form: nombre (req), descripción, activo |
| `ColorForm.tsx` | AdminModal + form: nombre (req), codigoHex (color picker + text), activo |
| `ColorPreview.tsx` | Círculo de color 18×18px. Usado también en `ProductoColorSwatch` |
| `AtributoDeleteModal.tsx` | blockInfo===null→spinner \| deps>0→bloqueado \| deps===0→ConfirmDialog |

### Mensajes — `messages/MessagesSection.tsx`
Gestión de mensajes del formulario de contacto. Componentes en `messages/` (SRP):
- `MessagesSection.tsx` — orquestador: lista + modal de detalle, marca como leído al abrir
- `MessagesList.tsx` — tabla pura: nombre, email, asunto, fecha, estado (leído/no leído), Ver
- `MessageDetail.tsx` — `AdminModal` con nombre, email, teléfono (si existe), fecha, mensaje y link "Responder por email"

### Órdenes — `ordenes/OrdenesPage.tsx`
Gestión de pedidos recibidos. Componentes en `ordenes/` (SRP):
- `OrdenesPage.tsx` — orquestador: skeleton + toggle lista/detalle
- `OrdenesList.tsx` — tabla: número, comprador, municipio, total, estado badge, Ver detalle
- `OrdenDetalle.tsx` — secciones: Comprador, Envío (con badge 🎁 si es para tercero), Productos, cambio de estado
- `OrdenEstadoBadge.tsx` — badge coloreado: amarillo (pendiente) / azul (enviado) / verde (entregado) / rojo (cancelado)

Hook: `useOrdenes.ts` — `useCollection<Orden>('ordenes')`, ordena por `creadoEn.seconds` desc client-side.
Servicio: `ordenes.service.ts` — `crearOrden` + `actualizarEstadoOrden`.

### Configuración — `settings/Settings.tsx`
3 tabs: General | Redes Sociales | Hero. Componentes en `settings/tabs/`:
- `SettingsGeneral.tsx` — storeName, description, address, email, phone, logo
- `SettingsSocial.tsx` — instagram, facebook, tiktok, whatsapp
- `SettingsHero.tsx` — heroEyebrow, heroTitulo, heroSubtitulo + bloque video

Carga inicial: `getDoc(doc(db,'settings','general'))` (no onSnapshot).
Guardar: `setDoc(..., { merge: true })` + `serverTimestamp()`. Banner éxito verde 3 s.

### Shared UI — `shared/`
- **`AdminModal.tsx`**: overlay fixed zIndex 50, cierra con X / click overlay / ESC, bloquea scroll del body
- **`ConfirmDialog.tsx`**: wrapper sobre AdminModal, botón "Cancelar" (gris) + "Eliminar" (rojo `var(--vsm-error)`)

---

## Firebase

Auth + Firestore + Storage inicializados en `src/firebase/firebase.config.ts`.
Exports: `auth`, `db`, `storage`.

### Colecciones Firestore
| Colección | Campos clave |
|-----------|-------------|
| `products` | `name`, `description`, `price`, `stock`, `categoryId`, `categoryName`, `subcategoryId?`, `subcategoryName?`, `imageUrl`, `images?`, `active`, `createdAt`, `updatedAt` |
| `categories` | `name`, `description?`, `active`, `createdAt` |
| `subcategories` | `name`, `description?`, `categoryId`, `categoryName`, `active`, `createdAt` |
| `aromas` | `nombre`, `descripcion?`, `activo`, `creadoEn` |
| `colores` | `nombre`, `codigoHex?`, `activo`, `creadoEn` |
| `settings/general` | `storeName`, `logoUrl`, `description`, `address?`, `email`, `phone`, `social`, `heroVideoURL?`, `heroEyebrow?`, `heroTitulo?`, `heroSubtitulo?`, `ultimoNumeroPedido`, `updatedAt` |
| `messages` | `name`, `email`, `phone?`, `subject`, `message`, `createdAt`, `read` |
| `ordenes` | `numeroOrden`, `comprador`, `envio`, `items[]`, `total`, `estado`, `creadoEn` |

### Backward compat — campo `active` en products
Productos en Firestore sin campo `active`: `where('active','==',true)` NO los devuelve → no aparecen en CatalogPage. `ProductsSection` (homepage) usa `p.active !== false` → siguen visibles. Al editar y guardar desde admin se escribe `active: true` → se integran al nuevo sistema.

### Storage paths
- `logos/store-logo.{ext}` — logo de la tienda (ruta fija, siempre sobreescribe)
- `products/{productId}/image-{timestamp}-{index}.{ext}` — imágenes por producto
- `hero/hero-video.{ext}` — video del hero

### Reglas Firestore
```
match /settings/{id}      { allow read: if true; allow write: if request.auth != null; }
match /products/{id}      { allow read: if true; allow write: if request.auth != null; }
match /categories/{id}    { allow read: if true; allow write: if request.auth != null; }
match /subcategories/{id} { allow read: if true; allow write: if request.auth != null; }
match /aromas/{id}        { allow read: if true; allow write: if request.auth != null; }
match /colores/{id}       { allow read: if true; allow write: if request.auth != null; }
match /messages/{id}      { allow read: if request.auth != null; allow write: if true; }
match /ordenes/{id}       { allow read: if request.auth != null; allow create: if true; allow update: if request.auth != null; }
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
| Función | Descripción |
|---------|-------------|
| `fetchSettings()` | `getDoc` de `settings/general` → `StoreSettings \| null` |
| `uploadLogo(file)` | Sube a `logos/store-logo.{ext}` → retorna download URL |
| `saveSettings(data, logoUrl)` | `setDoc` con `merge: true` + `serverTimestamp()` |
| `savePartialSettings(data)` | `setDoc` parcial — usado por tabs independientes |
| `uploadHeroVideo(file, onProgress)` | Upload con progreso → guarda URL en settings |
| `deleteHeroVideo(videoUrl)` | Borra de Storage + limpia `heroVideoURL` en Firestore |

### `categoryService.ts`
| Función | Descripción |
|---------|-------------|
| `checkCategoryDependencies(id)` | Retorna `{ activeSubcategories[], activeProducts[] }` |
| `deleteCategory(id)` | Soft delete: `updateDoc({ active: false })` |
| `toggleCategoryActive(id, currentlyActive)` | `writeBatch`: categoría + cascade subcategorías |
| `updateCategoryName(id, newName)` | `writeBatch`: categoría + `categoryName` en subcategorías y productos |

### `subcategoryService.ts`
| Función | Descripción |
|---------|-------------|
| `checkSubcategoryDependencies(id)` | Retorna `{ activeProducts[] }` |
| `deleteSubcategory(id)` | Soft delete: `updateDoc({ active: false })` |
| `toggleSubcategoryActive(id, currentlyActive)` | `updateDoc({ active: !currentlyActive })` |
| `updateSubcategoryName(id, newName)` | `writeBatch`: subcategoría + `subcategoryName` en productos |

### `aromas.service.ts`
| Función | Descripción |
|---------|-------------|
| `checkAromaDependencies(id)` | Retorna `{ activeProducts[] }` con `aromaId == id` |
| `deleteAroma(id)` | Soft delete: `updateDoc({ activo: false })` |
| `toggleAromaActive(id, currentlyActive)` | `updateDoc({ activo: !currentlyActive })` |
| `saveAroma(data, id?)` | `addDoc` (nuevo) o `updateDoc` (editar) en colección `aromas` |

### `colores.service.ts`
| Función | Descripción |
|---------|-------------|
| `checkColorDependencies(id)` | Retorna `{ activeProducts[] }` con `colorId == id` |
| `deleteColor(id)` | Soft delete: `updateDoc({ activo: false })` |
| `toggleColorActive(id, currentlyActive)` | `updateDoc({ activo: !currentlyActive })` |
| `saveColor(data, id?)` | `addDoc` (nuevo) o `updateDoc` (editar) en colección `colores` |

### `ordenes.service.ts`
| Función | Descripción |
|---------|-------------|
| `crearOrden(form, items, total)` | Transacción: lee e incrementa `ultimoNumeroPedido` en `settings/general` → genera `PED-000001`, `PED-000002`… → `addDoc` en `ordenes` |
| `actualizarEstadoOrden(id, estado)` | `updateDoc({ estado })` |

> El número de pedido usa `runTransaction` para garantizar atomicidad (sin duplicados en pedidos simultáneos). El contador `ultimoNumeroPedido` en `settings/general` nunca retrocede aunque se borren órdenes. Para reiniciar/ajustar el contador, editar el campo directamente en Firestore.

### `messages.service.ts`
| Función | Descripción |
|---------|-------------|
| `marcarLeido(id)` | `updateDoc({ read: true })` |

---

## Hooks (`src/hooks/`)

| Hook | Retorna | Descripción |
|------|---------|-------------|
| `useCollection<T>(col, ...constraints)` | `{ data, loading }` | Genérico: `onSnapshot` + unsubscribe + `onError` handler. Ordenar client-side con `useMemo` (evita índices compuestos). |
| `useSettings()` | `{ settings, loading }` | `onSnapshot` de `settings/general`. Usado en Menu y ContactPage. |
| `useCarousel({ count, autoIntervalMs?, pauseAfterMs? })` | `{ idx, fading, goTo }` | Auto-rotate, pausa manual, clamp. Usado por HeroCarousel y ProductCarousel. |
| `useFilePickerReset()` | `resetTimer()` | Despacha click sintético para resetear timer de inactividad tras file picker. |
| `useAromas()` | `{ data: Aroma[], loading }` | Todos los aromas (activos e inactivos). Para panel admin. |
| `useColores()` | `{ data: Color[], loading }` | Todos los colores (activos e inactivos). Para panel admin. |
| `useAtributosProducto()` | `{ aromas, colores, loading }` | Solo activos (`where('activo','==',true)`). Para `ProductoAtributosSelector` en página pública. |
| `useCart()` | `{ items, totalItems, totalPrecio, agregarItem, quitarItem, actualizarCantidad, vaciarCarrito, estaEnCarrito }` | Estado del carrito con persistencia en `localStorage` (`vsm_carrito`). Usado por `CartProvider`. |
| `useCheckout()` | `{ form, errors, loading, setField, setDepartamento, handleSubmit }` | Estado y lógica del formulario de checkout. Valida, crea la orden y navega a `/orden-confirmada`. |
| `useCheckoutValidacion` | función pura | `validateCheckout(form): Record<string,string>`. Sin hooks — pura validación de campos. |
| `useColombia()` | funciones puras | `getDepartamentos()`, `getMunicipios(cod)`, `getDepartamentoNombre(cod)`, `getMunicipioNombre(cod)`. Lee `src/data/colombia.json`. |
| `useOrdenes()` | `{ ordenes, loading, selected, setSelected }` | `useCollection<Orden>('ordenes')`, ordena por `creadoEn.seconds` desc client-side. |

---

## Types

### `src/types/admin.ts`
Interfaces: `Product`, `Category`, `Subcategory`, `Aroma`, `Color`, `SocialLinks`, `StoreSettings`, `ProductFormData`, `AromaFormData`, `ColorFormData`, `CategoryFormData`, `SubcategoryFormData`, `SettingsFormData`, `Message`

> `Product` ya NO tiene campos de aroma/color. `Message` incluye `phone?: string` (opcional, del formulario de contacto).

Tipos union: `AdminSection = 'dashboard' | 'productos' | 'ordenes' | 'configuracion' | 'mensajes'`
`ProductsTab = 'productos' | 'categorias' | 'atributos'`

### `src/types/cart.types.ts`
- `CartItem` — `{ productoId, nombre, precio, imagen, cantidad, stock, aroma?, color?, colorHex? }`
- `CheckoutState` — estado plano del formulario de checkout (comprador + envío directo + campos tercero)

### `src/types/orden.types.ts`
- `EstadoOrden = 'pendiente' | 'enviado' | 'entregado' | 'cancelado'`
- `Orden`, `OrdenComprador`, `OrdenEnvio`, `OrdenItem`

### `src/types/ubicacion.types.ts`
- `Municipio`, `Departamento`, `Pais` — estructura del JSON geográfico

### `src/data/colombia.json`
- Todos los 33 departamentos con código ISO 3166-2 (`CO-MAG`…) + código DANE + municipios completos
- Estructura: `{ pais: { codigo, nombre, departamentos: [{ codigo, codigoDane, nombre, municipios: [{ codigo, nombre }] }] } }`

### `src/context/CartContext.tsx`
`CartProvider` envuelve `<HashRouter>` completo (Menu + Layout + Footer) para que el carrito sea accesible en toda la app, incluido el badge del menú.
`useCartContext()` lanza error si se usa fuera del provider.

### Cart — `src/component/cart/`
| Componente | Responsabilidad |
|------------|----------------|
| `CartPage.tsx` | Orquestador: renderiza `CartVacio` o `CartItemList` + `CartResumen` |
| `CartItemList.tsx` | Lista de ítems — mapea a `CartItemRow` |
| `CartItemRow.tsx` | Fila: imagen 72px + nombre/aroma/color + controles cantidad + eliminar |
| `CartResumen.tsx` | Panel sticky: subtotal, "Contra entrega", total, botones |
| `CartVacio.tsx` | Estado vacío con botón "Ver productos" |

### Checkout — `src/component/checkout/`
| Componente | Responsabilidad |
|------------|----------------|
| `CheckoutPage.tsx` | Orquestador 2 columnas. Redirige a `/carrito` si el carrito está vacío |
| `CheckoutDatosComprador.tsx` | Campos: nombre, email, teléfono |
| `CheckoutDatosEnvio.tsx` | Banner envío, checkbox tercero, selects departamento/municipio, dirección, barrio, indicaciones. Renderiza `CheckoutEnvioTercero` si aplica |
| `CheckoutEnvioTercero.tsx` | Campos de envío para el destinatario tercero |
| `CheckoutResumenOrden.tsx` | Lista readonly de ítems con imágenes, atributos y total |
| `CheckoutBotonConfirmar.tsx` | Botón con spinner durante `loading` |

### Orden confirmada — `src/component/orden-confirmada/OrdenConfirmadaPage.tsx`
- Lee `location.state.{ numeroOrden, telefono }`. Redirige a `/` si no hay `numeroOrden`.
- Muestra ✅, badge con número de pedido, mensaje de contacto con teléfono de la tienda.

---

## Estilos compartidos (`src/styles/formStyles.ts`)

| Export | Uso |
|--------|-----|
| `inputStyle` | Aplicar a `<input>`, `<textarea>`, `<select>` |
| `labelStyle` | Labels de formulario |
| `errorBox` / `errorText` | Caja de error roja |
| `successBox` / `successText` | Caja de éxito verde |
| `primaryBtn` | Botón principal brand, ancho completo |
| `onFocusBrand` / `onBlurGray` | Handlers `onFocus`/`onBlur` para bordes |

---

## Pendiente (próximas sesiones)
- `browserSessionPersistence` para el panel admin
- Regla Firestore para `ordenes` debe añadirse manualmente en Firebase Console (ver sección Reglas)

## Archivos que NO se modifican
`authContext.tsx`, `ProtecterRouter.tsx`, `Footer.tsx`, `Login.tsx`

## Deployment

- Vite base: `/tiendaVirtual/` (GitHub Pages)
- `HashRouter` en vez de `BrowserRouter` para evitar errores 404 en GitHub Pages
- `npm run deploy` hace build y publica la carpeta `dist/` en la rama `gh-pages`

## Commits
- Nunca incluir Co-Authored-By en los mensajes de commit
- El autor siempre soy yo
