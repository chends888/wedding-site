'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import BackgroundPhoto from '@/components/BackgroundPhoto'


const texts = {
  pt: {
    title: 'Pamella & Lucas',
    subtitle: 'Digite seu telefone com código do país e DDD',
    placeholder: '5511999999999',
    button: 'Entrar',
    loading: 'Verificando...',
    error: 'Número não encontrado. Verifique e tente novamente.',
  },
  en: {
    title: 'Pamella & Lucas',
    subtitle: 'Enter your phone number with country code and area code',
    placeholder: '5511999999999',
    button: 'Continue',
    loading: 'Verifying...',
    error: 'Number not found. Please check and try again.',
  },
}

export default function LoginPage() {
  const [lang, setLang] = useState<'pt' | 'en'>('pt')
  const [langKey, setLangKey] = useState(0)
  const [phone, setPhone] = useState('')
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const text = texts[lang]

  function handleLangSwitch(newLang: 'pt' | 'en') {
    setLang(newLang)
    setLangKey((k) => k + 1)
  }

  async function handleSubmit() {
    setHasError(false)
    setLoading(true)

    const digits = phone.replace(/\D/g, '')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: digits }),
    })

    const data = await res.json()

    if (!res.ok) {
      setHasError(true)
      setLoading(false)
      return
    }

    const detectedLang = (data.guest.language as 'pt' | 'en') || lang
    setLang(detectedLang)
    sessionStorage.setItem('guest', JSON.stringify({ ...data.guest, language: detectedLang }))

    await fetch('/api/auth/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId: data.guest.id, language: detectedLang }),
    })

    router.push('/home')
  }

  return (
    <main className="h-screen overflow-hidden flex items-center justify-center p-4 text-white">
      <BackgroundPhoto />
      {/* Language switcher */}
      <LanguageSwitcher lang={lang} onSwitch={handleLangSwitch} />

      <div key={langKey} className="animate-fade-switch w-full max-w-sm space-y-4">
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-8xl italic text-center leading-tight text-shadow-lg text-stroke-lg"
        >
          Pamella
          <br />
          &amp;
          <br />
          Lucas
        </h1>
        <p className="text-center text-gray-200 text-shadow text-stroke">{text.subtitle}</p>

        <input
          type="tel"
          placeholder={text.placeholder}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && !!phone && handleSubmit()}
          className="w-full border rounded-lg px-4 py-3 text-lg bg-transparent text-white placeholder-gray-400 border-white text-shadow text-stroke shadow-md shadow-black/50"        />

        {hasError && <p className="text-red-500 text-sm text-center text-stroke bold-text text-shadow">{text.error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !phone}
          className="w-full bg-white rounded-lg px-4 py-3 text-lg disabled:opacity-50 btn-pop text-stroke bold-text shadow-lg shadow-black/50"
        >
          {loading ? text.loading : text.button}
        </button>
      </div>
    </main>
  )
}