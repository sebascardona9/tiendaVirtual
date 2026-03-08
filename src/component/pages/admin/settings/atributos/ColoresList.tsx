import type { Color } from '../../../../../types/admin'
import ToggleSwitch from '../../../../../ui/shared/ToggleSwitch'
import ColorPreview from './ColorPreview'

interface Props {
  colores:       Color[]
  toggleLoading: string | null
  onToggle:      (color: Color) => void
  onEdit:        (color: Color) => void
  onDelete:      (color: Color) => void
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'var(--vsm-gray-mid)',
  padding: '8px 12px',
  borderBottom: '1px solid var(--vsm-gray)',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '13px',
  color: 'var(--vsm-black)',
  verticalAlign: 'middle',
}

const actionBtn = (color: string): React.CSSProperties => ({
  padding: '5px 12px',
  fontSize: '12px',
  fontWeight: 600,
  border: `1px solid ${color}`,
  borderRadius: 'var(--vsm-radius-sm)',
  backgroundColor: 'transparent',
  color,
  cursor: 'pointer',
  fontFamily: 'inherit',
})

const ColoresList = ({ colores, toggleLoading, onToggle, onEdit, onDelete }: Props) => {
  if (colores.length === 0) {
    return (
      <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', padding: '0.75rem 0' }}>
        No hay colores registrados. Crea el primero.
      </p>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Color</th>
            <th style={thStyle}>Nombre</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Activo</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {colores.map(c => (
            <tr key={c.id} style={{ opacity: c.activo ? 1 : 0.55, borderBottom: '1px solid var(--vsm-gray)' }}>
              <td style={tdStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ColorPreview hex={c.codigoHex} size={22} />
                  <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>
                    {c.codigoHex || '—'}
                  </span>
                </div>
              </td>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{c.nombre}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <ToggleSwitch
                  active={c.activo}
                  onChange={() => onToggle(c)}
                  disabled={toggleLoading === c.id}
                />
              </td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => onEdit(c)} style={actionBtn('var(--vsm-brand)')}>Editar</button>
                  <button onClick={() => onDelete(c)} style={actionBtn('var(--vsm-error)')}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ColoresList
