import { useState, useEffect, useRef } from 'react'

interface UseCarouselOptions {
  count: number
  autoIntervalMs?: number
  pauseAfterMs?: number
}

interface UseCarouselResult {
  idx: number
  fading: boolean
  goTo: (next: number) => void
}

export function useCarousel({
  count,
  autoIntervalMs = 3000,
  pauseAfterMs = 5000,
}: UseCarouselOptions): UseCarouselResult {
  const [idx, setIdx]       = useState(0)
  const [fading, setFading] = useState(false)

  const fadingRef     = useRef(false)
  const pausedRef     = useRef(false)
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clamp index if count shrinks after load
  useEffect(() => {
    if (count > 0) setIdx(i => Math.min(i, count - 1))
  }, [count])

  // Auto-rotate
  useEffect(() => {
    if (count < 2) return

    const interval = setInterval(() => {
      if (pausedRef.current || fadingRef.current) return
      fadingRef.current = true
      setFading(true)
      setTimeout(() => {
        setIdx(i => (i + 1) % count)
        setFading(false)
        fadingRef.current = false
      }, 200)
    }, autoIntervalMs)

    return () => {
      clearInterval(interval)
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    }
  }, [count, autoIntervalMs])

  const goTo = (next: number) => {
    if (fadingRef.current) return
    pausedRef.current = true
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => { pausedRef.current = false }, pauseAfterMs)
    fadingRef.current = true
    setFading(true)
    setTimeout(() => {
      setIdx(next)
      setFading(false)
      fadingRef.current = false
    }, 200)
  }

  return { idx, fading, goTo }
}
