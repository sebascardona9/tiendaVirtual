import React, { useState, useEffect } from 'react'
import {
  collection, addDoc, updateDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../../firebase/firebase.config'
import type { Product, Category, ProductFormData } from '../../../../types/admin'
import AdminModal from '../shared/AdminModal'

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

const ProductForm = ({ isOpen, onClose, product, categories }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>(emptyForm)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const [loading, setLoading]     = useState(false)

  useEffect(() => {
    if (isOpen) {
      setFormData(product ? {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
      } : emptyForm)
      setImageFile(null)
      setError(null)
    }
  }, [isOpen, product])

  const set = (field: keyof ProductFormData, value: string | number) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) { setError('El nombre es obligatorio.'); return }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        name:        formData.name.trim(),
        description: formData.description.trim(),
        price:       Number(formData.price)  || 0,
        stock:       Number(formData.stock)  || 0,
        categoryId:  formData.categoryId,
        imageUrl:    formData.imageUrl.trim(),
      }

      if (product) {
        // EDIT
        let imageUrl = payload.imageUrl
        if (imageFile) {
          try {
            const ext = imageFile.name.split('.').pop()
            const storageRef = ref(storage, `products/${product.id}/image.${ext}`)
            await uploadBytes(storageRef, imageFile)
            imageUrl = await getDownloadURL(storageRef)
          } catch (uploadErr) {
            console.warn('Image upload failed, saving without new image:', uploadErr)
            setError('Producto guardado, pero la imagen no pudo subirse. Verifica que Firebase Storage esté activado.')
          }
        }
        await updateDoc(doc(db, 'products', product.id), {
          ...payload, imageUrl, updatedAt: serverTimestamp(),
        })
      } else {
        // CREATE
        const docRef = await addDoc(collection(db, 'products'), {
          ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        })
        if (imageFile) {
          try {
            const ext = imageFile.name.split('.').pop()
            const storageRef = ref(storage, `products/${docRef.id}/image.${ext}`)
            await uploadBytes(storageRef, imageFile)
            const imageUrl = await getDownloadURL(storageRef)
            await updateDoc(doc(db, 'products', docRef.id), { imageUrl })
          } catch (uploadErr) {
            console.warn('Image upload failed, product saved without image:', uploadErr)
            setError('Producto creado, pero la imagen no pudo subirse. Verifica que Firebase Storage esté activado.')
            setLoading(false)
            return // leave modal open so user sees the warning
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

  const focusBrand  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
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
                type="number" min="0" value={formData.price}
                placeholder="0"
                onChange={e => set('price', e.target.value === '' ? '' : Number(e.target.value))}
                style={inputStyle} onFocus={focusBrand} onBlur={blurGray}
              />
            </div>
            <div>
              <label style={labelStyle}>Stock</label>
              <input
                type="number" min="0" value={formData.stock}
                placeholder="0"
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

          {/* URL imagen */}
          <div>
            <label style={labelStyle}>URL de imagen</label>
            <input
              value={formData.imageUrl}
              onChange={e => set('imageUrl', e.target.value)}
              placeholder="https://..."
              style={inputStyle} onFocus={focusBrand} onBlur={blurGray}
            />
          </div>

          {/* Archivo imagen */}
          <div>
            <label style={labelStyle}>O subir archivo de imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                // Reset inactivity timer: the OS file picker blocks browser events
                document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
                setImageFile(e.target.files?.[0] ?? null)
              }}
              style={{ fontSize: '13px', color: 'var(--vsm-gray-mid)' }}
            />
            {imageFile && (
              <p style={{ fontSize: '12px', color: 'var(--vsm-gray-mid)', marginTop: '4px' }}>
                Archivo: {imageFile.name}
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
