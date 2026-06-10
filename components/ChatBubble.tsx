interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <span className="text-3xl flex-shrink-0">🎬</span>}
      <div
        className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-red-600 text-white rounded-br-none'
            : 'bg-gray-700 text-gray-100 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm">{content}</p>
      </div>
      {isUser && <span className="text-3xl flex-shrink-0">🧑</span>}
    </div>
  )
}
