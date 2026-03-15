import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartContext }       from '../../context/CartContext'
import { useCheckout }          from '../../hooks/useCheckout'
import CheckoutDatosComprador   from './CheckoutDatosComprador'
import CheckoutDatosEnvio       from './CheckoutDatosEnvio'
import CheckoutResumenOrden     from './CheckoutResumenOrden'
import CheckoutBotonConfirmar   from './CheckoutBotonConfirmar'

const CheckoutPage = () => {
  const { items, totalPrecio } = useCartContext()
  const navigate = useNavigate()

  // Carrito vacío → redirigir
  useEffect(() => {
    if (items.length === 0) navigate('/carrito', { replace: true })
  }, [items.length, navigate])

  const {
    form, errors, loading,
    setField, setDepartamento, setMunicipio,
    setTerceroDepartamento, setTerceroMunicipio,
    handleSubmit,
  } = useCheckout()

  if (items.length === 0) return null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '1.5rem' }}>
        Finalizar pedido
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 items-start">
        {/* Columna izquierda — formulario */}
        <div>
          <CheckoutDatosComprador
            nombre={form.nombre}
            email={form.email}
            telefono={form.telefono}
            errors={errors}
            onChange={setField}
          />

          <CheckoutDatosEnvio
            form={form}
            errors={errors}
            onChange={setField}
            onDepartamentoChange={setDepartamento}
            onMunicipioChange={setMunicipio}
            onTerceroDeptChange={setTerceroDepartamento}
            onTerceroMuniChange={setTerceroMunicipio}
          />
        </div>

        {/* Columna derecha — resumen + botón */}
        <div style={{ position: 'sticky', top: '112px' }}>
          <CheckoutResumenOrden items={items} total={totalPrecio} />
          <CheckoutBotonConfirmar loading={loading} onConfirm={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
