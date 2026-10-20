export function LeafIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 14C4 8 8 4 14 4C20 4 20 10 20 10C20 16 16 20 10 20C4 20 4 14 4 14Z"
        fill="currentColor"
      />
      <path d="M6 18C10 14 14 10 19 5" stroke="#4F7A3D" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function BurgerIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 6H20M4 12H20M4 18H20" stroke="#2B2A25" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function InstagramIcon({ color = '#2B2A25' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill={color} />
    </svg>
  )
}

export function TiktokIcon({ color = '#2B2A25' }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M16 3c.3 2.1 1.8 3.6 4 3.9v3c-1.5 0-2.9-.4-4-1.2v6.1a5.2 5.2 0 1 1-5.2-5.2c.3 0 .6 0 .9.1v3.1a2.1 2.1 0 1 0 1.5 2V3h2.8z"
        fill={color}
      />
    </svg>
  )
}

export function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19M19 12L13 6M19 12L13 18"
        stroke="#8AAE6C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M4 20L20 12L4 4L4 10L14 12L4 14L4 20Z" fill="white" />
    </svg>
  )
}

export function StampBadge() {
  return (
    <div className="stamp-badge">
      <svg viewBox="0 0 200 200" className="stamp-rotate">
        <defs>
          <path id="circlePath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text
          fontSize="11.5"
          letterSpacing="2"
          fill="#4A4738"
          fontFamily="Raleway, sans-serif"
          fontWeight="700"
        >
          <textPath href="#circlePath">
            100% ALAMI • TANPA GULA RAFINASI • SMALL BATCH •{' '}
          </textPath>
        </text>
      </svg>
      <div className="stamp-center">🍓</div>
    </div>
  )
}
