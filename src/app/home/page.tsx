'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Guest = {
  id: string
  name: string
  language: 'pt' | 'en'
  members: { id: string; name: string }[]
}

type RsvpStatus = Record<string, boolean | null>

const texts = {
  pt: {
    welcome: (name: string) => `Olá, ${name}!`,
    subtitle: 'Estamos felizes em ter você com a gente.',
    rsvpTitle: 'Confirmar presença',
    confirmedLabel: 'Confirmado',
    declinedLabel: 'Não vai',
    pendingLabel: 'Pendente',
    confirm: 'Confirmar',
    decline: 'Não vou',
    giftsTitle: 'Lista de presentes',
    giftsSubtitle: 'Sua presença é o melhor presente. Mas se quiser nos presentear, aqui estão algumas sugestões:',
    pixKey: 'Chave PIX',
    copy: 'Copiar',
    copied: 'Copiado!',
    saving: 'Salvando...',
  },
  en: {
    welcome: (name: string) => `Hi, ${name}!`,
    subtitle: 'We are so happy to have you with us.',
    rsvpTitle: 'RSVP',
    confirmedLabel: 'Confirmed',
    declinedLabel: 'Not attending',
    pendingLabel: 'Pending',
    confirm: 'Confirm',
    decline: 'Decline',
    giftsTitle: 'Gift list',
    giftsSubtitle: 'Your presence is the best gift. But if you would like to give us something, here are some suggestions:',
    pixKey: 'PIX key',
    copy: 'Copy',
    copied: 'Copied!',
    saving: 'Saving...',
  },
}

const gifts = [
  { id: '1', namePt: 'Jantar romântico', nameEn: 'Romantic dinner', value: 150 },
  { id: '2', namePt: 'Jogo de panelas', nameEn: 'Cookware set', value: 300 },
  { id: '3', namePt: 'Contribuição para lua de mel', nameEn: 'Honeymoon contribution', value: 500 },
]

const PIX_KEY = 'seu-pix@email.com'

export default function HomePage() {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [rsvp, setRsvp] = useState<RsvpStatus>({})
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('guest')
    if (!stored) {
      router.push('/')
      return
    }
    const g = JSON.parse(stored) as Guest
    setGuest(g)
    fetchRsvp(g)
  }, [router])

  async function fetchRsvp(g: Guest) {
    const ids = g.members.map((m) => m.id)
    const res = await fetch(`/api/rsvp?ids=${ids.join(',')}`)
    const data = await res.json()
    const status: RsvpStatus = {}
    for (const id of ids) {
      const found = data.rsvps?.find((r: { guest_id: string; confirmed: boolean }) => r.guest_id === id)
      status[id] = found ? found.confirmed : null
    }
    setRsvp(status)
  }

  async function handleRsvp(guestId: string, confirmed: boolean) {
    setSaving(true)
    await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId, confirmed }),
    })
    setRsvp((prev) => ({ ...prev, [guestId]: confirmed }))
    setSaving(false)
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!guest) return null

  const t = texts[guest.language]
  const allMembers = guest.members
  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto space-y-12">

      {/* Welcome */}
      <section className="text-center space-y-2 pt-8">
        <h1 className="text-2xl font-semibold">{t.welcome(guest.name)}</h1>
        <p className="text-gray-500">{t.subtitle}</p>
      </section>

      {/* RSVP */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t.rsvpTitle}</h2>
        {allMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between border rounded-lg px-4 py-3">
            <span className="font-medium">{member.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleRsvp(member.id, true)}
                disabled={saving}
                className={`px-3 py-1 rounded-lg text-sm ${
                  rsvp[member.id] === true
                    ? 'bg-green-500 text-white'
                    : 'border hover:bg-gray-50'
                }`}
              >
                {t.confirm}
              </button>
              <button
                onClick={() => handleRsvp(member.id, false)}
                disabled={saving}
                className={`px-3 py-1 rounded-lg text-sm ${
                  rsvp[member.id] === false
                    ? 'bg-red-500 text-white'
                    : 'border hover:bg-gray-50'
                }`}
              >
                {t.decline}
              </button>
            </div>
          </div>
        ))}
        {saving && <p className="text-sm text-gray-400 text-center">{t.saving}</p>}
      </section>

      {/* Gifts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t.giftsTitle}</h2>
        <p className="text-gray-500 text-sm">{t.giftsSubtitle}</p>
        <div className="space-y-3">
          {gifts.map((gift) => (
            <div key={gift.id} className="border rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{guest.language === 'pt' ? gift.namePt : gift.nameEn}</p>
                <p className="text-sm text-gray-500">R$ {gift.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border rounded-lg px-4 py-3 space-y-2">
          <p className="text-sm text-gray-500">{t.pixKey}</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">{PIX_KEY}</span>
            <button
              onClick={copyPix}
              className="text-sm border rounded px-3 py-1 hover:bg-gray-50"
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>
      </section>

    </main>
  )
}