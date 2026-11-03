'use client'

import React, { useEffect, useRef } from 'react'

const AnimatedBackground = () => {
  const blobRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let requestId: number

    const handleScroll = () => {
      const scroll = window.pageYOffset

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return

        const xOffset =
          Math.sin(scroll / 120 + index * 0.6) * 100

        const yOffset =
          Math.cos(scroll / 120 + index * 0.6) * 35

        blob.style.transform = `translate(${xOffset}px, ${yOffset}px)`
        blob.style.transition = 'transform 1.2s ease-out'
      })

      requestId = requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(requestId)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-colors duration-500">
      <div className="absolute inset-0">
        {/* kiri atas */}
        <div
          ref={(ref) => {
            blobRefs.current[0] = ref
          }}
          className="absolute top-10 left-10 w-40 h-40 md:w-56 md:h-56 rounded-full bg-[var(--blob-color-1)] blur-[90px] opacity-[var(--blob-opacity-1)] transition-all duration-500"
        />

        {/* kanan atas */}
        <div
          ref={(ref) => {
            blobRefs.current[1] = ref
          }}
          className="absolute top-10 right-10 w-40 h-40 md:w-56 md:h-56 rounded-full bg-[var(--blob-color-2)] blur-[100px] opacity-[var(--blob-opacity-2)] transition-all duration-500"
        />

        {/* kiri bawah */}
        <div
          ref={(ref) => {
            blobRefs.current[2] = ref
          }}
          className="absolute bottom-10 left-10 w-44 h-44 md:w-60 md:h-60 rounded-full bg-[var(--blob-color-2)] blur-[110px] opacity-[var(--blob-opacity-1)] transition-all duration-500"
        />

        {/* kanan bawah */}
        <div
          ref={(ref) => {
            blobRefs.current[3] = ref
          }}
          className="absolute bottom-10 right-10 w-40 h-40 md:w-56 md:h-56 rounded-full bg-[var(--blob-color-1)] blur-[100px] opacity-[var(--blob-opacity-2)] transition-all duration-500"
        />
      </div>

      {/* GRID */}
      <div
        className="absolute inset-0 bg-[size:26px_26px] transition-all duration-500"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)',
        }}
      />
    </div>
  )
}

export default AnimatedBackground