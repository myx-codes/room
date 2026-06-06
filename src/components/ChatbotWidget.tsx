import { useEffect, useMemo, useRef, useState } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { Bot, Loader2, MessageSquare, Send, Sparkles, X } from 'lucide-react'
import { ENSURE_CHAT_THREAD, SEND_CHAT_MESSAGE } from '@/graphql/chat'
import { getMemberProfile } from '@/lib/auth'
import { useI18n } from '@/i18n'

type ChatSenderType = 'USER' | 'ASSISTANT' | 'SYSTEM'

type ChatMessage = {
  _id: string
  threadId: string
  senderType: ChatSenderType
  content: string
  createdAt: string
  updatedAt: string
}

type ChatThread = {
  _id: string
  memberId?: string | null
  sessionId?: string | null
  propertyId?: string | null
  title: string
  status: string
  lastMessageAt: string
  createdAt: string
  updatedAt: string
  messages?: ChatMessage[]
}

type EnsureChatThreadResponse = {
  ensureChatThread: ChatThread
}

type EnsureChatThreadVariables = {
  input: {
    sessionId: string
    propertyId?: string | null
    title?: string | null
    language?: string
  }
}

type SendChatMessageResponse = {
  sendChatMessage: {
    thread: ChatThread
    userMessage: ChatMessage
    assistantMessage: ChatMessage
    messageCount: number
  }
}

type SendChatMessageVariables = {
  input: {
    sessionId: string
    propertyId?: string | null
    threadId?: string | null
    message: string
    language?: string
  }
}

type ChatBubbleProps = {
  senderType: ChatSenderType
  content: string
  createdAt?: string
}

const CHAT_SESSION_KEY = 'roomi_chat_session_id'

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return `session-${Date.now()}`
  }

  const existing = window.localStorage.getItem(CHAT_SESSION_KEY)
  if (existing) return existing

  const generated =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `session-${Date.now()}-${Math.random().toString(16).slice(2)}`

  window.localStorage.setItem(CHAT_SESSION_KEY, generated)
  return generated
}

function usePropertyChatContext(): string | null {
  const location = useLocation()

  return useMemo(() => {
    const match = matchPath('/properties/:id', location.pathname)
    return match?.params?.id ?? null
  }, [location.pathname])
}

function ChatBubble({ senderType, content }: ChatBubbleProps) {
  const isAssistant = senderType !== 'USER'

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
          isAssistant
            ? 'bg-muted text-foreground border border-border'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {content}
      </div>
    </div>
  )
}

export function ChatbotWidget() {
  const { language } = useI18n()
  const location = useLocation()
  const propertyId = usePropertyChatContext()
  const [open, setOpen] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [thread, setThread] = useState<ChatThread | null>(null)
  const [message, setMessage] = useState('')
  const [initializing, setInitializing] = useState(false)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [ensureChatThread] = useMutation<EnsureChatThreadResponse, EnsureChatThreadVariables>(ENSURE_CHAT_THREAD)
  const [sendChatMessage] = useMutation<SendChatMessageResponse, SendChatMessageVariables>(SEND_CHAT_MESSAGE)

  useEffect(() => {
    setSessionId(getOrCreateSessionId())
  }, [])

  useEffect(() => {
    if (!open || !sessionId) return

    let cancelled = false
    const initialize = async () => {
      setInitializing(true)
      setError('')

      try {
        const payload = {
          sessionId,
          propertyId: propertyId ?? null,
          title: propertyId ? 'Property support chat' : 'ROOMi support',
          language,
        }

        const { data } = await ensureChatThread({
          variables: { input: payload },
        })

        if (!cancelled) {
          setThread(data?.ensureChatThread ?? null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Chat bot is unavailable right now.')
        }
      } finally {
        if (!cancelled) {
          setInitializing(false)
        }
      }
    }

    void initialize()
    return () => {
      cancelled = true
    }
  }, [ensureChatThread, open, propertyId, sessionId, refreshKey])

  useEffect(() => {
    if (!open) return
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [open, thread?.messages?.length])

  useEffect(() => {
    const authEvent = 'roomi-auth-changed'
    const syncThread = () => {
      if (!open || !sessionId) return
      setThread(null)
      setRefreshKey((value) => value + 1)
    }

    window.addEventListener(authEvent, syncThread)
    return () => window.removeEventListener(authEvent, syncThread)
  }, [open, sessionId])

  const messages = thread?.messages ?? []
  const hasMessages = messages.length > 0
  const title = propertyId ? 'Property Assistant' : 'ROOMi Assistant'
  const memberProfile = getMemberProfile()

  const headerSubtitle = useMemo(() => {
    if (propertyId) return 'Pricing, availability and booking help for this property.'
    if (memberProfile?.memberNick) return `Welcome back, ${memberProfile.memberNick}.`
    return 'Ask about listings, booking or weekend pricing.'
  }, [memberProfile?.memberNick, propertyId])

  const handleSend = async () => {
    const clean = message.trim()
    if (!clean || !sessionId || pending) return

    setPending(true)
    setError('')

    try {
      const { data } = await sendChatMessage({
        variables: {
          input: {
            sessionId,
            propertyId: propertyId ?? null,
            threadId: thread?._id ?? null,
            message: clean,
            language,
          },
        },
      })

      const nextThread = data?.sendChatMessage?.thread ?? null
      if (nextThread) {
        setThread(nextThread)
        setMessage('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80]">
      {open ? (
        <div className="mb-3 w-[min(92vw,390px)] overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-black/10 backdrop-blur">
          <div className="flex items-start justify-between gap-4 border-b border-border bg-[linear-gradient(135deg,rgba(217,176,93,0.16),rgba(255,255,255,0.02))] px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-primary/10 p-2 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground">{headerSubtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4">
            {initializing ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Preparing your assistant...
              </div>
            ) : hasMessages ? (
              messages.map((item) => (
                <ChatBubble key={item._id} senderType={item.senderType} content={item.content} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground">
                Ask me about price, availability, booking or weekend discounts.
              </div>
            )}
          </div>

          {error ? (
            <div className="px-4 pb-2 text-xs text-destructive">{error}</div>
          ) : null}

          <div className="border-t border-border p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-border bg-muted/40 p-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    void handleSend()
                  }
                }}
                rows={2}
                placeholder="Type your question..."
                className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => void handleSend()}
                disabled={pending || !message.trim()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-3 rounded-full bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02]"
      >
        <MessageSquare className="h-4 w-4" />
        {open ? 'Close assistant' : 'AI assistant'}
        <Bot className="h-4 w-4 opacity-80" />
      </button>
    </div>
  )
}
