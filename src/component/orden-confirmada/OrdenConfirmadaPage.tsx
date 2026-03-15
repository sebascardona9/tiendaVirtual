import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface LocationState {
  numeroOrden?: string
  telefono?:    string
}

const OrdenConfirmadaPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state    = location.state as LocationState | null

  useEffect(() => {
    if (!state?.numeroOrden) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state?.numeroOrden) return null

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '4rem 1rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1.25rem' }}>🕯️</div>

      <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem' }}>
        ✅
      </div>

      <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: 'var(--vsm-black)', marginBottom: '0.75rem' }}>
        ¡Pedido recibido!
      </h1>

      <div style={{ backgroundColor: 'var(--vsm-bg-warm)', borderRadius: '12px', border: '1px solid var(--vsm-gray)', padding: '1.25rem', marginBottom: '1.5rem' }}>
        <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', marginBottom: '0.5rem' }}>
          Tu número de pedido es:
        </p>
        <p style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--vsm-brand)', letterSpacing: '0.05em' }}>
          {state.numeroOrden}
        </p>
      </div>

      {state.telefono && (
        <p style={{ color: 'var(--vsm-gray-mid)', fontSize: '14px', lineHeight: 1.7, marginBottom: '2rem' }}>
          Te contactaremos pronto al <strong style={{ color: 'var(--vsm-black)' }}>{state.telefono}</strong> para coordinar la entrega.
        </p>
      )}

      <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', marginBottom: '2rem' }}>
        Recuerda que el pago se realiza <strong>al momento de recibir tu pedido</strong>.
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: 'var(--vsm-brand)', color: '#fff',
          border: 'none', borderRadius: '8px', padding: '13px 32px',
          fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        Seguir comprando
      </button>
    </div>
  )
}

export default OrdenConfirmadaPage
