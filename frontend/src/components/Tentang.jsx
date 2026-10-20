import { IMAGES, FEATURES } from '../data/data.js'

export default function Tentang() {
  return (
    <section id="tentang">
      <div className="wrap tentang-grid">
        <img src={IMAGES.usucha} alt="Mangkuk matcha tradisional dan whisk bambu di atas meja kayu" />
        <div>
          <span className="eyebrow">Tentang Kami</span>
          <h2>Cerita di Balik Xiaomimi</h2>
          <p>
            Xiaomimi Matcha lahir dari kecintaan pada upacara minum teh Jepang. Kami bekerja sama
            dengan petani di Uji, Kyoto, untuk memastikan setiap gram bubuk yang sampai ke cangkirmu
            digiling dari daun termuda yang dipetik di musim semi.
          </p>
          <p>
            “Xiaomimi” terinspirasi dari suara lembut daun teh yang digiling perlahan — pelan,
            sabar, dan penuh perhatian, persis seperti cara kami meracik setiap minuman.
          </p>
          <ul className="feature-list">
            {FEATURES.map((f) => (
              <li key={f}>
                <span className="tick">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
