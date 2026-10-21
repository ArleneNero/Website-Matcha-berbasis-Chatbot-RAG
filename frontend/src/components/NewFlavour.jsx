import { motion } from 'framer-motion'
import { IMAGES, EASE_OUT_EXPO } from '../data/data.js'
import { InstagramIcon, TiktokIcon, StampBadge } from './icons.jsx'

export default function NewFlavour() {
  return (
    <section id="flavor">
      <div className="flavour">
        <div className="flavour-topbar">
          <span className="flavour-icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 14C4 8 8 4 14 4C20 4 20 10 20 10C20 16 16 20 10 20C4 20 4 14 4 14Z"
                fill="#4F7A3D"
              />
            </svg>
          </span>
          <span className="flavour-icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="#2B2A25"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>

        <div className="flavour-body">
          <div className="flavour-visual">
            <motion.img
              src={IMAGES.strawberryCut}
              alt="Cup Strawberry Matcha dengan lapisan strawberry, susu, dan matcha hijau"
              initial={{ opacity: 0, x: 220 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.1, margin: "100px" }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            />
          </div>

          <div className="flavour-text">
            <span className="eyebrow">Rasa Baru</span>
            <h2>
              STRAWBERRY
              <br />
              MATCHA
            </h2>
            <h3>Matcha Ceremonial Grade Bertemu Strawberry Segar</h3>
            <p>
              Perpaduan pahit lembut matcha upacara dengan manis-asam strawberry segar, dilapis susu
              creamy tanpa gula rafinasi. Edisi musiman, tersedia selama panen strawberry sedang
              terbaik.
            </p>
            <a href="#menu" className="btn btn-primary">
              Pesan Strawberry Matcha
            </a>
          </div>
        </div>

        <div className="flavour-bottom">
          <div className="social-row">
            <span>Ikuti Racikan Terbaru</span>
            <div className="social-icons">
              <a href="#" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="TikTok">
                <TiktokIcon />
              </a>
            </div>
          </div>
          <StampBadge />
        </div>
      </div>
    </section>
  )
}
