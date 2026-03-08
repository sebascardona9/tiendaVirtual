import React, { useState } from 'react'
import type { StoreSettings } from '../../../../../types/admin'
import { savePartialSettings, uploadHeroVideo, deleteHeroVideo } from '../../../../../services/settingsService'
import useFilePickerReset from '../../../../../hooks/useFilePickerReset'
import {
  inputStyle, labelStyle,
  errorBox, errorText as errorTextStyle, successBox, successText as successTextStyle,
  onFocusBrand, onBlurGray,
} from '../../../../../styles/formStyles'

const MAX_VIDEO_MB   = 50
const ACCEPTED_VIDEO = '.mp4,.webm,.mov'

interface Props {
  settings: StoreSettings | null
}

const SettingsHero = ({ settings }: Props) => {
  const resetTimer = useFilePickerReset()

  // ── Hero text ──────────────────────────────────────────────────────────────
  const [heroEyebrow, setHeroEyebrow]   = useState(settings?.heroEyebrow   ?? '')
  const [heroTitulo, setHeroTitulo]     = useState(settings?.heroTitulo    ?? '')
  const [heroSubtitulo, setHeroSubtitulo] = useState(settings?.heroSubtitulo ?? '')
  const [loadingText, setLoadingText]   = useState(false)
  const [textSuccess, setTextSuccess]   = useState(false)
  const [textError, setTextError]       = useState<string | null>(null)

  // ── Video ──────────────────────────────────────────────────────────────────
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(settings?.heroVideoURL ?? null)
  const [videoFile, setVideoFile]             = useState<File | null>(null)
  const [videoPreview, setVideoPreview]       = useState<string | null>(null)
  const [videoInputKey, setVideoInputKey]     = useState(0)
  const [uploadProgress, setUploadProgress]   = useState(0)
  const [uploading, setUploading]             = useState(false)
  const [deleting, setDeleting]               = useState(false)
  const [deleteConfirm, setDeleteConfirm]     = useState(false)
  const [videoError, setVideoError]           = useState<string | null>(null)

  // ── Text save ──────────────────────────────────────────────────────────────
  const handleSaveText = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingText(true)
    setTextError(null)
    setTextSuccess(false)
    try {
      await savePartialSettings({ heroEyebrow, heroTitulo, heroSubtitulo })
      setTextSuccess(true)
      setTimeout(() => setTextSuccess(false), 3000)
    } catch {
      setTextError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoadingText(false)
    }
  }

  // ── Video handlers ─────────────────────────────────────────────────────────
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetTimer()
    setVideoError(null)
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setVideoError(`El archivo supera el límite de ${MAX_VIDEO_MB}MB.`)
      setVideoInputKey(k => k + 1)
      return
    }
    setVideoFile(file)
    setVideoPreview(URL.createObjectURL(file))
  }

  const handleVideoUpload = async () => {
    if (!videoFile) return
    setUploading(true)
    setUploadProgress(0)
    setVideoError(null)
    try {
      const url = await uploadHeroVideo(videoFile, setUploadProgress)
      setCurrentVideoUrl(url)
      setVideoFile(null)
      setVideoPreview(null)
      setVideoInputKey(k => k + 1)
    } catch {
      setVideoError('Error al subir el video. Intenta de nuevo.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleVideoDelete = async () => {
    if (!currentVideoUrl) return
    setDeleting(true)
    setVideoError(null)
    try {
      await deleteHeroVideo(currentVideoUrl)
      setCurrentVideoUrl(null)
      setDeleteConfirm(false)
    } catch {
      setVideoError('Error al eliminar el video.')
    } finally {
      setDeleting(false)
    }
  }

  const btnStyle = (busy: boolean): React.CSSProperties => ({
    alignSelf: 'flex-start',
    backgroundColor: 'var(--vsm-brand)', color: '#fff',
    border: 'none', borderRadius: 'var(--vsm-radius-sm)', padding: '10px 24px',
    fontSize: '13px', fontWeight: 700, cursor: busy ? 'not-allowed' : 'pointer',
    opacity: busy ? 0.75 : 1, fontFamily: 'inherit',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '540px' }}>

      {/* ── Textos del Hero ── */}
      <form onSubmit={handleSaveText} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--vsm-black)', margin: '0 0 0.5rem' }}>
              Textos del Hero
            </p>
            <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', margin: 0 }}>
              Deja vacío cualquier campo para usar el texto por defecto.
            </p>
          </div>

          <div>
            <label style={labelStyle}>Texto pequeño (eyebrow)</label>
            <input value={heroEyebrow} onChange={e => setHeroEyebrow(e.target.value)}
              placeholder="Ej: ✦ Ritual de bienestar"
              style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray} />
          </div>

          <div>
            <label style={labelStyle}>Título principal</label>
            <input value={heroTitulo} onChange={e => setHeroTitulo(e.target.value)}
              placeholder="Ej: Tu nuevo ritual diario de bienestar"
              style={inputStyle} onFocus={onFocusBrand} onBlur={onBlurGray} />
          </div>

          <div>
            <label style={labelStyle}>Subtítulo / descripción</label>
            <textarea value={heroSubtitulo} onChange={e => setHeroSubtitulo(e.target.value)}
              placeholder="Ej: Velas artesanales elaboradas a mano..."
              rows={3} style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={onFocusBrand} onBlur={onBlurGray} />
          </div>

          {textError   && <div style={errorBox}><p style={errorTextStyle}>{textError}</p></div>}
          {textSuccess && <div style={successBox}><p style={successTextStyle}>Textos del Hero guardados.</p></div>}

          <button type="submit" disabled={loadingText} style={btnStyle(loadingText)}>
            {loadingText ? 'Guardando...' : 'Guardar textos'}
          </button>
        </div>
      </form>

      {/* ── Video del Hero ── */}
      <div style={{ borderTop: '1px solid var(--vsm-gray)', paddingTop: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--vsm-black)', margin: 0 }}>
            Video del Hero
          </h3>
          <span style={{
            fontSize: '11px', fontWeight: 700,
            padding: '3px 10px', borderRadius: '20px',
            backgroundColor: currentVideoUrl ? '#D1FAE5' : 'var(--vsm-gray)',
            color: currentVideoUrl ? '#065F46' : 'var(--vsm-gray-mid)',
          }}>
            {currentVideoUrl ? '● Video activo' : '○ Sin video — mostrando carrusel'}
          </span>
        </div>

        {/* Video actual */}
        {currentVideoUrl && (
          <div style={{ marginBottom: '1.25rem' }}>
            <video src={currentVideoUrl} controls muted style={{
              width: '100%', maxHeight: '200px',
              borderRadius: 'var(--vsm-radius)',
              border: '1px solid var(--vsm-gray)',
              backgroundColor: '#000', display: 'block',
            }} />

            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                style={{
                  marginTop: '0.75rem',
                  backgroundColor: 'transparent', color: '#DC2626',
                  border: '1px solid #DC2626', borderRadius: 'var(--vsm-radius-sm)',
                  padding: '7px 16px', fontSize: '12px', fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Eliminar video
              </button>
            ) : (
              <div style={{
                marginTop: '0.75rem', padding: '0.875rem 1rem',
                backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 'var(--vsm-radius)', display: 'flex', flexDirection: 'column', gap: '0.5rem',
              }}>
                <p style={{ fontSize: '13px', color: '#7F1D1D', fontWeight: 600, margin: 0 }}>
                  ¿Eliminar el video? El hero volverá a mostrar el carrusel de imágenes.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleVideoDelete} disabled={deleting} style={{
                    backgroundColor: '#DC2626', color: '#fff',
                    border: 'none', borderRadius: 'var(--vsm-radius-sm)',
                    padding: '7px 16px', fontSize: '12px', fontWeight: 700,
                    cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.75 : 1, fontFamily: 'inherit',
                  }}>
                    {deleting ? 'Eliminando...' : 'Confirmar'}
                  </button>
                  <button onClick={() => setDeleteConfirm(false)} disabled={deleting} style={{
                    backgroundColor: 'var(--vsm-white)', color: 'var(--vsm-gray-mid)',
                    border: '1px solid var(--vsm-gray)', borderRadius: 'var(--vsm-radius-sm)',
                    padding: '7px 16px', fontSize: '12px', fontWeight: 600,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subir / reemplazar video */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={labelStyle}>
            {currentVideoUrl ? 'Reemplazar video' : 'Subir video'}
            <span style={{ color: 'var(--vsm-gray-mid)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              {' '}— mp4, webm, mov · máx {MAX_VIDEO_MB}MB
            </span>
          </label>

          <input
            key={videoInputKey}
            type="file"
            accept={ACCEPTED_VIDEO}
            onChange={handleVideoSelect}
            style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)' }}
          />

          {videoPreview && (
            <video src={videoPreview} controls muted style={{
              width: '100%', maxHeight: '180px',
              borderRadius: 'var(--vsm-radius)',
              border: '2px dashed var(--vsm-brand)',
              backgroundColor: '#000', display: 'block',
            }} />
          )}

          {uploading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--vsm-gray)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  backgroundColor: 'var(--vsm-brand)',
                  width: `${uploadProgress}%`,
                  transition: 'width 0.2s ease',
                }} />
              </div>
              <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', margin: 0 }}>
                Subiendo... {uploadProgress}%
              </p>
            </div>
          )}

          {videoError && <div style={errorBox}><p style={errorTextStyle}>{videoError}</p></div>}

          {videoFile && !uploading && (
            <button type="button" onClick={handleVideoUpload} style={btnStyle(false)}>
              Subir video
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsHero
