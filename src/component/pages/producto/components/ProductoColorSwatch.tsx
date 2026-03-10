import type { Color } from '../../../../types/admin'

interface Props {
  colores:   Color[]
  selected:  Color | null
  onSelect:  (color: Color) => void
  showError: boolean
}

/**
 * Swatches circulares seleccionables de color.
 * Componente hoja — solo renderiza, sin estado ni efectos.
 */
const ProductoColorSwatch = ({ colores, selected, onSelect, showError }: Props) => {
  return (
    <div>
      <p style={{
        fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--vsm-gray-mid)', marginBottom: '0.6rem',
      }}>
        Elige tu color
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {colores.map(color => {
          const isSelected = selected?.id === color.id
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelect(color)}
              title={color.nombre}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: '0.3rem', cursor: 'pointer', background: 'none',
                border: 'none', padding: '2px', fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: color.codigoHex ?? '#ccc',
                outline: `2px solid ${isSelected ? 'var(--vsm-brand)' : 'var(--vsm-gray)'}`,
                outlineOffset: '2px',
                boxShadow: isSelected ? '0 0 0 4px rgba(200,115,42,0.15)' : 'none',
                transition: 'outline 0.15s ease, box-shadow 0.15s ease',
              }} />
              <span style={{
                fontSize: '11px', maxWidth: '52px', textAlign: 'center',
                lineHeight: 1.2, wordBreak: 'break-word',
                color: isSelected ? 'var(--vsm-brand)' : 'var(--vsm-gray-mid)',
                fontWeight: isSelected ? 600 : 400,
              }}>
                {color.nombre}
              </span>
            </button>
          )
        })}
      </div>

      {showError && !selected && (
        <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '0.45rem', fontWeight: 500 }}>
          Por favor elige un color antes de continuar.
        </p>
      )}
    </div>
  )
}

export default ProductoColorSwatch
