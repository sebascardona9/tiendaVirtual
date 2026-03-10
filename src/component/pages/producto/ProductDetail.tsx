import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { onSnapshot, getDocs, doc, collection } from 'firebase/firestore'
import { db } from '../../../firebase/firebase.config'
import type { Product, Category } from '../../../types/admin'
import SkeletonDetail  from './components/SkeletonDetail'
import NotFoundProduct from './components/NotFoundProduct'
import ProductGallery  from './components/ProductGallery'
import ProductInfo     from './components/ProductInfo'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()

  const [product,    setProduct]    = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading,    setLoading]    = useState(true)
  const [notFound,   setNotFound]   = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setNotFound(false)
    setProduct(null)

    // Suscripción en tiempo real al producto — garantiza datos frescos en todos los navegadores
    const unsub = onSnapshot(
      doc(db, 'products', id),
      (snap) => {
        if (!snap.exists()) {
          setNotFound(true)
          setLoading(false)
          return
        }
        setProduct({ id: snap.id, ...snap.data() } as Product)
        setLoading(false)
      },
      (err) => {
        console.error('[ProductDetail] Error cargando producto:', err.message)
        setNotFound(true)
        setLoading(false)
      },
    )

    // Categorías: se leen una sola vez (cambian poco, no requieren RT)
    getDocs(collection(db, 'categories'))
      .then(snap => setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category))))
      .catch(err => console.error('[ProductDetail] Error cargando categorías:', err.message))

    return () => unsub()
  }, [id])

  if (loading)              return <SkeletonDetail />
  if (notFound || !product) return <NotFoundProduct />

  const imgs = product.images?.length
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : []

  const categoryName = categories.find(c => c.id === product.categoryId)?.name ?? ''

  return (
    <div className="w-full" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>

      <Link
        to="/catalogo"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
          color: 'var(--vsm-gray-mid)', textDecoration: 'none',
          fontSize: '13px', fontWeight: 500, marginBottom: '2rem',
        }}
      >
        &larr; Volver al catalogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12">
        <ProductGallery imgs={imgs} name={product.name} />
        <ProductInfo    product={product} categoryName={categoryName} />
      </div>

    </div>
  )
}

export default ProductDetail
