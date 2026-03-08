import type { Product } from '../../../../../types/admin'
import ToggleSwitch from '../../../../../ui/shared/ToggleSwitch'
import { formatCOP } from '../../../../../utils/formatters'

interface Props {
  products:      Product[]
  page:          number
  totalPages:    number
  categoryMap:   Map<string, string>
  subcategoryMap: Map<string, string>
  toggleLoading: string | null
  onEdit:        (p: Product) => void
  onDelete:      (p: Product) => void
  onToggle:      (p: Product) => void
  onPageChange:  (page: number) => void
}

const HEADERS = ['Imagen', 'Nombre', 'Categoría', 'Subcategoría', 'Precio', 'Stock', 'Activo', 'Acciones']

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

const ProductTable = ({
  products, page, totalPages,
  categoryMap, subcategoryMap,
  toggleLoading, onEdit, onDelete, onToggle, onPageChange,
}: Props) => {
  const getCategoryName    = (id: string)        => categoryMap.get(id)    ?? '—'
  const getSubcategoryName = (id?: string | null) => id ? (subcategoryMap.get(id) ?? '—') : '—'

  if (products.length === 0)
    return <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px' }}>No hay productos aún. Crea el primero.</p>

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--vsm-gray)' }}>
              {HEADERS.map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 700, color: 'var(--vsm-gray-mid)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
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
                  <td style={{ padding: '8px 10px', color: 'var(--vsm-black)' }}>{formatCOP(p.price)}</td>
                  <td style={{ padding: '8px 10px', fontWeight: p.stock === 0 ? 700 : 400, color: p.stock === 0 ? 'var(--vsm-error)' : 'var(--vsm-black)' }}>
                    {p.stock}
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <ToggleSwitch
                      active={isActive}
                      onChange={() => onToggle(p)}
                      disabled={toggleLoading === p.id}
                    />
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button onClick={() => onEdit(p)}   style={actionBtn('var(--vsm-gray)', 'var(--vsm-black)')}>Editar</button>
                      <button onClick={() => onDelete(p)} style={actionBtn('var(--vsm-error-bg)', 'var(--vsm-error)')}>Desactivar</button>
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
          <button onClick={() => onPageChange(Math.max(1, page - 1))}              disabled={page === 1}          style={pageBtn(page === 1)}>‹ Ant</button>
          <span style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>Pág {page} / {totalPages}</span>
          <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}>Sig ›</button>
        </div>
      )}
    </>
  )
}

export default ProductTable
