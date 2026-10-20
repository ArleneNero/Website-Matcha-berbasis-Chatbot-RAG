import { motion } from 'framer-motion'
import { IMAGES, STATS, EASE_OUT_EXPO } from '../data/data.js'

/**
 * Hero "text-behind-image" ala Apple:
 *  - lapis 1: kata raksasa MATCHA (gradient hijau)
 *  - lapis 2: cutout cup Signature Matcha (OG) yang menimpa kata
 *  - lapis 3: CTA + catatan di depan semuanya
 * Cup meluncur masuk dari kanan sekali saat halaman dibuka (Framer Motion).
 */
export default function HeroSignature() {
  return (
    <section className="hero-og" id="top">
      <div className="hero-og-inner">
        <motion.span
          className="hero-eyebrow"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05, ease: 'easeOut' }}
        >
          Xiaomimi Signature
        </motion.span>

        <motion.span
          className="hero-script"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          Signature
        </motion.span>

        <div className="hero-stage">
          <motion.h1
            className="hero-word"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            MATCHA
          </motion.h1>

          <div className="hero-cup-spacer" />

          {/* Wrapper menangani penempatan (translateX -50%) agar Framer Motion
              bebas menganimasikan properti x pada gambar di dalamnya. */}
          <div className="hero-cup-wrap">
            <motion.img
              className="hero-cup"
              src={IMAGES.signature}
              alt="Iced matcha latte Signature Xiaomimi dalam cup bening dengan sedotan kertas"
              initial={{ opacity: 0, x: 240 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
            />
          </div>
        </div>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
        >
          <a href="#menu" className="btn btn-primary">
            Pesan Sekarang
          </a>
          <a href="#menu" className="hero-link">
            Lihat menu ›
          </a>
        </motion.div>

        <p className="hero-note">Ceremonial grade, diseduh segar setiap pagi.</p>
      </div>

      <div className="stats-strip">
        <div className="wrap">
          {STATS.map((stat) => (
            <div className="stat" key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
