import AromasSection from './AromasSection'
import ColoresSection from './ColoresSection'

const AtributosTab = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--vsm-gray-mid)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
        Atributos del producto
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
        Define los aromas y colores disponibles para asignar a los productos. Solo los activos aparecerán en el formulario de edición.
      </p>
    </div>

    <AromasSection />

    <hr style={{ border: 'none', borderTop: '1px solid var(--vsm-gray)', margin: 0 }} />

    <ColoresSection />
  </div>
)

export default AtributosTab
