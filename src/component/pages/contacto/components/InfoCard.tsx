import { useState } from 'react'

interface Props {
  icon:   string
  label:  string
  value:  string
  href?:  string
}

const InfoCard = ({ icon, label, value, href }: Props) => {
  const [hovered, setHovered] = useState(false)

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:         'flex',
        alignItems:      'flex-start',
        gap:             '1rem',
        backgroundColor: 'var(--vsm-white)',
        borderRadius:    '12px',
        padding:         '1.25rem',
        boxShadow:       hovered ? '0 8px 24px rgba(201,107,43,0.15)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform:       hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition:      'box-shadow 0.25s ease, transform 0.25s ease',
        cursor:          href ? 'pointer' : 'default',
      }}
    >
      <span style={{
        fontSize:        '1.4rem',
        width:           '44px',
        height:          '44px',
        borderRadius:    '10px',
        backgroundColor: 'rgba(201,107,43,0.1)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        flexShrink:      0,
      }}>
        {icon}
      </span>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--vsm-gray-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
          {label}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--vsm-black)', lineHeight: 1.5, margin: 0 }}>
          {value || <span style={{ color: 'var(--vsm-gray-mid)', fontStyle: 'italic', fontWeight: 400 }}>No configurado</span>}
        </p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </a>
    )
  }
  return card
}

export default InfoCard
