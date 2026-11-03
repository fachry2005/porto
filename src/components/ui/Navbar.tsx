'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // 🔥 navbar muncul sekali aja
  const [showNavbar, setShowNavbar] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['home', 'about', 'portfolio', 'contact']

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (!section) continue

        const rect = section.getBoundingClientRect()

        if (rect.top <= 140 && rect.bottom >= 140) {
          setActiveSection(sectionId)
          break
        }
      }
    }

    handleResize()
    handleScroll()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 🔥 navbar animasi cuma pas refresh
  useEffect(() => {
    const navbarPlayed = sessionStorage.getItem('navbarPlayed')

    if (navbarPlayed) {
      setShowNavbar(true)
      return
    }

    const timer = setTimeout(() => {
      setShowNavbar(true)
      sessionStorage.setItem('navbarPlayed', 'true')
    }, 3800)

    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  const smoothScrollTo = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault()

    const target = document.querySelector(targetId)
    if (!target) return

    const navbarOffset = 3
    const targetPosition =
      target.getBoundingClientRect().top + window.scrollY - navbarOffset

    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    const duration = 1200

    let startTime: number | null = null

    const easeInOutCubic = (t: number) => {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime

      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)

      const ease = easeInOutCubic(progress)

      window.scrollTo({
        top: startPosition + distance * ease,
      })

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
    setOpen(false)
  }

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ opacity: 0, y: -40 }}
      animate={{
        opacity: showNavbar ? 1 : 0,
        y: showNavbar ? 0 : -40,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        position: 'fixed',
        top: 20,
        left: isMobile ? 20 : 60,
        right: isMobile ? 20 : 60,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 24px',
          width: '100%',
          borderRadius: 999,
          backgroundColor: scrolled
            ? 'var(--nav-bg-scrolled)'
            : 'var(--nav-bg-top)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <span
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
          }}
        >
          fachry.dev
        </span>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navItems.map((item) => {
              const isActive = activeSection === item.id

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
                  style={{
                    position: 'relative',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    color: isActive
                      ? 'var(--text-primary)'
                      : 'var(--text-secondary)',
                    textDecoration: 'none',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    paddingBottom: 4,
                    transition: '0.25s ease',
                  }}
                >
                  {item.label}

                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: 1,
                      background: 'var(--text-primary)',
                      transform: isActive
                        ? 'scaleX(1)'
                        : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </a>
              )
            })}

            {/* THEME TOGGLE BUTTON DESKTOP */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--button-secondary-bg)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {theme === 'dark' ? (
                <Sun size={15} className="text-yellow-400" />
              ) : (
                <Moon size={15} className="text-slate-700" />
              )}
            </button>
          </div>
        )}

        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--button-secondary-bg)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
              }}
            >
              {theme === 'dark' ? (
                <Sun size={14} className="text-yellow-400" />
              ) : (
                <Moon size={14} className="text-slate-700" />
              )}
            </button>

            <div
              onClick={() => setOpen(!open)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                cursor: 'pointer',
              }}
            >
              <span style={{ width: 20, height: 2, background: 'var(--text-primary)' }} />
              <span style={{ width: 20, height: 2, background: 'var(--text-primary)' }} />
              <span style={{ width: 20, height: 2, background: 'var(--text-primary)' }} />
            </div>
          </div>
        )}
      </div>

      {isMobile && open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            marginTop: 10,
            borderRadius: 16,
            background: 'var(--nav-bg-scrolled)',
            border: '1px solid var(--border)',
            backdropFilter: 'blur(12px)',
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => smoothScrollTo(e, `#${item.id}`)}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 13,
                  color: isActive
                    ? 'var(--text-primary)'
                    : 'var(--text-secondary)',
                }}
              >
                {item.label}
              </a>
            )
          })}
        </motion.div>
      )}
    </motion.nav>
  )
}