import { CreditCard, Plus } from 'lucide-react'

const cards = [
  { id: '1', brand: 'Visa', last4: '4242', expiry: '12/28' },
  { id: '2', brand: 'Mastercard', last4: '8888', expiry: '06/27' },
]

export default function MyPayments() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Payment Methods</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage your saved cards</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation">
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>

      <div className="space-y-4 max-w-2xl">
        {cards.map((card) => (
          <div key={card.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground">{card.brand} •••• {card.last4}</p>
              <p className="text-xs text-muted-foreground">Expires {card.expiry}</p>
            </div>
            <button className="text-sm text-destructive hover:underline">Remove</button>
          </div>
        ))}
      </div>
    </div>
  )
}
