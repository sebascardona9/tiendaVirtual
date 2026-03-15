import { doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase.config'

export const markAsRead = (id: string) =>
  updateDoc(doc(db, 'messages', id), { read: true })

export const deleteMessage = (id: string) =>
  deleteDoc(doc(db, 'messages', id))
