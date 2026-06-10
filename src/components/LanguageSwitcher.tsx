'use client'

type Props = {
  lang: 'pt' | 'en'
  onSwitch: (lang: 'pt' | 'en') => void
}

export default function LanguageSwitcher({ lang, onSwitch }: Props) {
  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={() => onSwitch(lang === 'pt' ? 'en' : 'pt')}
        className="text-sm border rounded-lg px-3 py-1 hover:bg-gray-50"
      >
        {lang === 'pt' ? '🇺🇸 EN' : '🇧🇷 PT'}
      </button>
    </div>
  )
}