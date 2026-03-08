import type { Aroma } from '../../../../../types/admin'
import ToggleSwitch from '../../../../../ui/shared/ToggleSwitch'

interface Props {
  aromas:        Aroma[]
  toggleLoading: string | null
  onToggle:      (aroma: Aroma) => void
  onEdit:        (aroma: Aroma) => void
  onDelete:      (aroma: Aroma) => void
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

const AromasList = ({ aromas, toggleLoading, onToggle, onEdit, onDelete }: Props) => {
  if (aromas.length === 0) {
    return (
      <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', padding: '0.75rem 0' }}>
        No hay aromas registrados. Crea el primero.
      </p>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Descripción</th>
            <th style={{ ...thStyle, textAlign: 'center' }}>Activo</th>
            <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {aromas.map(a => (
            <tr key={a.id} style={{ opacity: a.activo ? 1 : 0.55, borderBottom: '1px solid var(--vsm-gray)' }}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{a.nombre}</td>
              <td style={{ ...tdStyle, color: 'var(--vsm-gray-mid)' }}>{a.descripcion || '—'}</td>
              <td style={{ ...tdStyle, textAlign: 'center' }}>
                <ToggleSwitch
                  active={a.activo}
                  onChange={() => onToggle(a)}
                  disabled={toggleLoading === a.id}
                />
              </td>
              <td style={{ ...tdStyle, textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => onEdit(a)} style={actionBtn('var(--vsm-brand)')}>Editar</button>
                  <button onClick={() => onDelete(a)} style={actionBtn('var(--vsm-error)')}>Eliminar</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AromasList
