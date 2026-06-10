'use client'

import { useState, useEffect, useRef } from 'react'
import { chatAPI } from '@/lib/api'
import ChatBubble from '@/components/ChatBubble'
import { useAuthStore } from '@/store/auth'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatbotPage() {
  const { user } = useAuthStore()

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Bonjour 👋 Je suis CineIA. Quel film ou série souhaites-tu explorer aujourd'hui ?",
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const chatHistory: [string, string][] = []

      // CORRECTION DU BUG DE L'HISTORIQUE : On parcourt proprement les messages
      // pour coupler chaque message 'user' avec la réponse 'assistant' qui le suit directement.
      for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === 'user' && messages[i + 1]?.role === 'assistant') {
          chatHistory.push([
            messages[i].content,
            messages[i + 1].content
          ])
        }
      }

      // Ton front envoie le tableau 'chatHistory' propre que ton FastAPI transformera en 'history_text'
      const response = await chatAPI.sendMessage(
        input,
        user?.id || 1,
        chatHistory
      )

      setMessages([
        ...newMessages,
        { role: 'assistant', content: response.answer },
      ])
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content:
            "Désolé 😕 une erreur est survenue. Réessaie dans un instant.",
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-black via-gray-950 to-black text-white overflow-hidden">

      {/* HEADER */}
      <div className="px-6 py-5 border-b border-white/10 backdrop-blur-md bg-black/40">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
          🧠 CineIA
        </h1>

        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Ton assistant cinéma intelligent
        </p>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-800">

        {messages.map((msg, i) => (
          <div
            key={i}
            className="transition-all duration-200 animate-fadeIn"
          >
            <ChatBubble role={msg.role} content={msg.content} />
          </div>
        ))}

        {loading && (
          <div className="opacity-80">
            <ChatBubble
              role="assistant"
              content="🎬 CineMatch réfléchit..."
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div className="border-t border-white/10 bg-black/60 backdrop-blur-xl p-3 md:p-4">

        <div className="flex items-center gap-3 max-w-4xl mx-auto">

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage()
            }}
            placeholder="Pose une question sur le cinéma..."
            disabled={loading}
            className="
              flex-1
              px-4 py-3
              rounded-2xl
              bg-white/5
              border border-white/10
              text-white
              placeholder-gray-500
              focus:outline-none
              focus:ring-2 focus:ring-red-500/60
              transition
              disabled:opacity-50
              backdrop-blur-md
            "
          />

          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className={`
              px-5 py-3 rounded-2xl font-semibold transition
              flex items-center justify-center
              min-w-[90px]

              ${loading || !input.trim()
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90'
              }
            `}
          >
            {loading ? '...' : 'Envoyer'}
          </button>
        </div>

        {/* micro hint UX */}
        <div className="text-center text-[11px] text-gray-500 mt-2">
          Appuie sur Entrée pour envoyer
        </div>
      </div>
    </div>
  )
}