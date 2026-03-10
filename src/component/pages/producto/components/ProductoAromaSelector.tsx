import type { Aroma } from '../../../../types/admin'

interface Props {
  aromas:    Aroma[]
  selected:  Aroma | null
  onSelect:  (aroma: Aroma) => void
  showError: boolean
}

/**
 * Chips seleccionables de aroma.
 * Componente hoja — solo renderiza, sin estado ni efectos.
 */
const ProductoAromaSelector = ({ aromas, selected, onSelect, showError }: Props) => {
  return (
    <div>
      <p style={{
        fontSize: '12px', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.07em', color: 'var(--vsm-gray-mid)', marginBottom: '0.6rem',
      }}>
        Elige tu aroma
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {aromas.map(aroma => {
          const isSelected = selected?.id === aroma.id
          return (
            <button
              key={aroma.id}
              type="button"
              onClick={() => onSelect(aroma)}
              style={{
                padding: '0.45rem 1.1rem',
                borderRadius: '999px',
                border: `2px solid ${isSelected ? 'var(--vsm-brand)' : 'var(--vsm-gray)'}`,
                backgroundColor: isSelected ? 'var(--vsm-brand)' : 'transparent',
                color: isSelected ? '#fff' : 'var(--vsm-black)',
                fontSize: '13px',
                fontWeight: isSelected ? 600 : 400,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              {aroma.nombre}
            </button>
          )
        })}
      </div>

      {showError && !selected && (
        <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '0.45rem', fontWeight: 500 }}>
          Por favor elige un aroma antes de continuar.
        </p>
      )}
    </div>
  )
}

export default ProductoAromaSelector
