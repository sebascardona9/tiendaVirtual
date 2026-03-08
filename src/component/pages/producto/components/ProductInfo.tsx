import { useState } from 'react'
import type { Product } from '../../../../types/admin'
import { formatCOP } from '../../../../utils/formatters'
import ProductoAtributos from './ProductoAtributos'

interface Props {
  product:      Product
  categoryName: string
}

const ProductInfo = ({ product, categoryName }: Props) => {
  const [quantity, setQuantity] = useState(1)
  const outOfStock = product.stock === 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

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

      {/* Name */}
      <h1 style={{ fontSize: 'var(--vsm-font-heading-xl)', fontWeight: 800, color: 'var(--vsm-black)', lineHeight: 1.2, margin: 0 }}>
        {product.name}
      </h1>

      {/* Price */}
      <p style={{ fontSize: 'var(--vsm-font-price)', fontWeight: 800, color: 'var(--vsm-brand)', margin: 0 }}>
        {formatCOP(product.price)}
      </p>

      {/* Description */}
      <p style={{ fontSize: '14px', color: 'var(--vsm-gray-mid)', lineHeight: 1.8, margin: 0 }}>
        {product.description}
      </p>

      {/* Atributos: aroma y color */}
      <ProductoAtributos product={product} />

      {/* Stock status */}
      <p style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: outOfStock ? 'var(--vsm-error)' : 'var(--vsm-success)' }}>
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

      {/* Add to cart */}
      <button
        disabled={outOfStock}
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

      {/* Shipping */}
      <p style={{ textAlign: 'center', color: 'var(--vsm-gray-mid)', fontSize: '12px', margin: 0 }}>
        Envio disponible a todo el pais
      </p>
    </div>
  )
}

export default ProductInfo
