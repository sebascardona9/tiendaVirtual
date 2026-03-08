import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDoc, getDocs, doc, collection } from 'firebase/firestore'
import { db } from '../../../firebase/firebase.config'
import type { Product, Category } from '../../../types/admin'
import SkeletonDetail   from './components/SkeletonDetail'
import NotFoundProduct  from './components/NotFoundProduct'
import ProductGallery   from './components/ProductGallery'
import ProductInfo      from './components/ProductInfo'

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

    Promise.all([
      getDoc(doc(db, 'products', id)),
      getDocs(collection(db, 'categories')),
    ])
      .then(([productSnap, categoriesSnap]) => {
        if (!productSnap.exists()) { setNotFound(true); return }
        setProduct({ id: productSnap.id, ...productSnap.data() } as Product)
        setCategories(categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category)))
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
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
