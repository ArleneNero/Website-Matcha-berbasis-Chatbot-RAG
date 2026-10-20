import { MENU_CARDS, MENU_ROWS } from '../data/data.js'

export default function Menu() {
  return (
    <section id="menu">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Menu</span>
          <h2>Menu Minuman Signature</h2>
          <p>Diseduh langsung saat dipesan, dari bubuk ceremonial grade pilihan.</p>
        </div>

        <div className="menu-grid">
          {MENU_CARDS.map((item) => (
            <div className="menu-card" key={item.title}>
              <img src={item.image} alt={item.title} />
              <div className="menu-card-body">
                <span className="menu-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="menu-price">{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="menu-list">
          {MENU_ROWS.map((row) => (
            <div className="menu-row" key={row.title}>
              <div className="swatch" style={{ background: row.swatch }} />
              <div className="menu-row-text">
                <h4>{row.title}</h4>
                <p>{row.desc}</p>
              </div>
              <span className="menu-row-price">{row.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
