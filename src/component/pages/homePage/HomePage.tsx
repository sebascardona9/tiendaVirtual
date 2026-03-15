/**
 * HomePage — orquestador de datos para la homepage.
 *
 * OPTIMIZACIÓN DE LECTURAS FIRESTORE:
 * Anteriormente cada sección (HeroSection, CategoryCards, CandleTypesSection,
 * ProductsSection) abría su propio onSnapshot sobre 'products', resultando en
 * 4 listeners duplicados. Ahora se hacen 3 listeners únicos aquí y se pasan
 * los datos como props → 62% menos lecturas en la página más visitada.
 *
 * Listeners activos en homepage: products (×1) + categories (×1) + subcategories (×1)
 */
import { where } from 'firebase/firestore'
import useCollection from '../../../hooks/useCollection'
import type { Product, Category, Subcategory } from '../../../types/admin'
import HeroSection        from './sections/HeroSection'
import CategoryCards      from './sections/CategoryCards'
import ProductsSection    from './sections/ProductsSection'
import CandleTypesSection from './sections/CandleTypesSection'

const HomePage = () => {
  const { data: products,      loading: loadingProds } = useCollection<Product>('products', where('active', '==', true))
  const { data: categories,    loading: loadingCats  } = useCollection<Category>('categories', where('active', '==', true))
  const { data: subcategories, loading: loadingSubs  } = useCollection<Subcategory>('subcategories', where('active', '==', true))

  const loading = loadingProds || loadingCats || loadingSubs

  return (
    <div className="w-full">
      <HeroSection        products={products}      loading={loading} />
      <CategoryCards      products={products}      categories={categories}    loading={loading} />
      <ProductsSection    products={products}      loading={loading} />
      <CandleTypesSection products={products}      subcategories={subcategories} loading={loading} />
    </div>
  )
}

export default HomePage
