import { useState, useCallback } from 'react'
import type { Product } from '../../../../types/admin'
import { formatCOP } from '../../../../utils/formatters'
import { useCartContext } from '../../../../context/CartContext'
import ProductoAtributosSelector from './ProductoAtributosSelector'
import type { AtributosSeleccion } from './ProductoAtributosSelector'

interface Props {
  product:      Product
  categoryName: string
}

const ProductInfo = ({ product, categoryName }: Props) => {
  const { agregarItem }   = useCartContext()
  const [quantity, setQuantity] = useState(1)
  const [atributosOk,   setAtributosOk]   = useState(true)
  const [showAtributosError, setShowAtributosError] = useState(false)
  const [seleccion, setSeleccion] = useState<AtributosSeleccion>({ aroma: null, color: null, colorHex: null })
  const [addedFeedback, setAddedFeedback] = useState(false)

  const outOfStock = product.stock === 0

  const handleValidChange = useCallback((valid: boolean) => {
    setAtributosOk(valid)
    if (valid) setShowAtributosError(false)
  }, [])

  const handleSelectionChange = useCallback((sel: AtributosSeleccion) => {
    setSeleccion(sel)
  }, [])

  const handleAddToCart = () => {
    if (!atributosOk) { setShowAtributosError(true); return }
    const imagen = product.images?.[0] ?? product.imageUrl ?? ''
    agregarItem({
      productoId: product.id,
      nombre:     product.name,
      precio:     product.price,
      imagen,
      cantidad:   quantity,
      stock:      product.stock,
      aroma:      seleccion.aroma,
      color:      seleccion.color,
      colorHex:   seleccion.colorHex,
    })
    setAddedFeedback(true)
    setTimeout(() => setAddedFeedback(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      <h1 style={{ fontSize: 'var(--vsm-font-heading-xl)', fontWeight: 800, color: 'var(--vsm-black)', lineHeight: 1.2, margin: 0 }}>
        {product.name}
      </h1>

      <p style={{ fontSize: 'var(--vsm-font-price)', fontWeight: 800, color: 'var(--vsm-brand)', margin: 0 }}>
        {formatCOP(product.price)}
      </p>

      {categoryName && (
        <span style={{ display: 'inline-block', alignSelf: 'flex-start', backgroundColor: 'var(--vsm-gray)', color: 'var(--vsm-gray-mid)', padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {categoryName}
        </span>
      )}

      <p style={{ fontSize: '14px', color: 'var(--vsm-gray-mid)', lineHeight: 1.8, margin: 0 }}>
        {product.description}
      </p>

      <ProductoAtributosSelector
        showError={showAtributosError}
        onValidChange={handleValidChange}
        onSelectionChange={handleSelectionChange}
      />

      <p style={{ fontSize: '13px', fontWeight: 600, margin: 0, color: outOfStock ? '#DC2626' : 'var(--vsm-success)' }}>
        {outOfStock ? 'Sin stock' : `${product.stock} disponibles`}
      </p>

      {!outOfStock && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px', fontWeight: 500 }}>Cantidad:</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--vsm-gray)', borderRadius: 'var(--vsm-radius)', overflow: 'hidden' }}>
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ width: '40px', height: '40px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'var(--vsm-black)' }}>
              &minus;
            </button>
            <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 700 }}>{quantity}</span>
            <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              style={{ width: '40px', height: '40px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 600, color: 'var(--vsm-black)' }}>
              +
            </button>
          </div>
        </div>
      )}

      <button
        disabled={outOfStock}
        onClick={handleAddToCart}
        style={{
          padding: '14px 24px',
          backgroundColor: outOfStock ? 'var(--vsm-gray)' : addedFeedback ? '#166534' : 'var(--vsm-brand)',
          color: outOfStock ? 'var(--vsm-gray-mid)' : '#fff',
          border: 'none', borderRadius: 'var(--vsm-radius)',
          fontSize: '14px', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.07em',
          cursor: outOfStock ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s ease', fontFamily: 'inherit',
        }}
      >
        {outOfStock ? 'Agotado' : addedFeedback ? '¡Agregado! ✓' : 'Agregar al carrito'}
      </button>

      <p style={{ textAlign: 'center', color: 'var(--vsm-gray-mid)', fontSize: '12px', margin: 0 }}>
        Envío disponible a todo el país
      </p>
    </div>
  )
}

export default ProductInfo
