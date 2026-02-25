import React, { useState, useEffect } from 'react'
import type { SettingsFormData } from '../../../../types/admin'
import { fetchSettings, uploadLogo, saveSettings } from '../../../../services/settingsService'
import useFilePickerReset from '../../../../hooks/useFilePickerReset'
import { inputStyle, labelStyle, errorBox, errorText, successBox, successText, onFocusBrand, onBlurGray } from '../../../../styles/formStyles'

const emptyForm: SettingsFormData = {
  storeName: '',
  description: '',
  email: '',
  phone: '',
  social: { instagram: '', facebook: '', whatsapp: '', tiktok: '' },
}

const Settings = () => {
  const resetTimer = useFilePickerReset()

  const [formData, setFormData]             = useState<SettingsFormData>(emptyForm)
  const [currentLogoUrl, setCurrentLogoUrl] = useState('')
  const [logoFile, setLogoFile]             = useState<File | null>(null)
  const [logoPreview, setLogoPreview]       = useState<string | null>(null)
  const [fileInputKey, setFileInputKey]     = useState(0)
  const [loading, setLoading]               = useState(false)
  const [fetchLoading, setFetchLoading]     = useState(true)
  const [success, setSuccess]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)

  useEffect(() => {
    fetchSettings().then(data => {
      if (data) {
        setFormData({
          storeName:   data.storeName   ?? '',
          description: data.description ?? '',
          email:       data.email       ?? '',
          phone:       data.phone       ?? '',
          social:      data.social      ?? emptyForm.social,
        })
        setCurrentLogoUrl(data.logoUrl ?? '')
      }
      setFetchLoading(false)
    }).catch(() => setFetchLoading(false))
  }, [])

  const setField = (field: keyof Omit<SettingsFormData, 'social'>, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const setSocial = (field: keyof SettingsFormData['social'], value: string) =>
    setFormData(prev => ({ ...prev, social: { ...prev.social, [field]: value } }))

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

  if (fetchLoading) {
    return <div style={{ color: 'var(--vsm-gray-mid)', fontSize: '13px' }}>Cargando configuración...</div>
  }

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        Configuración de la tienda
      </h2>

      <form onSubmit={handleSave} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '540px' }}>

          {/* Logo */}
          <div>
            <label style={labelStyle}>Logo de la tienda</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              {(logoPreview || currentLogoUrl) && (
                <div style={{ position: 'relative', width: 72, height: 72 }}>
                  <img
                    src={logoPreview ?? currentLogoUrl}
                    alt="Logo"
                    style={{ width: 72, height: 72, objectFit: 'contain', borderRadius: '6px', border: '1px solid var(--vsm-gray)' }}
                  />
                </div>
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

          {/* Descripción */}
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={onFocusBrand} onBlur={onBlurGray}
            />
          </div>

          {/* Email + Teléfono */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
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

          {/* Redes sociales */}
          <div>
            <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Redes sociales</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {(['instagram','facebook','whatsapp','tiktok'] as const).map(net => (
                <div key={net} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '12px', width: 80, color: 'var(--vsm-gray-mid)', fontWeight: 600, textTransform: 'capitalize' }}>
                    {net}
                  </span>
                  <input
                    value={formData.social[net]}
                    onChange={e => setSocial(net, e.target.value)}
                    placeholder={`URL de ${net}`}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={onFocusBrand} onBlur={onBlurGray}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div style={errorBox}>
              <p style={errorText}>{error}</p>
            </div>
          )}
          {success && (
            <div style={successBox}>
              <p style={successText}>Configuración guardada correctamente.</p>
            </div>
          )}

          {/* Submit */}
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
    </div>
  )
}

export default Settings
