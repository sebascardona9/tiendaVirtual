import { useState, useEffect, useMemo } from 'react'
import { updateDoc, doc } from 'firebase/firestore'
import { db } from '../../../../firebase/firebase.config'
import type { Product, Category, Subcategory, ProductsTab } from '../../../../types/admin'
import useCollection from '../../../../hooks/useCollection'
import ProductForm from './ProductForm'
import CategoryList from './CategoryList'
import ConfirmDialog from '../shared/ConfirmDialog'
import ToggleSwitch from '../../../../ui/shared/ToggleSwitch'
import { formatCOP } from '../../../../utils/formatters'

const ITEMS_PER_PAGE = 10

const ProductList = () => {
  const { data: products }      = useCollection<Product>('products')
  const { data: categories }    = useCollection<Category>('categories')
  const { data: subcategories } = useCollection<Subcategory>('subcategories')

  const [activeTab, setActiveTab]     = useState<ProductsTab>('productos')
  const [page, setPage]               = useState(1)
  useEffect(() => { setPage(1) }, [products])
  const [showForm, setShowForm]       = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toggleLoading, setToggleLoading] = useState<string | null>(null)

  const categoryMap = useMemo(
    () => new Map(categories.map(c => [c.id, c.name])),
    [categories],
  )

  const subcategoryMap = useMemo(
    () => new Map(subcategories.map(s => [s.id, s.name])),
    [subcategories],
  )

  const getCategoryName    = (id: string) => categoryMap.get(id) ?? '—'
  const getSubcategoryName = (id?: string) => id ? (subcategoryMap.get(id) ?? '—') : '—'

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE))
  const paginated  = products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Soft delete — sets active: false instead of deleting the document
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

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '7px 18px',
    border: 'none',
    borderBottom: active ? `2px solid var(--vsm-brand)` : '2px solid transparent',
    backgroundColor: 'transparent',
    color: active ? 'var(--vsm-brand)' : 'var(--vsm-gray-mid)',
    fontWeight: active ? 700 : 600,
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)' }}>Productos</h2>
        {activeTab === 'productos' && (
          <button
            onClick={openCreate}
            style={{
              backgroundColor: 'var(--vsm-brand)', color: '#fff', border: 'none',
              borderRadius: '5px', padding: '8px 18px', fontSize: '13px',
              fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            + Nuevo Producto
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--vsm-gray)', marginBottom: '1.25rem', display: 'flex' }}>
        <button style={tabBtnStyle(activeTab === 'productos')}   onClick={() => setActiveTab('productos')}>Productos</button>
        <button style={tabBtnStyle(activeTab === 'categorias')} onClick={() => setActiveTab('categorias')}>Categorías</button>
      </div>

      {activeTab === 'categorias' ? (
        <CategoryList />
      ) : (
        <>
          {products.length === 0 ? (
            <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px' }}>No hay productos aún. Crea el primero.</p>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--vsm-gray)' }}>
                      {['Imagen','Nombre','Categoría','Subcategoría','Precio','Stock','Activo','Acciones'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700, color: 'var(--vsm-gray-mid)', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(p => {
                      const isActive = p.active !== false
                      return (
                        <tr key={p.id} style={{ borderBottom: '1px solid var(--vsm-gray)', opacity: isActive ? 1 : 0.55 }}>
                          <td style={{ padding: '8px 10px' }}>
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name}
                                style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--vsm-gray)' }} />
                            ) : (
                              <span style={{ fontSize: '1.5rem' }}>🕯️</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--vsm-black)' }}>{p.name}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--vsm-gray-mid)' }}>{getCategoryName(p.categoryId)}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--vsm-gray-mid)' }}>{getSubcategoryName(p.subcategoryId)}</td>
                          <td style={{ padding: '8px 10px', color: 'var(--vsm-black)' }}>
                            {formatCOP(p.price)}
                          </td>
                          <td style={{ padding: '8px 10px', fontWeight: p.stock === 0 ? 700 : 400, color: p.stock === 0 ? 'var(--vsm-error)' : 'var(--vsm-black)' }}>
                            {p.stock}
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <ToggleSwitch
                              active={isActive}
                              onChange={() => handleToggleActive(p)}
                              disabled={toggleLoading === p.id}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button onClick={() => openEdit(p)} style={actionBtn('var(--vsm-gray)', 'var(--vsm-black)')}>Editar</button>
                              <button onClick={() => setDeleteTarget(p)} style={actionBtn('var(--vsm-error-bg)', 'var(--vsm-error)')}>Desactivar</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem', alignItems: 'center' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page === 1)}>‹ Ant</button>
                  <span style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>Pág {page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}>Sig ›</button>
                </div>
              )}
            </>
          )}

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

const actionBtn = (bg: string, color: string): React.CSSProperties => ({
  padding: '4px 10px', borderRadius: '4px', border: 'none',
  backgroundColor: bg, color, fontSize: '12px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
})

const pageBtn = (disabled: boolean): React.CSSProperties => ({
  padding: '5px 12px', borderRadius: '4px',
  border: '1px solid var(--vsm-gray)',
  backgroundColor: disabled ? 'var(--vsm-gray)' : 'var(--vsm-white)',
  color: disabled ? 'var(--vsm-gray-mid)' : 'var(--vsm-black)',
  fontSize: '12px', fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer',
  fontFamily: 'inherit',
})

export default ProductList
