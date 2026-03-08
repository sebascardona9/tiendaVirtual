import useCollection from './useCollection'
import type { Color } from '../types/admin'

/** Retorna todos los colores (activos e inactivos) para el panel admin. */
export function useColores() {
  return useCollection<Color>('colores')
}
