import React, { useState, useEffect, useMemo } from 'react'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../../../firebase/firebase.config'
import type { Product, Category, Subcategory, ProductsTab } from '../../../../types/admin'
import useCollection  from '../../../../hooks/useCollection'
import ProductForm    from './ProductForm'
import CategoryList   from './CategoryList'
import ConfirmDialog  from '../shared/ConfirmDialog'
import ProductTable   from './table/ProductTable'
import AtributosTab   from '../settings/atributos/AtributosTab'

const ITEMS_PER_PAGE = 10

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: '7px 18px', border: 'none',
  borderBottom: active ? '2px solid var(--vsm-brand)' : '2px solid transparent',
  backgroundColor: 'transparent',
  color:      active ? 'var(--vsm-brand)' : 'var(--vsm-gray-mid)',
  fontWeight: active ? 700 : 600,
  fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
})

const ProductList = () => {
  const { data: products }      = useCollection<Product>('products')
  const { data: categories }    = useCollection<Category>('categories')
  const { data: subcategories } = useCollection<Subcategory>('subcategories')

  const [activeTab,     setActiveTab]     = useState<ProductsTab>('productos')
  const [page,          setPage]          = useState(1)
  const [showForm,      setShowForm]      = useState(false)
  const [editProduct,   setEditProduct]   = useState<Product | undefined>()
  const [deleteTarget,  setDeleteTarget]  = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  useEffect(() => { setPage(1) }, [products])

  const categoryMap    = useMemo(() => new Map(categories.map(c  => [c.id,  c.name])),  [categories])
  const subcategoryMap = useMemo(() => new Map(subcategories.map(s => [s.id, s.name])), [subcategories])

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
  const paginated  = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await updateDoc(doc(db, 'products', deleteTarget.id), { active: false })
      setDeleteTarget(null)
    } catch { /* silent */ } finally {
      setDeleteLoading(false)
    }
  }

  const handleToggleActive = async (p: Product) => {
    setToggleLoading(p.id)
    try {
      await updateDoc(doc(db, 'products', p.id), { active: !(p.active !== false) })
    } catch { /* silent */ } finally {
      setToggleLoading(null)
    }
  }

  const openCreate = () => { setEditProduct(undefined); setShowForm(true) }
  const openEdit   = (p: Product) => { setEditProduct(p); setShowForm(true) }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)' }}>Productos</h2>
        {activeTab === 'productos' && (
          <button
            onClick={openCreate}
            style={{ backgroundColor: 'var(--vsm-brand)', color: '#fff', border: 'none', borderRadius: '5px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            + Nuevo Producto
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--vsm-gray)', marginBottom: '1.25rem', display: 'flex' }}>
        <button style={tabBtnStyle(activeTab === 'productos')}   onClick={() => setActiveTab('productos')}>Productos</button>
        <button style={tabBtnStyle(activeTab === 'categorias')}  onClick={() => setActiveTab('categorias')}>Categorías</button>
        <button style={tabBtnStyle(activeTab === 'atributos')}   onClick={() => setActiveTab('atributos')}>Atributos</button>
      </div>

      {activeTab === 'categorias' ? (
        <CategoryList />
      ) : activeTab === 'atributos' ? (
        <AtributosTab />
      ) : (
        <>
          <ProductTable
            products={paginated}
            page={page}
            totalPages={totalPages}
            categoryMap={categoryMap}
            subcategoryMap={subcategoryMap}
            toggleLoading={toggleLoading}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
            onToggle={handleToggleActive}
            onPageChange={setPage}
          />

          <ProductForm
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            product={editProduct}
            categories={categories}
            subcategories={subcategories}
          />

          <ConfirmDialog
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            title="Desactivar producto"
            message={`"${deleteTarget?.name}" dejará de aparecer en el catálogo. Puedes reactivarlo desde la columna Activo.`}
            loading={deleteLoading}
          />
        </>
      )}
    </div>
  )
}

export default ProductList
