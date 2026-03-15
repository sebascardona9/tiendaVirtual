import { useCartContext } from '../../context/CartContext'
import CartVacio    from './CartVacio'
import CartItemList from './CartItemList'
import CartResumen  from './CartResumen'

const CartPage = () => {
  const { items, totalPrecio, actualizarCantidad, quitarItem } = useCartContext()

  if (items.length === 0) return <CartVacio />

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: 'var(--vsm-black)', marginBottom: '1.5rem' }}>
        Mi carrito
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8">
        <section>
          <CartItemList
            items={items}
            onQtyChange={actualizarCantidad}
            onRemove={quitarItem}
          />
        </section>

        <aside>
          <CartResumen total={totalPrecio} />
        </aside>
      </div>
    </div>
  )
}

export default CartPage
