import { Star } from 'lucide-react'
import { useI18n } from '@/i18n'

type RatingPreviewProps = {
  value: number
  count?: number
  className?: string
}

export function RatingPreview({ value, count, className = '' }: RatingPreviewProps) {
  const { t } = useI18n()

  if (typeof count === 'number') {
    const safeValue = Number.isFinite(value) ? value : 0
    const safeCount = Number.isFinite(count) ? Math.max(0, Math.round(count)) : 0

    return (
      <span className={`inline-flex items-center gap-1 text-sm ${className}`.trim()}>
        <Star className="w-4 h-4 fill-gold text-gold" />
        <span className="font-semibold text-foreground">{safeValue.toFixed(1)}</span>
        <span className="text-xs text-muted-foreground">({safeCount})</span>
      </span>
    )
  }

  return (
    <span className={`text-xs text-muted-foreground ${className}`.trim()}>
      {t('common.selected', { value })}
    </span>
  )
}
