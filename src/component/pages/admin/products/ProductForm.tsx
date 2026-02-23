import React, { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../../firebase/firebase.config'
import type { Product, Category, ProductFormData } from '../../../../types/admin'
import AdminModal from '../shared/AdminModal'
import useFilePickerReset from '../../../../hooks/useFilePickerReset'

const MAX_IMAGES = 5

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  product?: Product
  categories: Category[]
}

const emptyForm: ProductFormData = {
  name: '', description: '', price: '', stock: '', categoryId: '', imageUrl: '',
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

const removeBtn: React.CSSProperties = {
  position: 'absolute', top: -6, right: -6,
  width: 20, height: 20, borderRadius: '50%',
  backgroundColor: '#DC2626', color: '#fff',
  border: 'none', cursor: 'pointer',
  fontSize: '10px', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontFamily: 'inherit', lineHeight: 1, padding: 0,
}

const ProductForm = ({ isOpen, onClose, product, categories }: ProductFormProps) => {
  const resetTimer = useFilePickerReset()

  const [formData, setFormData]       = useState<ProductFormData>(emptyForm)
  // committed image URLs (already in Firestore or added via URL input)
  const [images, setImages]           = useState<string[]>([])
  // files selected but not yet uploaded
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [urlInput, setUrlInput]       = useState('')
  const [fileInputKey, setFileInputKey] = useState(0)
  const [error, setError]             = useState<string | null>(null)
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(product ? {
        name:        product.name,
        description: product.description,
        price:       product.price,
        stock:       product.stock,
        categoryId:  product.categoryId,
        imageUrl:    product.imageUrl,
      } : emptyForm)

      // Normalize existing images
      const existing = product?.images?.length
        ? product.images
        : product?.imageUrl
        ? [product.imageUrl]
        : []
      setImages(existing)
      setPendingFiles([])
      setUrlInput('')
      setFileInputKey(k => k + 1)
      setError(null)
    }
  }, [isOpen, product])

  const set = (field: keyof ProductFormData, value: string | number) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const totalCount = images.length + pendingFiles.length
  const canAddMore = totalCount < MAX_IMAGES

  const addUrlImage = () => {
    const url = urlInput.trim()
    if (!url || !canAddMore) return
    setImages(prev => [...prev, url])
    setUrlInput('')
  }

  const removeCommitted = (i: number) => setImages(prev => prev.filter((_, idx) => idx !== i))
  const removePending   = (i: number) => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    resetTimer()
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const slots = MAX_IMAGES - totalCount
    setPendingFiles(prev => [...prev, ...files.slice(0, slots)])
    setFileInputKey(k => k + 1)
  }

  const uploadFile = async (file: File, productId: string, index: number): Promise<string> => {
    const ext = file.name.split('.').pop()
    const storageRef = ref(storage, `products/${productId}/image-${Date.now()}-${index}.${ext}`)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { setError('El nombre es obligatorio.'); return }

    setLoading(true)
    setError(null)
    try {
      const base = {
        name:        formData.name.trim(),
        description: formData.description.trim(),
        price:       Number(formData.price) || 0,
        stock:       Number(formData.stock) || 0,
        categoryId:  formData.categoryId,
      }

      if (product) {
        // ── EDIT ──
        const uploadedUrls: string[] = []
        for (let i = 0; i < pendingFiles.length; i++) {
          try {
            uploadedUrls.push(await uploadFile(pendingFiles[i], product.id, i))
          } catch {
            console.warn('Upload failed for file', i)
          }
        }
        const finalImages = [...images, ...uploadedUrls]
        await updateDoc(doc(db, 'products', product.id), {
          ...base,
          imageUrl:  finalImages[0] ?? '',
          images:    finalImages,
          updatedAt: serverTimestamp(),
        })
        if (uploadedUrls.length < pendingFiles.length) {
          setError('Producto guardado, pero algunas imágenes no pudieron subirse.')
          setLoading(false)
          return
        }
      } else {
        // ── CREATE ──
        const docRef = await addDoc(collection(db, 'products'), {
          ...base,
          imageUrl:  images[0] ?? '',
          images:    images,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        if (pendingFiles.length > 0) {
          const uploadedUrls: string[] = []
          for (let i = 0; i < pendingFiles.length; i++) {
            try {
              uploadedUrls.push(await uploadFile(pendingFiles[i], docRef.id, i))
            } catch {
              console.warn('Upload failed for file', i)
            }
          }
          if (uploadedUrls.length > 0) {
            const finalImages = [...images, ...uploadedUrls]
            await updateDoc(doc(db, 'products', docRef.id), {
              imageUrl: finalImages[0] ?? '',
              images:   finalImages,
            })
          }
          if (uploadedUrls.length < pendingFiles.length) {
            setError('Producto creado, pero algunas imágenes no pudieron subirse.')
            setLoading(false)
            return
          }
        }
      }

      onClose()
    } catch (err) {
      console.error(err)
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const focusBrand = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'var(--vsm-brand)')
  const blurGray = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'var(--vsm-gray)')

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} maxWidth="560px">
      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        {product ? 'Editar producto' : 'Nuevo producto'}
      </h3>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Nombre */}
          <div>
            <label style={labelStyle}>Nombre <span style={{ color: '#DC2626' }}>*</span></label>
            <input value={formData.name} onChange={e => set('name', e.target.value)}
              style={inputStyle} onFocus={focusBrand} onBlur={blurGray} />
          </div>

          {/* Descripción */}
          <div>
            <label style={labelStyle}>Descripción</label>
            <textarea
              value={formData.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={focusBrand} onBlur={blurGray}
            />
          </div>

          {/* Precio + Stock */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={labelStyle}>Precio (COP)</label>
              <input
                type="number" min="0" value={formData.price} placeholder="0"
                onChange={e => set('price', e.target.value === '' ? '' : Number(e.target.value))}
                style={inputStyle} onFocus={focusBrand} onBlur={blurGray}
              />
            </div>
            <div>
              <label style={labelStyle}>Stock</label>
              <input
                type="number" min="0" value={formData.stock} placeholder="0"
                onChange={e => set('stock', e.target.value === '' ? '' : Number(e.target.value))}
                style={inputStyle} onFocus={focusBrand} onBlur={blurGray}
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label style={labelStyle}>Categoría</label>
            <select
              value={formData.categoryId}
              onChange={e => set('categoryId', e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={focusBrand} onBlur={blurGray}
            >
              <option value="">Sin categoría</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* ── Imágenes ── */}
          <div>
            <label style={labelStyle}>
              Imágenes{' '}
              <span style={{ color: 'var(--vsm-gray-mid)', fontWeight: 400 }}>
                ({totalCount}/{MAX_IMAGES}) — la primera es la principal
              </span>
            </label>

            {/* Previews */}
            {totalCount > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '0.75rem' }}>
                {images.map((url, i) => (
                  <div key={i} style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
                    <img
                      src={url}
                      alt={`Imagen ${i + 1}`}
                      style={{
                        width: 72, height: 72, objectFit: 'cover',
                        borderRadius: '5px',
                        border: i === 0
                          ? '2px solid var(--vsm-brand)'
                          : '1px solid var(--vsm-gray)',
                      }}
                    />
                    {i === 0 && (
                      <span style={{
                        position: 'absolute', bottom: 3, left: 3,
                        backgroundColor: 'var(--vsm-brand)', color: '#fff',
                        fontSize: '9px', fontWeight: 700,
                        padding: '1px 5px', borderRadius: '2px',
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
                      style={{
                        width: 72, height: 72, objectFit: 'cover',
                        borderRadius: '5px',
                        border: '2px dashed var(--vsm-brand)',
                      }}
                    />
                    <span style={{
                      position: 'absolute', bottom: 3, left: 3,
                      backgroundColor: '#F5A623', color: '#fff',
                      fontSize: '9px', fontWeight: 700,
                      padding: '1px 5px', borderRadius: '2px',
                    }}>
                      Por subir
                    </span>
                    <button type="button" onClick={() => removePending(i)} style={removeBtn}>✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Agregar por URL */}
            {canAddMore && (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUrlImage() } }}
                  placeholder="https://... pegar URL de imagen"
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={focusBrand} onBlur={blurGray}
                />
                <button
                  type="button"
                  onClick={addUrlImage}
                  disabled={!urlInput.trim()}
                  style={{
                    padding: '9px 14px', borderRadius: '5px', border: 'none',
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

            {/* Subir archivo */}
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

          {/* Error */}
          {error && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '5px', padding: '10px 14px' }}>
              <p style={{ color: '#DC2626', fontSize: '13px', fontWeight: 600 }}>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button type="button" onClick={onClose} disabled={loading}
              style={{ padding: '9px 20px', borderRadius: '5px', border: '1px solid var(--vsm-gray)', backgroundColor: 'var(--vsm-white)', color: 'var(--vsm-gray-mid)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              style={{ padding: '9px 20px', borderRadius: '5px', border: 'none', backgroundColor: 'var(--vsm-brand)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

        </div>
      </form>
    </AdminModal>
  )
}

export default ProductForm
