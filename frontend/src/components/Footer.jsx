import { LeafIcon, InstagramIcon, TiktokIcon } from './icons.jsx'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#top" className="brand">
              <span className="brand-mark">
                <LeafIcon />
              </span>
              Xiaomimi Matcha
            </a>
            <p>
              Spesialis matcha premium — minuman segar & bubuk matcha ceremonial grade langsung dari
              Uji, Kyoto.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <InstagramIcon color="#4A4738" />
              </a>
              <a href="#" aria-label="TikTok">
                <TiktokIcon color="#4A4738" />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h5>Menu</h5>
            <a href="#menu">Minuman Signature</a>
            <a href="#flavor">Strawberry Matcha</a>
            <a href="#bubuk">Bubuk Matcha</a>
          </div>

          <div className="footer-col">
            <h5>Info</h5>
            <a href="#tentang">Tentang Kami</a>
            <a href="#tanya">Tanya Kami</a>
            <a href="#">Kebijakan Privasi</a>
          </div>

          <div className="footer-col">
            <h5>Berlangganan</h5>
            <p style={{ marginBottom: '10px' }}>Info rasa musiman & promo terbaru.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Email kamu" disabled />
              <a href="#" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '13px' }}>
                Kirim
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Xiaomimi Matcha. Semua hak cipta dilindungi.</span>
          <span>Dibuat sebagai proyek mockup desain.</span>
        </div>
      </div>
    </footer>
  )
}
