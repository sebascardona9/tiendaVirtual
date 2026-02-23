import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, query,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '../firebase/firebase.config'

interface UseCollectionResult<T> {
  data: T[]
  loading: boolean
}

/**
 * Subscribes to a Firestore collection with optional query constraints.
 * Handles onSnapshot setup, document mapping, and unsubscribe on cleanup.
 *
 * @example
 * const { data: products, loading } = useCollection<Product>('products')
 * const { data: categories }        = useCollection<Category>('categories', orderBy('createdAt', 'asc'))
 */
function useCollection<T>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): UseCollectionResult<T> {
  const [data, setData]       = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = constraints.length
      ? query(collection(db, collectionName), ...constraints)
      : collection(db, collectionName)

    const unsub = onSnapshot(ref, (snap) => {
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() } as T)))
      setLoading(false)
    })

    return () => unsub()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName])

  return { data, loading }
}

export default useCollection
