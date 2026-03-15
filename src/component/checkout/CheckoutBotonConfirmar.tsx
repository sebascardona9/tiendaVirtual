interface Props {
  loading:   boolean
  onConfirm: () => void
}

const CheckoutBotonConfirmar = ({ loading, onConfirm }: Props) => (
  <button
    onClick={onConfirm}
    disabled={loading}
    style={{
      width: '100%', padding: '14px',
      backgroundColor: loading ? 'var(--vsm-gray)' : 'var(--vsm-brand)',
      color: loading ? 'var(--vsm-gray-mid)' : '#fff',
      border: 'none', borderRadius: '8px',
      fontSize: '15px', fontWeight: 700,
      cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit', marginTop: '1rem',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
      transition: 'background-color 0.2s',
    }}
  >
    {loading ? (
      <>
        <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
        Procesando...
      </>
    ) : 'Confirmar pedido'}
  </button>
)

export default CheckoutBotonConfirmar
