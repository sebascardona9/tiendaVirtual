import { useState, useEffect } from 'react'
import { onSnapshot, doc } from 'firebase/firestore'
import { db } from '../firebase/firebase.config'
import type { StoreSettings } from '../types/admin'

export function useSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'general'),
      (snap) => {
        if (snap.exists()) {
          setSettings(snap.data() as StoreSettings)
        } else {
          setSettings(null)
        }
        setLoading(false)
      },
      () => {
        // Silent fail — unauthenticated users hitting rules won't break the navbar
        setSettings(null)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [])

  return { settings, loading }
}
