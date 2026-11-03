'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react'
import usePortfolio from '@/hooks/usePortfolio'
import PortfolioCard from './PortfolioCard'

const smoothEase: [number, number, number, number] = [
  0.22,
  1,
  0.36,
  1,
]

export default function PortfolioShowcase() {
  const {
    projects,
    certificates,
    techStacks,
    loading,
  } = usePortfolio()

  const [activeTab, setActiveTab] =
    useState('projects')

  const [previewOpen, setPreviewOpen] =
    useState(false)

  const [previewImage, setPreviewImage] =
    useState('')

  const [showAllProjects, setShowAllProjects] =
    useState(false)

  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const displayedProjects = showAllProjects
    ? projects
    : projects.slice(0, 3)

  return (
    <>
      {/* PREVIEW */}
      <AnimatePresence>
        {previewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-md flex items-center justify-center px-6"
          >
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X size={18} />
            </button>

            <motion.img
              initial={{
                scale: 0.92,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.92,
                opacity: 0,
              }}
              transition={{ duration: 0.35 }}
              src={previewImage}
              className="max-w-[88vw] max-h-[88vh] rounded-3xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section
        id="portfolio"
        className="w-full max-w-[1450px] mx-auto px-8 md:px-12 lg:px-20 pt-24 pb-24 text-[var(--text-primary)]"
      >
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 45 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-[var(--text-primary)]">
            Portfolio Showcase
          </h1>

          <p className="text-[var(--text-secondary)] max-w-xl mx-auto text-sm md:text-base">
            Explore my journey through projects,
            certifications, and technical expertise.
          </p>
        </motion.div>

        {/* TAB */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-3xl rounded-full border border-[var(--border)] bg-[var(--bg-card)] p-2 flex gap-2 backdrop-blur-xl shadow-[var(--card-shadow)] transition-all">
            {[
              'projects',
              'certificates',
              'techstack',
            ].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)

                  if (tab !== 'projects') {
                    setShowAllProjects(false)
                  }
                }}
                className={`flex-1 rounded-full py-3 text-sm transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab === 'projects'
                  ? 'Projects'
                  : tab === 'certificates'
                  ? 'Certificates'
                  : 'Tech Stack'}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45 }}
          >
            {/* PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-8">
                <motion.div
                  layout
                  transition={{
                    layout: {
                      duration: 0.75,
                      ease: smoothEase,
                    },
                  }}
                  className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1"
                >
                  <AnimatePresence mode="popLayout">
                    {!loading &&
                      displayedProjects.map(
                        (item, i) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{
                              opacity: 0,
                              y: 40,
                              scale: 0.96,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: -30,
                              scale: 0.95,
                            }}
                            transition={{
                              duration: 0.55,
                              delay: i * 0.04,
                              ease: smoothEase,
                            }}
                          >
                            <PortfolioCard
                              index={i}
                              title={item.title}
                              description={
                                item.description
                              }
                              image={item.image_url}
                              live_url={item.live_url}
                              id={item.id}
                            />
                          </motion.div>
                        )
                      )}
                  </AnimatePresence>
                </motion.div>

                {/* SEE MORE / LESS */}
                {!loading &&
                  projects.length > 3 && (
                    <motion.div
                      layout
                      transition={{
                        duration: 0.6,
                        ease: smoothEase,
                      }}
                      className="flex justify-center"
                    >
                      <motion.button
                        layout
                        whileHover={{
                          scale: 1.04,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={() =>
                          setShowAllProjects(
                            !showAllProjects
                          )
                        }
                        className="px-6 py-3 rounded-full border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-xl text-sm text-[var(--text-primary)] hover:opacity-80 transition flex items-center gap-2 shadow-[var(--card-shadow)]"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={
                              showAllProjects
                                ? 'less'
                                : 'more'
                            }
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -8,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                            className="flex items-center gap-2"
                          >
                            {showAllProjects ? (
                              <>
                                <ChevronUp
                                  size={16}
                                />
                                See Less
                              </>
                            ) : (
                              <>
                                <ChevronDown
                                  size={16}
                                />
                                See More
                              </>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  )}
              </div>
            )}

            {/* CERTIFICATES */}
            {activeTab === 'certificates' && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
                {!loading &&
                  certificates.map((item, i) => {
                    const hasImage = item.image_url && !imgErrors[item.id]
                    return (
                      <motion.div
                        key={item.id}
                        initial={{
                          opacity: 0,
                          y: 25,
                          scale: 0.96,
                        }}
                        whileInView={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.04,
                        }}
                        whileHover={{ y: -4 }}
                        onClick={() => {
                          if (hasImage) {
                            setPreviewImage(item.image_url)
                            setPreviewOpen(true)
                          }
                        }}
                        className={`group rounded-[26px] border border-[var(--border)] bg-[var(--bg-card)] p-4 backdrop-blur-xl shadow-[var(--card-shadow)] transition-all duration-300 ${hasImage ? 'cursor-pointer' : 'cursor-default'}`}
                      >
                        {/* IMAGE / PLACEHOLDER */}
                        <div className="rounded-2xl overflow-hidden border border-[var(--border)] h-56 bg-[var(--bg-secondary)] flex items-center justify-center">
                          {hasImage ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                              onError={() =>
                                setImgErrors((prev) => ({
                                  ...prev,
                                  [item.id]: true,
                                }))
                              }
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
                              <Award size={40} strokeWidth={1.2} />
                              <span className="text-xs">Certificate Preview</span>
                            </div>
                          )}
                        </div>

                        <h3 className="mt-4 text-[15px] font-semibold text-center text-[var(--text-primary)]">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="mt-1.5 text-xs text-center text-[var(--text-secondary)]">
                            {item.subtitle}
                          </p>
                        )}
                        {item.credential_id && (
                          <p className="mt-1 text-[10px] text-center text-[var(--text-muted)]">
                            Credential ID: {item.credential_id}
                          </p>
                        )}
                        {item.skills && (
                          <p className="mt-2.5 text-[11px] text-center text-[var(--text-muted)] leading-relaxed px-2">
                            <span className="font-medium text-[var(--text-secondary)]">Skills: </span>
                            {item.skills.replace(/^Skills:\s*/i, '')}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
              </div>
            )}

            {/* TECH STACK */}
{activeTab === 'techstack' && (
  <div className="min-h-[360px] flex justify-center">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 max-w-5xl w-full">
      {!loading &&
        techStacks?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.45,
              delay: index * 0.04,
            }}
            whileHover={{
              y: -5,
              scale: 1.04,
            }}
            className="group rounded-[24px] border border-[var(--border)] bg-[var(--bg-card)] backdrop-blur-xl flex flex-col items-center justify-center gap-3 h-[125px] w-[125px] mx-auto shadow-[var(--card-shadow)] transition-all duration-300"
          >
            <div className="relative flex items-center justify-center">
              {/* GLOW */}
              <div className="absolute w-[70px] h-[70px] rounded-full bg-blue-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

              {item.logo_url ? (
                <img
                  src={item.logo_url}
                  alt={item.name}
                  className="relative z-10 w-[56px] h-[56px] object-contain"
                />
              ) : (
                <div className="relative z-10 w-[56px] h-[56px] rounded-2xl bg-[var(--bg-secondary)]" />
              )}
            </div>

            <p className="text-[11px] text-[var(--text-primary)] font-medium text-center leading-tight px-2 line-clamp-1">
              {item.name}
            </p>
          </motion.div>
        ))}
    </div>
  </div>
)}
          </motion.div>
        </AnimatePresence>
      </section>
    </>
  )
}
