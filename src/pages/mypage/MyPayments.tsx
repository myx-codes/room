import { CreditCard, Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useI18n } from '@/i18n'

type SavedCard = {
  id: string
  brand: string
  last4: string
  expiry: string
}

const CARD_STORAGE_KEY = 'roomi_saved_cards'

function detectCardBrand(cardNumber: string): string {
  if (/^4/.test(cardNumber)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(cardNumber)) return 'Mastercard'
  if (/^3[47]/.test(cardNumber)) return 'American Express'
  if (/^6(?:011|5)/.test(cardNumber)) return 'Discover'
  return 'Card'
}

function readSavedCards(): SavedCard[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(CARD_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function MyPayments() {
  const { t } = useI18n()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [cards, setCards] = useState<SavedCard[]>(readSavedCards)

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(cards))
  }, [cards])

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    const digits = cardNumber.replace(/\D/g, '')
    const cleanExpiry = expiry.trim()
    const cleanCvv = cvv.replace(/\D/g, '')

    if (digits.length < 12 || digits.length > 19) {
      setSubmitError(t('myPage.invalidCardNumber'))
      return
    }

    if (!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(cleanExpiry)) {
      setSubmitError(t('myPage.invalidExpiry'))
      return
    }

    if (cleanCvv.length < 3 || cleanCvv.length > 4) {
      setSubmitError(t('myPage.invalidCvv'))
      return
    }

    const detectedBrand = detectCardBrand(digits)
    const brand = detectedBrand === 'Card' ? t('common.card') : detectedBrand
    const next: SavedCard = {
      id: crypto.randomUUID(),
      brand,
      last4: digits.slice(-4),
      expiry: cleanExpiry,
    }

    setCards((prev) => [next, ...prev])
    setCardNumber('')
    setExpiry('')
    setCvv('')
    setIsAddOpen(false)
  }

  const handleRemoveCard = (id: string) => {
    setCards((prev) => prev.filter((card) => card.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{t('myPage.paymentMethods')}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t('myPage.manageSavedCards')}</p>
        </div>
        <button
          onClick={() => {
            setIsAddOpen(true)
            setSubmitError('')
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation"
        >
          <Plus className="w-4 h-4" />
          {t('common.addCard')}
        </button>
      </div>

      {isAddOpen && (
        <div className="mb-6 max-w-2xl bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-foreground">{t('myPage.addCardTitle')}</h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="p-1.5 rounded-lg hover:bg-muted gentle-animation"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleAddCard} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-3">
              <label className="text-sm text-foreground mb-1.5 block">{t('common.cardNumber')}</label>
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">{t('common.expiry')}</label>
              <input
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-foreground mb-1.5 block">{t('common.cvv')}</label>
              <input
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation"
              >
                {t('common.saveCard')}
              </button>
            </div>

            {submitError && (
              <p className="md:col-span-3 text-sm text-destructive">{submitError}</p>
            )}
          </form>
        </div>
      )}

      <div className="space-y-4 max-w-2xl">
        {cards.length === 0 && (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <p className="text-muted-foreground">{t('common.noSavedCards')}</p>
          </div>
        )}

        {cards.map((card) => (
          <div key={card.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{card.brand} •••• {card.last4}</p>
              <p className="text-xs text-muted-foreground">{t('myPage.expires', { value: card.expiry })}</p>
            </div>
            <button onClick={() => handleRemoveCard(card.id)} className="text-sm text-destructive hover:underline">{t('common.remove')}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
