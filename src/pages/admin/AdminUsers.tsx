import { users } from '@/data/mockData'
import { Shield, Ban, MoreVertical } from 'lucide-react'

export default function AdminUsers() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground">Users</h2>
        <p className="text-sm text-muted-foreground mt-1">{users.length} registered users</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-medium text-muted-foreground">User</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">Role</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Joined</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30 gentle-animation">
                <td className="px-6 py-4">
                  <p className="font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.role === 'admin' ? 'bg-gold/20 text-gold-dark' : u.role === 'agent' ? 'bg-primary/10 text-foreground' : 'bg-muted text-foreground'
                  }`}>
                    {u.role === 'admin' && <Shield className="w-3 h-3" />}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">{u.joinedAt}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-destructive/10 text-destructive'
                  }`}>{u.status}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-destructive/10 rounded-lg gentle-animation" title="Suspend">
                      <Ban className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg gentle-animation">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
