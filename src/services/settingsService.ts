import { getDoc, setDoc, doc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
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
