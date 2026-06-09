'use client'

import { useRouter } from 'next/navigation'

export default function LanguagePage() {
  const router = useRouter()

  function selectLanguage(lang: 'pt' | 'en') {
    sessionStorage.setItem('language', lang)
    router.push('/signin')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-center">Escolha o idioma</h1>
        <p className="text-center text-gray-500">Choose your language</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => selectLanguage('pt')}
            className="w-full border-2 rounded-lg px-4 py-4 text-lg hover:bg-gray-50"
          >
            🇧🇷 Português
          </button>
          <button
            onClick={() => selectLanguage('en')}
            className="w-full border-2 rounded-lg px-4 py-4 text-lg hover:bg-gray-50"
          >
            🇺🇸 English
          </button>
        </div>
      </div>
    </main>
  )
}