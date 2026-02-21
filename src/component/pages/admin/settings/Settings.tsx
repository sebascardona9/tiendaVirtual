import React, { useState, useEffect } from 'react'
import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../../firebase/firebase.config'
import type { StoreSettings, SettingsFormData } from '../../../../types/admin'

const emptyForm: SettingsFormData = {
  storeName: '',
  description: '',
  email: '',
  phone: '',
  social: { instagram: '', facebook: '', whatsapp: '', tiktok: '' },
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--vsm-gray)',
  borderRadius: '5px',
  fontSize: '13px',
  fontFamily: 'inherit',
  outline: 'none',
  color: 'var(--vsm-black)',
  backgroundColor: 'var(--vsm-white)',
}

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--vsm-black)',
  display: 'block',
  marginBottom: '5px',
}

const Settings = () => {
  const [formData, setFormData]       = useState<SettingsFormData>(emptyForm)
  const [currentLogoUrl, setCurrentLogoUrl] = useState('')
  const [logoFile, setLogoFile]       = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [loading, setLoading]         = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [success, setSuccess]         = useState(false)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    getDoc(doc(db, 'settings', 'general')).then(snap => {
      if (snap.exists()) {
        const data = snap.data() as StoreSettings
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
    // Reset inactivity timer after returning from OS file picker
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
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
        const ext = logoFile.name.split('.').pop()
        const storageRef = ref(storage, `logos/store-logo.${ext}`)
        await uploadBytes(storageRef, logoFile)
        logoUrl = await getDownloadURL(storageRef)
        setCurrentLogoUrl(logoUrl)
        setLogoFile(null)
        setLogoPreview(null)
        setFileInputKey(k => k + 1)
      }

      await setDoc(
        doc(db, 'settings', 'general'),
        { ...formData, logoUrl, updatedAt: serverTimestamp() },
        { merge: true }
      )

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--vsm-brand)')
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = 'var(--vsm-gray)')

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
              style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>

          {/* Descripción */}
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={focus} onBlur={blur}
            />
          </div>

          {/* Email + Teléfono */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Correo de contacto</label>
              <input value={formData.email} onChange={e => setField('email', e.target.value)}
                type="email" style={inputStyle} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Teléfono / WhatsApp</label>
              <input value={formData.phone} onChange={e => setField('phone', e.target.value)}
                style={inputStyle} onFocus={focus} onBlur={blur} />
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
                    onFocus={focus} onBlur={blur}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '5px', padding: '10px 14px' }}>
              <p style={{ color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>{error}</p>
            </div>
          )}
          {success && (
            <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '5px', padding: '10px 14px' }}>
              <p style={{ color: '#16A34A', fontSize: '13px', fontWeight: 600 }}>Configuración guardada correctamente.</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              alignSelf: 'flex-start',
              backgroundColor: 'var(--vsm-brand)', color: '#fff',
              border: 'none', borderRadius: '5px', padding: '10px 24px',
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
