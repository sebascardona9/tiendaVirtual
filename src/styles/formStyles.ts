import type React from 'react'

/** Input estándar del proyecto. Aplicar a <input>, <textarea> y <select>. */
export const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--vsm-gray)',
  borderRadius: 'var(--vsm-radius-sm)',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  color: 'var(--vsm-black)',
  backgroundColor: 'var(--vsm-white)',
  transition: 'border-color 0.2s',
}

/** Label estándar del proyecto. */
export const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: 'var(--vsm-black)',
  display: 'block',
  marginBottom: '6px',
}

/** Caja de error roja. Envolver con <div style={errorBox}><p>mensaje</p></div>. */
export const errorBox: React.CSSProperties = {
  backgroundColor: 'var(--vsm-error-bg)',
  border: '1px solid var(--vsm-error-border)',
  borderRadius: 'var(--vsm-radius-sm)',
  padding: '10px 14px',
}

/** Texto dentro de errorBox. */
export const errorText: React.CSSProperties = {
  color: 'var(--vsm-error)',
  fontSize: '13px',
  fontWeight: 600,
}

/** Caja de éxito verde. */
export const successBox: React.CSSProperties = {
  backgroundColor: 'var(--vsm-success-bg)',
  border: '1px solid var(--vsm-success-border)',
  borderRadius: 'var(--vsm-radius-sm)',
  padding: '10px 14px',
}

/** Texto dentro de successBox. */
export const successText: React.CSSProperties = {
  color: 'var(--vsm-success)',
  fontSize: '13px',
  fontWeight: 600,
}

/** Botón primario (brand). Deshabilitar con opacity + cursor. */
export const primaryBtn: React.CSSProperties = {
  backgroundColor: 'var(--vsm-brand)',
  color: '#fff',
  border: 'none',
  borderRadius: 'var(--vsm-radius-sm)',
  padding: '12px',
  width: '100%',
  fontSize: '13px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.07em',
  cursor: 'pointer',
  transition: 'opacity 0.2s',
  fontFamily: 'inherit',
}

// ── Handlers de focus/blur para campos de formulario ──────────────────────────

type FocusEl = React.FocusEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>

/** onFocus: cambia el borde al color de marca. */
export const onFocusBrand = (e: FocusEl) => {
  e.currentTarget.style.borderColor = 'var(--vsm-brand)'
}

/** onBlur: restaura el borde al gris estándar. */
export const onBlurGray = (e: FocusEl) => {
  e.currentTarget.style.borderColor = 'var(--vsm-gray)'
}
