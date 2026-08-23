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
        className="flex items-center gap-1 border rounded-full px-1 py-1 btn-pop"
      >
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
          lang === 'pt' ? 'bg-white text-black' : 'text-gray-400'
        }`}>
          🇧🇷 PT
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-200 ${
          lang === 'en' ? 'bg-white text-black' : 'text-gray-400'
        }`}>
          🇺🇸 EN
        </span>
      </button>
    </div>
  )
}