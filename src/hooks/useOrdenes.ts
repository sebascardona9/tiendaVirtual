import { useMemo, useState } from 'react'
import useCollection from './useCollection'
import type { Orden } from '../types/orden.types'

export const useOrdenes = () => {
  const { data: rawOrdenes, loading } = useCollection<Orden>('ordenes')
  const [selected, setSelected] = useState<Orden | null>(null)

  const ordenes = useMemo(
    () => [...rawOrdenes].sort((a, b) => (b.creadoEn?.seconds ?? 0) - (a.creadoEn?.seconds ?? 0)),
    [rawOrdenes]
  )

  return { ordenes, loading, selected, setSelected }
}
