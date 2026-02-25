interface ToggleSwitchProps {
  active: boolean
  onChange: () => void
  disabled?: boolean
}

/**
 * Pill toggle de 36×20 px.
 * Activo → fondo brand; Inactivo → fondo gris.
 */
const ToggleSwitch = ({ active, onChange, disabled }: ToggleSwitchProps) => (
  <button
    type="button"
    onClick={onChange}
    disabled={disabled}
    aria-label={active ? 'Desactivar' : 'Activar'}
    style={{
      width: 36, height: 20,
      borderRadius: 10,
      border: 'none',
      backgroundColor: active ? 'var(--vsm-brand)' : 'var(--vsm-gray)',
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      flexShrink: 0,
      transition: 'background-color 0.2s',
      opacity: disabled ? 0.6 : 1,
      padding: 0,
    }}
  >
    <span style={{
      position: 'absolute',
      top: 2,
      left: active ? 18 : 2,
      width: 16, height: 16,
      borderRadius: '50%',
      backgroundColor: '#fff',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
    }} />
  </button>
)

export default ToggleSwitch
