import type { CartItem } from '../../types/cart.types'
import CartItemRow from './CartItemRow'

interface Props {
  items: CartItem[]
  onQtyChange: (id: string, qty: number) => void
  onRemove: (id: string) => void
}

const CartItemList = ({ items, onQtyChange, onRemove }: Props) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {items.map(item => (
      <CartItemRow
        key={item.productoId}
        item={item}
        onQtyChange={onQtyChange}
        onRemove={onRemove}
      />
    ))}
  </div>
)

export default CartItemList
