import { useState, useCallback } from 'react'
import type { Product } from '../../../../types/admin'
import { formatCOP } from '../../../../utils/formatters'
import ProductoAtributosSelector from './ProductoAtributosSelector'

interface Props {
  product:      Product
  categoryName: string
}

const ProductInfo = ({ product, categoryName }: Props) => {
  const [quantity, setQuantity]             = useState(1)
  const [atributosOk, setAtributosOk]       = useState(true)
  const [showAtributosError, setShowAtributosError] = useState(false)

  const outOfStock = product.stock === 0

  const handleValidChange = useCallback((valid: boolean) => {
    setAtributosOk(valid)
    if (valid) setShowAtributosError(false)
  }, [])

  const handleAddToCart = () => {
    if (!atributosOk) {
      setShowAtributosError(true)
      return
    }
    // TODO: conectar con el carrito en fase futura
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Nombre */}
      <h1 style={{ fontSize: 'var(--vsm-font-heading-xl)', fontWeight: 800, color: 'var(--vsm-black)', lineHeight: 1.2, margin: 0 }}>
        {product.name}
      </h1>

      {/* Precio */}
      <p style={{ fontSize: 'var(--vsm-font-price)', fontWeight: 800, color: 'var(--vsm-brand)', margin: 0 }}>
        {formatCOP(product.price)}
      </p>

      {/* Category badge */}
      {categoryName && (
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          backgroundColor: 'var(--vsm-gray)', color: 'var(--vsm-gray-mid)',
          padding: '0.3rem 0.9rem', borderRadius: '20px',
          fontSize: '11px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          {categoryName}
        </span>
      )}

      {/* Descripción */}
      <p style={{ fontSize: '14px', color: 'var(--vsm-gray-mid)', lineHeight: 1.8, margin: 0 }}>
        {product.description}
      </p>

      {/* Selectores de aroma y color */}
      <ProductoAtributosSelector
        showError={showAtributosError}
        onValidChange={handleValidChange}
      />

      {/* Stock status */}
      <p style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: outOfStock ? '#DC2626' : 'var(--vsm-success)' }}>
        {outOfStock ? 'Sin stock' : `${product.stock} disponibles`}
      </p>

      {/* Quantity selector */}
      {!outOfStock && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', fontWeight: 500 }}>Cantidad:</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--vsm-gray)', borderRadius: 'var(--vsm-radius)', overflow: 'hidden' }}>
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ width: '40px', height: '40px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'var(--vsm-black)' }}
            >
              &minus;
            </button>
            <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              style={{ width: '40px', height: '40px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'var(--vsm-black)' }}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Agregar al carrito */}
      <button
        disabled={outOfStock}
        onClick={handleAddToCart}
        style={{
          padding: '14px 24px',
          backgroundColor: outOfStock ? 'var(--vsm-gray)' : 'var(--vsm-brand)',
          color: outOfStock ? 'var(--vsm-gray-mid)' : '#fff',
          border: 'none', borderRadius: 'var(--vsm-radius)',
          fontSize: '14px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.07em',
          cursor: outOfStock ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s ease', fontFamily: 'inherit',
        }}
      >
        {outOfStock ? 'Agotado' : 'Agregar al carrito'}
      </button>

      {/* Envío */}
      <p style={{ textAlign: 'center', color: 'var(--vsm-gray-mid)', fontSize: '12px', margin: 0 }}>
        Envio disponible a todo el pais
      </p>

    </div>
  )
}

export default ProductInfo
