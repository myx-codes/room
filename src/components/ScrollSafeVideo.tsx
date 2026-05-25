import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

interface ScrollSafeVideoProps {
  src: string
  poster: string
  alt?: string
  className?: string
  type?: string
  minWidth?: number
  rootMargin?: string
}

export function ScrollSafeVideo({
  src,
  poster,
  alt = '',
  className,
  type = 'video/webm',
  minWidth = 1024,
  rootMargin = '120px 0px',
}: ScrollSafeVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollIdleRef = useRef(true)
  const [canUseVideo, setCanUseVideo] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isScrollIdle, setIsScrollIdle] = useState(true)
  const [isDocumentVisible, setIsDocumentVisible] = useState(() =>
    typeof document === 'undefined' ? true : document.visibilityState === 'visible',
  )

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const wideScreenQuery = window.matchMedia(`(min-width: ${minWidth}px)`)
    const win = window as IdleWindow
    let idleHandle: number | undefined
    let timeoutHandle: ReturnType<typeof window.setTimeout> | undefined

    const clearScheduledLoad = () => {
      if (idleHandle !== undefined && win.cancelIdleCallback) {
        win.cancelIdleCallback(idleHandle)
      }

      if (timeoutHandle !== undefined) {
        window.clearTimeout(timeoutHandle)
      }

      idleHandle = undefined
      timeoutHandle = undefined
    }

    const scheduleVideoLoad = () => {
      clearScheduledLoad()
      setCanUseVideo(false)

      if (reducedMotionQuery.matches || !wideScreenQuery.matches) {
        return
      }

      const enableVideo = () => setCanUseVideo(true)

      if (win.requestIdleCallback) {
        idleHandle = win.requestIdleCallback(enableVideo, { timeout: 1800 })
        return
      }

      timeoutHandle = window.setTimeout(enableVideo, 1400)
    }

    const addQueryListener = (query: MediaQueryList) => {
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', scheduleVideoLoad)
        return
      }

      query.addListener(scheduleVideoLoad)
    }

    const removeQueryListener = (query: MediaQueryList) => {
      if (typeof query.removeEventListener === 'function') {
        query.removeEventListener('change', scheduleVideoLoad)
        return
      }

      query.removeListener(scheduleVideoLoad)
    }

    scheduleVideoLoad()
    addQueryListener(reducedMotionQuery)
    addQueryListener(wideScreenQuery)

    return () => {
      clearScheduledLoad()
      removeQueryListener(reducedMotionQuery)
      removeQueryListener(wideScreenQuery)
    }
  }, [minWidth])

  useEffect(() => {
    const element = containerRef.current

    if (!element || typeof window === 'undefined') {
      return
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin, threshold: 0.08 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [rootMargin])

  useEffect(() => {
    if (!canUseVideo || typeof window === 'undefined') {
      return
    }

    let settleTimer: ReturnType<typeof window.setTimeout> | undefined

    const markScrolling = () => {
      if (scrollIdleRef.current) {
        scrollIdleRef.current = false
        setIsScrollIdle(false)
      }

      if (settleTimer !== undefined) {
        window.clearTimeout(settleTimer)
      }

      settleTimer = window.setTimeout(() => {
        scrollIdleRef.current = true
        setIsScrollIdle(true)
      }, 220)
    }

    window.addEventListener('scroll', markScrolling, { passive: true })
    window.addEventListener('wheel', markScrolling, { passive: true })
    window.addEventListener('touchmove', markScrolling, { passive: true })

    return () => {
      if (settleTimer !== undefined) {
        window.clearTimeout(settleTimer)
      }

      window.removeEventListener('scroll', markScrolling)
      window.removeEventListener('wheel', markScrolling)
      window.removeEventListener('touchmove', markScrolling)
    }
  }, [canUseVideo])

  useEffect(() => {
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState === 'visible')
    }

    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [])

  useEffect(() => {
    const video = videoRef.current

    if (!video) {
      return
    }

    const shouldPlay = isVisible && isScrollIdle && isDocumentVisible

    if (!shouldPlay) {
      video.pause()
      return
    }

    void video.play().catch(() => {
      video.pause()
    })
  }, [isDocumentVisible, isScrollIdle, isVisible, canUseVideo])

  return (
    <div ref={containerRef} className="h-full w-full">
      {canUseVideo ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-hidden="true"
          className={cn('h-full w-full object-cover', className)}
        >
          <source src={src} type={type} />
        </video>
      ) : (
        <img
          src={poster}
          alt={alt}
          aria-hidden={alt ? undefined : 'true'}
          className={cn('h-full w-full object-cover', className)}
        />
      )}
    </div>
  )
}
