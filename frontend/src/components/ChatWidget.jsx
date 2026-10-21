import { useState, useRef, useEffect } from 'react'
import Markdown from 'react-markdown'
import { CHAT_MESSAGES } from '../data/data.js'
import { sendChatMessage } from '../services/chatService.js'
import { SendIcon } from './icons.jsx'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(CHAT_MESSAGES)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (open) {
      scrollToBottom()
    }
  }, [messages, open, loading])

  useEffect(() => {
    const handleExternalOpen = () => setOpen(true)
    window.addEventListener('open-matcha-chat', handleExternalOpen)
    return () => window.removeEventListener('open-matcha-chat', handleExternalOpen)
  }, [])

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim()
    if (!query || loading) return

    const userMsg = { from: 'user', text: query }
    const updatedMessages = [...messages, userMsg]

    setMessages(updatedMessages)
    if (!textToSend) setInput('')
    setLoading(true)

    try {
      const data = await sendChatMessage(updatedMessages)
      setMessages([...updatedMessages, { from: 'bot', text: data.text }])
    } catch (err) {
      console.error('Failed to query AI API:', err)
      setMessages([
        ...updatedMessages,
        {
          from: 'bot',
          text:
            err.message ||
            'Maaf, sedang ada kendala jaringan saat ini. Silakan coba lagi sebentar lagi 🍵',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const quickQuestions = [
    'Beda Ceremonial & Culinary grade?',
    'Menu recommended apa?',
    'Berapa harga Strawberry Matcha?',
  ]

  return (
    <div className="chat-widget">
      <div className={'chat-panel' + (open ? '' : ' hidden')}>
        <div className="chat-header">
          <div className="chat-avatar">🍵</div>
          <div className="chat-header-text">
            <b>Xiaomimi Assistant</b>
            <span className="online">Aktif</span>
          </div>
          <button className="chat-close" aria-label="Tutup chat" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div className={'msg ' + m.from} key={i}>
              {m.from === 'bot' ? (
                <div className="markdown-body">
                  <Markdown>{m.text}</Markdown>
                </div>
              ) : (
                m.text
              )}
            </div>
          ))}
          {loading && (
            <div className="msg bot typing-indicator">
              <span>🍵 Xiaomimi Assistant sedang mengetik...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions chips */}
        <div className="chat-quick-chips">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              className="chat-chip"
              disabled={loading}
              onClick={() => handleSend(q)}
            >
              {q}
            </button>
          ))}
        </div>

        <form
          className="chat-input-row"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <div className="chat-input-wrap">
            <input
              type="text"
              placeholder="Tulis pertanyaan seputar matcha..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              type="submit"
              className={'chat-send' + (input.trim() && !loading ? ' active' : '')}
              aria-label="Kirim"
              disabled={!input.trim() || loading}
            >
              <SendIcon />
            </button>
          </div>
          <div className="chat-status-note">
            ✨ Asisten AI siap menjawab pertanyaan seputar menu kami.
          </div>
        </form>
      </div>

      <button
        className="chat-bubble-btn"
        aria-label="Buka chat"
        onClick={() => setOpen((v) => !v)}
      >
        🍵
      </button>
    </div>
  )
}
