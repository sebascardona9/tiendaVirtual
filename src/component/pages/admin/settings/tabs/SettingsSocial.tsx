import React, { useState } from 'react'
import type { StoreSettings } from '../../../../../types/admin'
import { savePartialSettings } from '../../../../../services/settingsService'
import {
  inputStyle, labelStyle,
  errorBox, errorText, successBox, successText,
  onFocusBrand, onBlurGray,
} from '../../../../../styles/formStyles'

interface Props {
  settings: StoreSettings | null
}

const SettingsSocial = ({ settings }: Props) => {
  const [social, setSocialState] = useState({
    instagram: settings?.social?.instagram ?? '',
    facebook:  settings?.social?.facebook  ?? '',
    tiktok:    settings?.social?.tiktok    ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const setField = (field: keyof typeof social, value: string) =>
    setSocialState(prev => ({ ...prev, [field]: value }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      await savePartialSettings({ social })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '540px' }}>
        <p style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)', margin: 0 }}>
          Ingresa las URLs completas de cada red social. Dejar vacío para ocultar el enlace.
        </p>

        {(['instagram', 'facebook', 'tiktok'] as const).map(net => (
          <div key={net}>
            <label style={labelStyle}>{net.charAt(0).toUpperCase() + net.slice(1)}</label>
            <input
              value={social[net]}
              onChange={e => setField(net, e.target.value)}
              placeholder={`URL de ${net}`}
              style={inputStyle}
              onFocus={onFocusBrand} onBlur={onBlurGray}
            />
          </div>
        ))}

        {error   && <div style={errorBox}><p style={errorText}>{error}</p></div>}
        {success && <div style={successBox}><p style={successText}>Redes sociales guardadas correctamente.</p></div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            alignSelf: 'flex-start',
            backgroundColor: 'var(--vsm-brand)', color: '#fff',
            border: 'none', borderRadius: 'var(--vsm-radius-sm)', padding: '10px 24px',
            fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.75 : 1, fontFamily: 'inherit',
          }}
        >
          {loading ? 'Guardando...' : 'Guardar redes sociales'}
        </button>
      </div>
    </form>
  )
}

export default SettingsSocial
