import { ArrowIcon } from './icons.jsx'

export default function Tanya() {
  const handleOpenChat = () => {
    window.dispatchEvent(new CustomEvent('open-matcha-chat'))
  }

  return (
    <section id="tanya">
      <div className="tanya-section">
        <div>
          <span className="tanya-badge">✨ Asisten RAG AI Aktif</span>
          <h2>Ada Pertanyaan Seputar Matcha Kami?</h2>
          <p>
            Asisten AI cerdas berbasis RAG kami siap menjawab pertanyaan seputar menu,
            rekomendasi minuman, perbedaan grade bubuk matcha Uji, hingga informasi pemesanan secara langsung!
          </p>
        </div>
        <button
          type="button"
          className="tanya-hint"
          onClick={handleOpenChat}
          aria-label="Buka asisten chat AI"
        >
          Tanya Asisten AI Sekarang
          <ArrowIcon />
        </button>
      </div>
    </section>
  )
}
