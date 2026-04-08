import { Star } from 'lucide-react'

type RatingPreviewProps = {
  value: number
  count?: number
  className?: string
}

export function RatingPreview({ value, count, className = '' }: RatingPreviewProps) {
  if (typeof count === 'number') {
    if (count <= 0) {
      return <span className={`text-xs text-muted-foreground ${className}`.trim()}></span>
    }

    return (
      <span className={`inline-flex items-center gap-1 text-sm ${className}`.trim()}>
        <Star className="w-4 h-4 fill-gold text-gold" />
        <span className="font-semibold text-foreground">{value.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({count} ta baho)</span>
      </span>
    )
  }

  return <span className={`text-xs text-muted-foreground ${className}`.trim()}>Tanlangan: {value}/5</span>
}
