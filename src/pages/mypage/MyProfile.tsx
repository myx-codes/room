import { useState } from 'react'
import { User, Mail, Phone, Save } from 'lucide-react'

export default function MyProfile() {
  const [name, setName] = useState('John Smith')
  const [email] = useState('john@email.com')
  const [phone, setPhone] = useState('+998 90 123 4567')

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Profile Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">{name}</p>
            <button className="text-sm text-gold hover:underline mt-1">Change photo</button>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-foreground text-sm w-full outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3 opacity-60">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <input value={email} disabled className="bg-transparent text-foreground text-sm w-full outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent text-foreground text-sm w-full outline-none" />
            </div>
          </div>

          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
