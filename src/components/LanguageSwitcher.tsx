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
        className="relative flex items-center p-1 border border-white/40 rounded-full btn-pop bg-black/20"
      >
        {/* Sliding Highlight Pill */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full transition-transform duration-300 ease-out ${
            lang === 'pt' ? 'translate-x-0 left-1' : 'translate-x-full left-1'
          }`}
        />

        {/* PT Label */}
        <span
          className={`relative z-10 w-16 text-center py-0.5 rounded-full text-sm text-stroke bold-text transition-colors duration-300 ${
            lang === 'pt' ? 'text-white' : 'text-white hover:bg-white/10'
          }`}
        >
          🇧🇷 PT
        </span>

        {/* EN Label */}
        <span
          className={`relative z-10 w-16 text-center py-0.5 rounded-full text-sm text-stroke bold-text transition-colors duration-300 ${
            lang === 'en' ? 'text-white' : 'text-white hover:bg-white/10'
          }`}
        >
          🇺🇸 EN
        </span>
      </button>
    </div>
  )
}