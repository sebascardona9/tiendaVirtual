import useCollection from './useCollection'
import type { Aroma } from '../types/admin'

/** Retorna todos los aromas (activos e inactivos) para el panel admin. */
export function useAromas() {
  return useCollection<Aroma>('aromas')
}
