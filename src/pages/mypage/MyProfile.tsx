import { useState } from 'react'
import { User, Phone, Save } from 'lucide-react'
import { getMemberProfile } from '@/lib/auth'

export default function MyProfile() {
  const backendProfile = getMemberProfile()
  const [fullName, setFullName] = useState(backendProfile?.memberFullName || '')

  const memberNick = backendProfile?.memberNick || '-'
  const memberPhone = backendProfile?.memberPhone || '-'
  const memberType = backendProfile?.memberType || '-'
  const memberStatus = backendProfile?.memberStatus || '-'

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
            {backendProfile?.memberImage ? (
              <img src={backendProfile.memberImage} alt={memberNick} className="w-full h-full object-cover rounded-full" />
            ) : (
              <User className="w-8 h-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium text-foreground">{memberNick}</p>
            {typeof backendProfile?.memberRank === 'number' && (
              <p className="text-xs text-muted-foreground mt-1">Rank: {backendProfile.memberRank}</p>
            )}
            <button className="text-sm text-gold hover:underline mt-1">Change photo</button>
          </div>
        </div>

        {backendProfile?.memberDesc && (
          <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground">{backendProfile.memberDesc}</p>
            {typeof backendProfile.memberLikes === 'number' && (
              <p className="text-xs text-muted-foreground mt-2">Likes: {backendProfile.memberLikes}</p>
            )}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Member Nick</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <input value={memberNick} disabled className="bg-transparent text-foreground text-sm w-full outline-none opacity-70" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3 opacity-60">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <input value={memberPhone} disabled className="bg-transparent text-foreground text-sm w-full outline-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
            <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent text-foreground text-sm w-full outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Member Type</p>
              <p className="text-sm font-medium text-foreground">{memberType}</p>
            </div>
            <div className="bg-background border border-border rounded-xl px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Status</p>
              <p className="text-sm font-medium text-foreground">{memberStatus}</p>
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
