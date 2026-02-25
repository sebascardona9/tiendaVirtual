/**
 * Formatea un número como moneda COP.
 * @example formatCOP(15000) → "$ 15.000"
 */
export const formatCOP = (n: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n)
