import React, { useState } from 'react'
import type { StoreSettings, SettingsFormData } from '../../../../../types/admin'
import { uploadLogo, saveSettings } from '../../../../../services/settingsService'
import useFilePickerReset from '../../../../../hooks/useFilePickerReset'
import {
  inputStyle, labelStyle,
  errorBox, errorText, successBox, successText,
  onFocusBrand, onBlurGray,
} from '../../../../../styles/formStyles'

interface Props {
  settings: StoreSettings | null
}

const SettingsGeneral = ({ settings }: Props) => {
  const resetTimer = useFilePickerReset()

  const [formData, setFormData] = useState<SettingsFormData>({
    storeName:   settings?.storeName   ?? '',
    description: settings?.description ?? '',
    email:       settings?.email       ?? '',
    phone:       settings?.phone       ?? '',
    address:     settings?.address     ?? '',
    social:      settings?.social      ?? { instagram: '', facebook: '', tiktok: '' },
  })
  const [currentLogoUrl, setCurrentLogoUrl] = useState(settings?.logoUrl ?? '')
  const [logoFile, setLogoFile]             = useState<File | null>(null)
  const [logoPreview, setLogoPreview]       = useState<string | null>(null)
  const [fileInputKey, setFileInputKey]     = useState(0)
  const [loading, setLoading]               = useState(false)
  const [success, setSuccess]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)

  const setField = (field: keyof Omit<SettingsFormData, 'social'>, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetTimer()
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    setLogoPreview(URL.createObjectURL(file))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      let logoUrl = currentLogoUrl
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile)
        setCurrentLogoUrl(logoUrl)
        setLogoFile(null)
        setLogoPreview(null)
        setFileInputKey(k => k + 1)
      }
      await saveSettings(formData, logoUrl)
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

        {/* Logo */}
        <div>
          <label style={labelStyle}>Logo de la tienda</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            {(logoPreview || currentLogoUrl) && (
              <img
                src={logoPreview ?? currentLogoUrl}
                alt="Logo"
                style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--vsm-gray)' }}
              />
            )}
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)' }}
            />
          </div>
          {logoFile && (
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)' }}>Nuevo logo: {logoFile.name}</p>
          )}
        </div>

        {/* Nombre tienda */}
        <div>
          <label style={labelStyle}>Nombre de la tienda</label>
          <input value={formData.storeName} onChange={e => setField('storeName', e.target.value)}
            style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray} />
        </div>

        {/* Sobre Nosotros */}
        <div>
          <label style={labelStyle}>Sobre Nosotros</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={onFocusBrand} onBlur={onBlurGray}
          />
        </div>

        {/* Dirección */}
        <div>
          <label style={labelStyle}>Dirección</label>
          <input value={formData.address} onChange={e => setField('address', e.target.value)}
            placeholder="Ej: Calle 15 #3-45, Santa Marta"
            style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray} />
        </div>

        {/* Email + Teléfono */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div>
            <label style={labelStyle}>Correo de contacto</label>
            <input value={formData.email} onChange={e => setField('email', e.target.value)}
              type="email" style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray} />
          </div>
          <div>
            <label style={labelStyle}>Teléfono / WhatsApp</label>
            <input value={formData.phone} onChange={e => setField('phone', e.target.value)}
              style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray} />
          </div>
        </div>

        {error   && <div style={errorBox}><p style={errorText}>{error}</p></div>}
        {success && <div style={successBox}><p style={successText}>Configuración guardada correctamente.</p></div>}

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
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

export default SettingsGeneral
