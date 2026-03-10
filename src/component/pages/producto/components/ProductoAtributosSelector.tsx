import { useState, useEffect, useRef } from 'react'
import type { Aroma, Color } from '../../../../types/admin'
import { useAtributosProducto } from '../../../../hooks/useAtributosProducto'
import ProductoAromaSelector from './ProductoAromaSelector'
import ProductoColorSwatch   from './ProductoColorSwatch'

interface Props {
  /** Indica si se debe mostrar el error de campos sin seleccionar */
  showError:     boolean
  /** Se llama cada vez que cambia la validez de la selección */
  onValidChange: (valid: boolean) => void
}

/**
 * Orquestador de selectores de aroma y color.
 * Carga aromas y colores activos desde Firestore.
 * Retorna null si no hay ningún atributo activo en la tienda.
 * Comunica al padre si la selección es válida para continuar.
 */
const ProductoAtributosSelector = ({ showError, onValidChange }: Props) => {
  const { aromas, colores, loading } = useAtributosProducto()

  const [selectedAroma, setSelectedAroma] = useState<Aroma | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)

  // Ref para evitar recrear el efecto si el padre re-renderiza con nueva función
  const callbackRef = useRef(onValidChange)
  useEffect(() => { callbackRef.current = onValidChange })

  const hasAromas = !loading && aromas.length > 0
  const hasColors = !loading && colores.length > 0

  useEffect(() => {
    if (loading) return
    const valid =
      (!hasAromas || selectedAroma !== null) &&
      (!hasColors || selectedColor !== null)
    callbackRef.current(valid)
  }, [loading, hasAromas, hasColors, selectedAroma, selectedColor])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ height: '14px', width: '80px', backgroundColor: 'var(--vsm-gray)', borderRadius: '4px', opacity: 0.5 }} />
        <div style={{ height: '38px', backgroundColor: 'var(--vsm-gray)', borderRadius: 'var(--vsm-radius)', opacity: 0.35 }} />
      </div>
    )
  }

  if (!hasAromas && !hasColors) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
      {hasAromas && (
        <ProductoAromaSelector
          aromas={aromas}
          selected={selectedAroma}
          onSelect={setSelectedAroma}
          showError={showError}
        />
      )}
      {hasColors && (
        <ProductoColorSwatch
          colores={colores}
          selected={selectedColor}
          onSelect={setSelectedColor}
          showError={showError}
        />
      )}
    </div>
  )
}

export default ProductoAtributosSelector
