import { IMAGES, VARIANTS } from '../data/data.js'

export default function Bubuk() {
  return (
    <section id="bubuk" className="bubuk-section">
      <div className="wrap">
        <div className="bubuk-showcase">
          <img src={IMAGES.powder} alt="Kaleng bubuk matcha Xiaomimi premium grade dengan sendok kayu" />
          <div>
            <span className="eyebrow">Bubuk Matcha</span>
            <h2>Bawa Pulang Rasa Kyoto</h2>
            <p>
              Diimpor langsung dari Uji, Kyoto, dan digiling perlahan dengan batu giling tradisional
              agar aroma serta warna hijaunya tetap terjaga.
            </p>
            <p>
              Tersedia dalam beberapa tingkatan dan campuran, mulai dari ceremonial grade untuk
              usucha hingga blend siap-seduh untuk latte harian.
            </p>
          </div>
        </div>

        <div className="variant-grid">
          {VARIANTS.map((v) => (
            <div className="variant-card" key={v.title}>
              <div className="variant-swatch" style={{ background: v.color }} />
              <div className="grams">{v.grams}</div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
              <span className="variant-price">{v.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
