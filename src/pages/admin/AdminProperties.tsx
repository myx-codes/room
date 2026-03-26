import { useState } from 'react'
import { properties } from '@/data/mockData'
import { Star, MapPin, Pencil, Trash2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function AdminProperties() {
  const [data] = useState(properties)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Properties</h2>
          <p className="text-sm text-muted-foreground mt-1">{data.length} total listings</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 gentle-animation">
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-6 py-4 font-medium text-muted-foreground">Property</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Category</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden sm:table-cell">Price</th>
              <th className="px-6 py-4 font-medium text-muted-foreground hidden lg:table-cell">Rating</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 gentle-animation">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link to={`/properties/${p.id}`}>
                      <img src={p.image} alt={p.title} className="w-12 h-12 rounded-lg object-cover" />
                    </Link>
                    <div>
                      <p className="font-medium text-foreground">{p.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="capitalize bg-muted px-2.5 py-1 rounded-full text-xs font-medium text-foreground">{p.category}</span>
                </td>
                <td className="px-6 py-4 hidden sm:table-cell font-medium text-foreground">${p.price}/night</td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="text-foreground">{p.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg gentle-animation"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                    <button className="p-2 hover:bg-destructive/10 rounded-lg gentle-animation"><Trash2 className="w-4 h-4 text-destructive" /></button>
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
