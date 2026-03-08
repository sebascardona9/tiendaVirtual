import React, { useState, useEffect } from 'react'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../../../../firebase/firebase.config'
import type { Product, Category, Subcategory, ProductFormData } from '../../../../types/admin'
import AdminModal               from '../shared/AdminModal'
import useFilePickerReset       from '../../../../hooks/useFilePickerReset'
import { useAtributosProducto } from '../../../../hooks/useAtributosProducto'
import { errorBox, errorText }  from '../../../../styles/formStyles'
import ProductFields            from './form/ProductFields'
import ProductImageManager      from './form/ProductImageManager'

interface Props {
  isOpen:        boolean
  onClose:       () => void
  product?:      Product
  categories:    Category[]
  subcategories: Subcategory[]
}

const emptyForm: ProductFormData = {
  name: '', description: '', price: '', stock: '',
  categoryId: '', subcategoryId: '', imageUrl: '', active: true,
  aromaId: '', aromaNombre: '', colorId: '', colorNombre: '', colorHex: '',
}

const ProductForm = ({ isOpen, onClose, product, categories, subcategories }: Props) => {
  const resetTimer = useFilePickerReset()
  const { aromas, colores } = useAtributosProducto()

  const [formData, setFormData]       = useState<ProductFormData>(emptyForm)
  const [images, setImages]           = useState<string[]>([])
  const [pendingFiles, setPendingFiles] = useState<File[]>([])
  const [error, setError]             = useState<string | null>(null)
  const [loading, setLoading]         = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setFormData(product ? {
      name:          product.name,
      description:   product.description,
      price:         product.price,
      stock:         product.stock,
      categoryId:    product.categoryId,
      subcategoryId: product.subcategoryId ?? '',
      imageUrl:      product.imageUrl,
      active:        product.active !== false,
      aromaId:       product.aromaId    ?? '',
      aromaNombre:   product.aromaNombre ?? '',
      colorId:       product.colorId    ?? '',
      colorNombre:   product.colorNombre ?? '',
      colorHex:      product.colorHex   ?? '',
    } : emptyForm)
    setImages(
      product?.images?.length ? product.images
      : product?.imageUrl     ? [product.imageUrl]
      : [],
    )
    setPendingFiles([])
    setError(null)
  }, [isOpen, product])

  const handleChange = (field: keyof ProductFormData, value: string | number | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleCategoryChange = (catId: string) =>
    setFormData(prev => ({ ...prev, categoryId: catId, subcategoryId: '' }))

  const handleAromaChange = (id: string, nombre: string) =>
    setFormData(prev => ({ ...prev, aromaId: id, aromaNombre: nombre }))

  const handleColorChange = (id: string, nombre: string, hex: string) =>
    setFormData(prev => ({ ...prev, colorId: id, colorNombre: nombre, colorHex: hex }))

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
      const selectedCat = categories.find(c => c.id === formData.categoryId)
      const selectedSub = subcategories.find(s => s.id === formData.subcategoryId && s.categoryId === formData.categoryId)

      const base = {
        name:            formData.name.trim(),
        description:     formData.description.trim(),
        price:           Number(formData.price) || 0,
        stock:           Number(formData.stock) || 0,
        categoryId:      formData.categoryId,
        categoryName:    selectedCat?.name ?? '',
        subcategoryId:   formData.subcategoryId || null,
        subcategoryName: selectedSub?.name ?? null,
        active:          formData.active,
        aromaId:         formData.aromaId    || null,
        aromaNombre:     formData.aromaNombre || null,
        colorId:         formData.colorId    || null,
        colorNombre:     formData.colorNombre || null,
        colorHex:        formData.colorHex   || null,
      }

      if (product) {
        // Edit: upload pending files then update
        const uploadedUrls: string[] = []
        for (let i = 0; i < pendingFiles.length; i++) {
          try { uploadedUrls.push(await uploadFile(pendingFiles[i], product.id, i)) }
          catch { console.warn('Upload failed for file', i) }
        }
        const finalImages = [...images, ...uploadedUrls]
        await updateDoc(doc(db, 'products', product.id), {
          ...base, imageUrl: finalImages[0] ?? '', images: finalImages, updatedAt: serverTimestamp(),
        })
        if (uploadedUrls.length < pendingFiles.length) {
          setError('Producto guardado, pero algunas imágenes no pudieron subirse.')
          setLoading(false)
          return
        }
      } else {
        // Create: addDoc first, then upload files
        const docRef = await addDoc(collection(db, 'products'), {
          ...base, imageUrl: images[0] ?? '', images, createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
        })
        if (pendingFiles.length > 0) {
          const uploadedUrls: string[] = []
          for (let i = 0; i < pendingFiles.length; i++) {
            try { uploadedUrls.push(await uploadFile(pendingFiles[i], docRef.id, i)) }
            catch { console.warn('Upload failed for file', i) }
          }
          if (uploadedUrls.length > 0) {
            const finalImages = [...images, ...uploadedUrls]
            await updateDoc(doc(db, 'products', docRef.id), { imageUrl: finalImages[0] ?? '', images: finalImages })
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

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} maxWidth="560px">
      <h3 style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--vsm-black)', marginBottom: '1.25rem' }}>
        {product ? 'Editar producto' : 'Nuevo producto'}
      </h3>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          <ProductFields
            formData={formData}
            categories={categories}
            subcategories={subcategories}
            aromas={aromas}
            colores={colores}
            onChange={handleChange}
            onCategoryChange={handleCategoryChange}
            onAromaChange={handleAromaChange}
            onColorChange={handleColorChange}
          />

          <ProductImageManager
            images={images}
            pendingFiles={pendingFiles}
            onImagesChange={setImages}
            onPendingChange={setPendingFiles}
            resetTimer={resetTimer}
          />

          {error && <div style={errorBox}><p style={errorText}>{error}</p></div>}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
            <button type="button" onClick={onClose} disabled={loading}
              style={{ padding: '9px 20px', borderRadius: 'var(--vsm-radius-sm)', border: '1px solid var(--vsm-gray)', backgroundColor: 'var(--vsm-white)', color: 'var(--vsm-gray-mid)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              style={{ padding: '9px 20px', borderRadius: 'var(--vsm-radius-sm)', border: 'none', backgroundColor: 'var(--vsm-brand)', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.75 : 1, fontFamily: 'inherit' }}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>

        </div>
      </form>
    </AdminModal>
  )
}

export default ProductForm
