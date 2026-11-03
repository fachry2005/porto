'use client'

import { motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  title: string
  description: string
  index: number
  id?: string
  image?: string
  live_url?: string
}

export default function PortfolioCard({
  title,
  description,
  index,
  id,
  image,
  live_url,
}: Props) {
  const router = useRouter()

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: index % 2 === 0 ? -50 : 50,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.75,
        delay: index * 0.06,
      }}
      whileHover={{ y: -4 }}
      className="group relative rounded-[26px] border border-[var(--border)] bg-[var(--bg-card)] p-4 backdrop-blur-xl flex flex-col min-h-[270px] transition-all duration-300 shadow-[var(--card-shadow)]"
    >
      <div className="w-full h-36 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)] mb-3">
        {image ? (
          <img
            src={image}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[var(--bg-secondary)]" />
        )}
      </div>

      <h3 className="text-[17px] font-semibold mb-2 leading-tight text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-2 min-h-[38px]">
        {description}
      </p>

      <div className="mt-auto pt-4 flex items-center justify-between">
        {live_url ? (
          <a
            href={live_url}
            target="_blank"
            className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all"
          >
            Live Demo
            <ArrowUpRight size={14} />
          </a>
        ) : (
          <div className="text-[13px] text-[var(--text-muted)]">
            No Link
          </div>
        )}

        {id && (
          <button
            onClick={() =>
              router.push(`/portfolio/${id}`)
            }
            className="px-4 py-2 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-80 border border-[var(--border)] transition-all flex items-center gap-2 text-[13px] text-[var(--text-primary)]"
          >
            Details
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </motion.div>
  )
}