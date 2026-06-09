'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const texts = {
  pt: {
    title: 'Bem-vindo',
    subtitle: 'Digite seu telefone com código do país e DDD',
    placeholder: '5511999999999',
    button: 'Entrar',
    loading: 'Verificando...',
    error: 'Número não encontrado. Verifique e tente novamente.',
  },
  en: {
    title: 'Welcome',
    subtitle: 'Enter your phone number with country code and area code',
    placeholder: '5511999999999',
    button: 'Continue',
    loading: 'Verifying...',
    error: 'Number not found. Please check and try again.',
  },
}

export default function SignInPage() {
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [lang, setLang] = useState<'pt' | 'en'>('pt')
  const router = useRouter()

  useEffect(() => {
    const language = sessionStorage.getItem('language') as 'pt' | 'en'
    if (!language) router.push('/')
    else setLang(language)
  }, [router])

  const text = texts[lang]

  async function handleSubmit() {
    setLoading(true)
    setError('')

    const digits = phone.replace(/\D/g, '')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: digits }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(text.error)
      setLoading(false)
      return
    }

    sessionStorage.setItem('guest', JSON.stringify({ ...data.guest, language: lang }))

    await fetch('/api/auth/language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId: data.guest.id, language: lang }),
    })

    router.push('/home')
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-center">{text.title}</h1>
        <p className="text-center text-gray-500">{text.subtitle}</p>

        <input
          type="tel"
          placeholder={text.placeholder}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && phone && handleSubmit()}
          className="w-full border rounded-lg px-4 py-3 text-lg"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !phone}
          className="w-full bg-black text-white rounded-lg px-4 py-3 text-lg disabled:opacity-50"
        >
          {loading ? text.loading : text.button}
        </button>
      </div>
    </main>
  )
}