import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // fetchMessages déclaré AVANT useEffect
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/messages`)
      setMessages(res.data)
    } catch (err) {
      console.error('Erreur chargement messages:', err)
    }
  }

 useEffect(() => {
  let cancelled = false

  const load = async () => {
    try {
      const res = await axios.get(`${API_URL}/messages`)
      if (!cancelled) setMessages(res.data)
    } catch (err) {
      console.error('Erreur chargement messages:', err)
    }
  }

  load()

  return () => { cancelled = true }
}, [])

  const sendMessage = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      await axios.post(`${API_URL}/messages`, { content: input })
      setInput('')
      fetchMessages()
    } catch (err) {
      console.error('Erreur envoi message:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>DevOps TP — EFREI M1</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Écris un message..."
          style={{ flex: 1, padding: '8px', fontSize: '16px' }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? '...' : 'Envoyer'}
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {messages.map(msg => (
          <li key={msg.id} style={{
            padding: '12px',
            marginBottom: '8px',
            background: '#f0f0f0',
            borderRadius: '6px'
          }}>
            <strong>#{msg.id}</strong> — {msg.content}
            <span style={{ float: 'right', color: '#999', fontSize: '12px' }}>
              {new Date(msg.created_at).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App