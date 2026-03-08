import React, { useState } from 'react'
import { inputStyle, labelStyle, onFocusBrand, onBlurGray } from '../../../../../styles/formStyles'

const MAX_IMAGES = 10

const removeBtn: React.CSSProperties = {
  position: 'absolute', top: -6, right: -6,
  width: 20, height: 20, borderRadius: '50%',
  backgroundColor: 'var(--vsm-error)', color: '#fff',
  border: 'none', cursor: 'pointer',
  fontSize: '10px', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'inherit', lineHeight: 1, padding: 0,
}

interface Props {
  images:         string[]
  pendingFiles:   File[]
  onImagesChange: (images: string[]) => void
  onPendingChange: (files: File[]) => void
  resetTimer:     () => void
}

const ProductImageManager = ({ images, pendingFiles, onImagesChange, onPendingChange, resetTimer }: Props) => {
  const [urlInput, setUrlInput]     = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)

  const totalCount = images.length + pendingFiles.length
  const canAddMore = totalCount < MAX_IMAGES

  const addUrlImage = () => {
    const url = urlInput.trim()
    if (!url || !canAddMore) return
    onImagesChange([...images, url])
    setUrlInput('')
  }

  const removeCommitted = (i: number) => onImagesChange(images.filter((_, idx) => idx !== i))
  const removePending   = (i: number) => onPendingChange(pendingFiles.filter((_, idx) => idx !== i))

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetTimer()
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const slots = MAX_IMAGES - totalCount
    onPendingChange([...pendingFiles, ...files.slice(0, slots)])
    setFileInputKey(k => k + 1)
  }

  return (
    <div>
      <label style={labelStyle}>
        Imágenes{' '}
        <span style={{ color: 'var(--vsm-gray-mid)', fontWeight: 400 }}>
          ({totalCount}/{MAX_IMAGES}) — la primera es la principal
        </span>
      </label>

      {/* Preview grid */}
      {totalCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '0.75rem' }}>
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                style={{
                  width: 72, height: 72, objectFit: 'cover',
                  borderRadius: 'var(--vsm-radius-sm)',
                  border: i === 0 ? '2px solid var(--vsm-brand)' : '1px solid var(--vsm-gray)',
                }}
              />
              {i === 0 && (
                <span style={{
                  position: 'absolute', bottom: 3, left: 3,
                  backgroundColor: 'var(--vsm-brand)', color: '#fff',
                  fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '2px',
                }}>
                  Principal
                </span>
              )}
              <button type="button" onClick={() => removeCommitted(i)} style={removeBtn}>✕</button>
            </div>
          ))}

          {pendingFiles.map((file, i) => (
            <div key={`p-${i}`} style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--vsm-radius-sm)', border: '2px dashed var(--vsm-brand)' }}
              />
              <span style={{
                position: 'absolute', bottom: 3, left: 3,
                backgroundColor: '#F5A623', color: '#fff',
                fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '2px',
              }}>
                Por subir
              </span>
              <button type="button" onClick={() => removePending(i)} style={removeBtn}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* URL input */}
      {canAddMore && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrlImage() } }}
            placeholder="https://... pegar URL de imagen"
            style={{ ...inputStyle, flex: 1 }}
            onFocus={onFocusBrand} onBlur={onBlurGray}
          />
          <button
            type="button"
            onClick={addUrlImage}
            disabled={!urlInput.trim()}
            style={{
              padding: '9px 14px', borderRadius: 'var(--vsm-radius-sm)', border: 'none',
              backgroundColor: urlInput.trim() ? 'var(--vsm-brand)' : 'var(--vsm-gray)',
              color: '#fff', fontSize: '12px', fontWeight: 700,
              cursor: urlInput.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', whiteSpace: 'nowrap',
            }}
          >
            + URL
          </button>
        </div>
      )}

      {/* File picker */}
      {canAddMore && (
        <div>
          <p style={{ fontSize: '11px', color: 'var(--vsm-gray-mid)', marginBottom: '4px' }}>
            O subir archivo(s):
          </p>
          <input
            key={fileInputKey}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileAdd}
            style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)' }}
          />
        </div>
      )}

      {!canAddMore && (
        <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', marginTop: '4px' }}>
          Máximo de {MAX_IMAGES} imágenes alcanzado.
        </p>
      )}
    </div>
  )
}

export default ProductImageManager
