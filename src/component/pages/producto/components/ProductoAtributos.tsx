import type { Product } from '../../../../types/admin'
import ColorPreview from '../../admin/settings/atributos/ColorPreview'

interface Props {
  product: Product
}

/**
 * Muestra los atributos de aroma y color del producto.
 * Backward compat: usa product.aromaNombre || product.aroma (campo legacy).
 * Retorna null si no hay ningún atributo que mostrar.
 */
const ProductoAtributos = ({ product }: Props) => {
  const aromaName = product.aromaNombre || product.aroma || null
  const colorName = product.colorNombre || null

  if (!aromaName && !colorName) return null

  const blockStyle: React.CSSProperties = {
    padding: '0.875rem 1rem',
    backgroundColor: '#FFF7F0',
    borderLeft: '3px solid var(--vsm-brand)',
    borderRadius: '0 8px 8px 0',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'var(--vsm-brand)',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    fontWeight: 700,
    marginBottom: '0.3rem',
  }
  const valueStyle: React.CSSProperties = {
    color: 'var(--vsm-black)',
    fontSize: '14px',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {aromaName && (
        <div style={blockStyle}>
          <strong style={labelStyle}>🌸 Aroma</strong>
          <span style={valueStyle}>{aromaName}</span>
        </div>
      )}
      {colorName && (
        <div style={blockStyle}>
          <strong style={labelStyle}>🎨 Color</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {product.colorHex && <ColorPreview hex={product.colorHex} size={16} />}
            <span style={valueStyle}>{colorName}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductoAtributos
