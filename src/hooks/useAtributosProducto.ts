import { where } from 'firebase/firestore'
import useCollection from './useCollection'
import type { Aroma, Color } from '../types/admin'

/** Retorna solo aromas y colores activos para poblar los selects del formulario de producto. */
export function useAtributosProducto() {
  const { data: aromas, loading: loadingA } = useCollection<Aroma>('aromas', where('activo', '==', true))
  const { data: colores, loading: loadingC } = useCollection<Color>('colores', where('activo', '==', true))
  return { aromas, colores, loading: loadingA || loadingC }
}
