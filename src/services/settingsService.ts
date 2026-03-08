import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/firebase.config'
import type { StoreSettings, SettingsFormData } from '../types/admin'

const SETTINGS_DOC = doc(db, 'settings', 'general')

export async function fetchSettings(): Promise<StoreSettings | null> {
  const snap = await getDoc(SETTINGS_DOC)
  return snap.exists() ? (snap.data() as StoreSettings) : null
}

export async function uploadLogo(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const storageRef = ref(storage, `logos/store-logo.${ext}`)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

export async function saveSettings(
  data: SettingsFormData,
  logoUrl: string,
): Promise<void> {
  await setDoc(
    SETTINGS_DOC,
    { ...data, logoUrl, updatedAt: serverTimestamp() },
    { merge: true },
  )
}

export async function savePartialSettings(
  data: Partial<StoreSettings>,
): Promise<void> {
  await setDoc(
    SETTINGS_DOC,
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  )
}

export function uploadHeroVideo(
  file: File,
  onProgress: (pct: number) => void,
): Promise<string> {
  const ext = file.name.split('.').pop()
  const storageRef = ref(storage, `hero/hero-video.${ext}`)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file)
    task.on(
      'state_changed',
      (snap) => onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          await setDoc(SETTINGS_DOC, { heroVideoURL: url }, { merge: true })
          resolve(url)
        } catch (e) { reject(e) }
      },
    )
  })
}

export async function deleteHeroVideo(videoUrl: string): Promise<void> {
  // Extrae el path del storage desde la URL de descarga
  const match = videoUrl.match(/\/o\/([^?]+)/)
  if (match) {
    try {
      await deleteObject(ref(storage, decodeURIComponent(match[1])))
    } catch {
      // Si falla el borrado en Storage igual limpiamos Firestore
    }
  }
  await setDoc(SETTINGS_DOC, { heroVideoURL: null }, { merge: true })
}
