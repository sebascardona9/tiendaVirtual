import type { CSSProperties, ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
  id?: string
}

/**
 * Wrapper de sección con padding y ancho máximo consistentes en toda la app.
 * Aplica px responsive (px-4 md:px-8) y py responsive (py-12 md:py-20).
 * Usa este componente en lugar de repetir las clases manualmente.
 */
const Section = ({ children, style, className = '', id }: SectionProps) => (
  <section
    id={id}
    style={style}
    className={`py-12 md:py-20 px-4 md:px-8 ${className}`}
  >
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
)

export default Section
