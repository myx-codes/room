import { Star } from 'lucide-react'
import { useI18n } from '@/i18n'

type RatingInputProps = {
  value: number
  onChange: (value: number) => void
  max?: number
  disabled?: boolean
  className?: string
}

export function RatingInput({
  value,
  onChange,
  max = 5,
  disabled = false,
  className = '',
}: RatingInputProps) {
  const { t } = useI18n()

  return (
    <div
      className={`flex items-center gap-1 ${className}`.trim()}
      role="radiogroup"
      aria-label={t('common.rating')}
    >
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1
        const isActive = starValue <= value

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            className="p-1 rounded-lg hover:bg-muted/50 transition-colors disabled:cursor-not-allowed"
            aria-label={`${t('common.rating')} ${starValue}`}
            aria-checked={isActive}
            role="radio"
            disabled={disabled}
          >
            <Star className={`w-5 h-5 ${isActive ? 'text-gold fill-gold' : 'text-muted-foreground'}`} />
          </button>
        )
      })}
    </div>
  )
}
