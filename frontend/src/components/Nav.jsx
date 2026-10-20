import { useState } from 'react'
import { NAV_LINKS } from '../data/data.js'
import { LeafIcon, BurgerIcon } from './icons.jsx'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-mark">
            <LeafIcon />
          </span>
          Xiaomimi Matcha
        </a>

        <nav className="nav-links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <a href="#menu" className="btn btn-primary">
            Pesan Sekarang
          </a>
          <button
            className="nav-toggle"
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <BurgerIcon />
          </button>
        </div>
      </div>

      <div className={'mobile-menu' + (open ? ' open' : '')}>
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a
          href="#menu"
          className="btn btn-primary mobile-menu-cta"
          onClick={() => setOpen(false)}
        >
          Pesan Sekarang
        </a>
      </div>
    </header>
  )
}
