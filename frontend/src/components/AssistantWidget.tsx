import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { api } from "../services/axiosInstance"

interface Message {
  role: "user" | "assistant"
  content: string
}

const AssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const res = await api.post("/api/assistant/chat", {
        message: userMessage.content,
        history: messages
      })
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }])
    } catch (error: any) {
      console.log(error)
      const isUnauthorized = error?.response?.status === 401
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isUnauthorized
            ? "Please log in to use this feature."
            : "Something went wrong. Please try again."
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="mb-3 flex h-[420px] w-[320px] flex-col overflow-hidden rounded-md border border-[#e5ddc9] bg-[#faf8f2] shadow-[0_16px_48px_-12px_rgba(24,60,50,0.28)]">
          <div className="flex items-center justify-between border-b border-[#e5ddc9] bg-[#183c32] px-4 py-3.5">
            <p className="text-sm font-medium text-white">Marketly Assistant</p>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <p className="text-sm text-[#8a7a5c]">
                Ask me about products, prices, or how the store works.
              </p>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] break-words rounded-md px-3.5 py-2.5 text-sm leading-6 ${
                    m.role === "user"
                      ? "bg-[#183c32] text-white"
                      : "border border-[#e5ddc9] bg-white text-[#182420]"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none overflow-x-auto prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-[#183c32] prose-table:text-xs">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.content}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && <p className="text-sm text-[#8a7a5c]">Thinking...</p>}

            <div ref={scrollRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-[#e5ddc9] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 rounded-md border border-[#d8cfb6] bg-white px-3 py-2 text-sm outline-none focus:border-[#183c32]"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-md bg-[#183c32] px-3.5 py-2 text-sm text-white transition hover:bg-[#102e27] disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#183c32] text-2xl text-white shadow-[0_12px_32px_-8px_rgba(24,60,50,0.4)] transition hover:bg-[#102e27]"
        >
          💬
        </button>
      )}
    </div>
  )
}

export default AssistantWidget