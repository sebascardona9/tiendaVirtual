import { useMemo } from 'react'
import type { Category, Subcategory, ProductFormData } from '../../../../../types/admin'
import { inputStyle, labelStyle, onFocusBrand, onBlurGray } from '../../../../../styles/formStyles'

interface Props {
  formData:         ProductFormData
  categories:       Category[]
  subcategories:    Subcategory[]
  onChange:         (field: keyof ProductFormData, value: string | number | boolean) => void
  onCategoryChange: (catId: string) => void
}

const ProductFields = ({ formData, categories, subcategories, onChange, onCategoryChange }: Props) => {
  const filteredSubs = useMemo(
    () => subcategories.filter(s => s.categoryId === formData.categoryId && s.active),
    [subcategories, formData.categoryId],
  )

  return (
    <>
      {/* Nombre */}
      <div>
        <label style={labelStyle}>Nombre <span style={{ color: 'var(--vsm-error)' }}>*</span></label>
        <input value={formData.name} onChange={e => onChange('name', e.target.value)}
          style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray} />
      </div>

      {/* Descripción */}
      <div>
        <label style={labelStyle}>Descripción</label>
        <textarea
          value={formData.description}
          onChange={e => onChange('description', e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
          onFocus={onFocusBrand} onBlur={onBlurGray}
        />
      </div>

      {/* Precio + Stock */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
        <div>
          <label style={labelStyle}>Precio (COP)</label>
          <input
            type="number" min="0" value={formData.price} placeholder="0"
            onChange={e => onChange('price', e.target.value === '' ? '' : Number(e.target.value))}
            style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray}
          />
        </div>
        <div>
          <label style={labelStyle}>Stock</label>
          <input
            type="number" min="0" value={formData.stock} placeholder="0"
            onChange={e => onChange('stock', e.target.value === '' ? '' : Number(e.target.value))}
            style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray}
          />
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label style={labelStyle}>Categoría</label>
        <select
          value={formData.categoryId}
          onChange={e => onCategoryChange(e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={onFocusBrand} onBlur={onBlurGray}
        >
          <option value="">Sin categoría</option>
          {categories.filter(c => c.active).map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Subcategoría (condicional) */}
      {filteredSubs.length > 0 && (
        <div>
          <label style={labelStyle}>Subcategoría</label>
          <select
            value={formData.subcategoryId}
            onChange={e => onChange('subcategoryId', e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={onFocusBrand} onBlur={onBlurGray}
          >
            <option value="">Sin subcategoría</option>
            {filteredSubs.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Activo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <input
          id="product-active"
          type="checkbox"
          checked={formData.active}
          onChange={e => onChange('active', e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--vsm-brand)' }}
        />
        <label htmlFor="product-active" style={{ ...labelStyle, margin: 0, cursor: 'pointer', fontWeight: 600 }}>
          Producto activo (visible en el catálogo)
        </label>
      </div>
    </>
  )
}

export default ProductFields
