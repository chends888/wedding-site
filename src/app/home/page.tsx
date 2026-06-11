'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

type Guest = {
  id: string
  name: string
  language: 'pt' | 'en'
  members: { id: string; name: string }[]
}

type MemberRsvp = {
  confirmed: boolean | null
  shoe_size: string
  age_range: string
  is_child: boolean
}

type RsvpState = Record<string, MemberRsvp>

const ADULT_SIZES = [
  { label: 'BR 33 - EU 33 - CN 33 - AU 2 - 21cm', value: 'BR33' },
  { label: 'BR 34 - EU 34 - CN 34 - AU 3 - 21.5cm', value: 'BR34' },
  { label: 'BR 35 - EU 35 - CN 35 - AU 4 - 22cm', value: 'BR35' },
  { label: 'BR 36 - EU 36 - CN 36 - AU 5 - 23cm', value: 'BR36' },
  { label: 'BR 37 - EU 37 - CN 37 - AU 5.5 - 23.5cm', value: 'BR37' },
  { label: 'BR 38 - EU 38 - CN 38 - AU 6 - 24cm', value: 'BR38' },
  { label: 'BR 39 - EU 39 - CN 39 - AU 7 - 25cm', value: 'BR39' },
  { label: 'BR 40 - EU 40 - CN 40 - AU 7.5 - 25.5cm', value: 'BR40' },
  { label: 'BR 41 - EU 41 - CN 41 - AU 8 - 26cm', value: 'BR41' },
  { label: 'BR 42 - EU 42 - CN 42 - AU 9 - 27cm', value: 'BR42' },
  { label: 'BR 43 - EU 43 - CN 43 - AU 10 - 28cm', value: 'BR43' },
  { label: 'BR 44 - EU 44 - CN 44 - AU 11 - 29cm', value: 'BR44' },
  { label: 'BR 45 - EU 45 - CN 45 - AU 12 - 30cm', value: 'BR45' },
]

const CHILDREN_SIZES = {
  pt: [
    { label: 'EU/BR/AU 17 - CN 17 - 10.5cm (~12-18 meses)', value: 'EU17' },
    { label: 'EU/BR/AU 18 - CN 18 - 11cm (~18-24 meses)', value: 'EU18' },
    { label: 'EU/BR/AU 19 - CN 19 - 11.5cm (~2 anos)', value: 'EU19' },
    { label: 'EU/BR/AU 20 - CN 20 - 12cm (~2-3 anos)', value: 'EU20' },
    { label: 'EU/BR/AU 21 - CN 21 - 13cm (~3 anos)', value: 'EU21' },
    { label: 'EU/BR/AU 22 - CN 22 - 13.5cm (~3-4 anos)', value: 'EU22' },
    { label: 'EU/BR/AU 23 - CN 23 - 14cm (~4 anos)', value: 'EU23' },
    { label: 'EU/BR/AU 24 - CN 24 - 15cm (~4-5 anos)', value: 'EU24' },
    { label: 'EU/BR/AU 25 - CN 25 - 15.5cm (~5 anos)', value: 'EU25' },
    { label: 'EU/BR/AU 26 - CN 26 - 16cm (~5-6 anos)', value: 'EU26' },
    { label: 'EU/BR/AU 27 - CN 27 - 17cm (~6 anos)', value: 'EU27' },
    { label: 'EU/BR/AU 28 - CN 28 - 17.5cm (~6-7 anos)', value: 'EU28' },
    { label: 'EU/BR/AU 29 - CN 29 - 18cm (~7 anos)', value: 'EU29' },
    { label: 'EU/BR/AU 30 - CN 30 - 18.5cm (~7-8 anos)', value: 'EU30' },
    { label: 'EU/BR/AU 31 - CN 31 - 19cm (~8 anos)', value: 'EU31' },
    { label: 'EU/BR/AU 32 - CN 32 - 20cm (~9-10 anos)', value: 'EU32' },
  ],
  en: [
    { label: 'EU/BR/AU 17 - CN 17 - 10.5cm (~12-18 months)', value: 'EU17' },
    { label: 'EU/BR/AU 18 - CN 18 - 11cm (~18-24 months)', value: 'EU18' },
    { label: 'EU/BR/AU 19 - CN 19 - 11.5cm (~2 years)', value: 'EU19' },
    { label: 'EU/BR/AU 20 - CN 20 - 12cm (~2-3 years)', value: 'EU20' },
    { label: 'EU/BR/AU 21 - CN 21 - 13cm (~3 years)', value: 'EU21' },
    { label: 'EU/BR/AU 22 - CN 22 - 13.5cm (~3-4 years)', value: 'EU22' },
    { label: 'EU/BR/AU 23 - CN 23 - 14cm (~4 years)', value: 'EU23' },
    { label: 'EU/BR/AU 24 - CN 24 - 15cm (~4-5 years)', value: 'EU24' },
    { label: 'EU/BR/AU 25 - CN 25 - 15.5cm (~5 years)', value: 'EU25' },
    { label: 'EU/BR/AU 26 - CN 26 - 16cm (~5-6 years)', value: 'EU26' },
    { label: 'EU/BR/AU 27 - CN 27 - 17cm (~6 years)', value: 'EU27' },
    { label: 'EU/BR/AU 28 - CN 28 - 17.5cm (~6-7 years)', value: 'EU28' },
    { label: 'EU/BR/AU 29 - CN 29 - 18cm (~7 years)', value: 'EU29' },
    { label: 'EU/BR/AU 30 - CN 30 - 18.5cm (~7-8 years)', value: 'EU30' },
    { label: 'EU/BR/AU 31 - CN 31 - 19cm (~8 years)', value: 'EU31' },
    { label: 'EU/BR/AU 32 - CN 32 - 20cm (~9-10 years)', value: 'EU32' },
  ],
}
const texts = {
  pt: {
    welcome: (name: string) => `Olá, ${name}!`,
    subtitle: 'Estamos felizes em ter você com a gente.',
    rsvpTitle: 'Confirmar presença',
    confirm: 'Confirmar',
    decline: 'Não vou',
    shoeSize: 'Número do sapato',
    shoeSizePlaceholder: 'Selecione o número',
    isChild: 'É criança?',
    ageRange: 'Faixa etária',
    age1: '7 anos ou menos',
    age2: '8 a 10 anos',
    age3: '11 anos ou mais',
    save: 'Salvar',
    saving: 'Salvando...',
    saved: 'Salvo!',
    missingShoeSize: (names: string) => `Falta o número do sapato de: ${names}`,
    giftsTitle: 'Lista de presentes',
    giftsSubtitle: 'Sua presença é o melhor presente. Mas se quiser nos presentear, aqui estão algumas sugestões:',
    pixKey: 'Chave PIX',
    copy: 'Copiar',
    copied: 'Copiado!',
  },
  en: {
    welcome: (name: string) => `Hi, ${name}!`,
    subtitle: 'We are so happy to have you with us.',
    rsvpTitle: 'RSVP',
    confirm: 'Confirm',
    decline: 'Decline',
    shoeSize: 'Shoe size',
    shoeSizePlaceholder: 'Select your size',
    isChild: 'Is a child?',
    ageRange: 'Age range',
    age1: '7 years old or under',
    age2: '8 to 10 years old',
    age3: '11 years old or older',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
    missingShoeSize: (names: string) => `Missing shoe size for: ${names}`,
    giftsTitle: 'Gift list',
    giftsSubtitle: 'Your presence is the best gift. But if you would like to give us something, here are some suggestions:',
    pixKey: 'PIX key',
    copy: 'Copy',
    copied: 'Copied!',
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
  const [rsvp, setRsvp] = useState<RsvpState>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [missingSizes, setMissingSizes] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const autoSaveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

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

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (guest) autoSaveAll()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [guest, rsvp])

  async function fetchRsvp(g: Guest) {
    const ids = g.members.map((m) => m.id)
    const res = await fetch(`/api/rsvp?ids=${ids.join(',')}`)
    const data = await res.json()
    const state: RsvpState = {}
    for (const member of g.members) {
      const found = data.rsvps?.find((r: { guest_id: string }) => r.guest_id === member.id)
      state[member.id] = {
        confirmed: found ? found.confirmed : null,
        shoe_size: found?.shoe_size || '',
        age_range: found?.age_range || '',
        is_child: !!found?.age_range,
      }
    }
    setRsvp(state)
  }

  async function saveMember(guestId: string, data: MemberRsvp) {
    if (data.confirmed === null) return
    await fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestId,
        confirmed: data.confirmed,
        shoe_size: data.shoe_size || null,
        age_range: data.is_child ? data.age_range || null : null,
      }),
    })
  }

  function autoSaveAll() {
    if (!rsvp) return
    for (const [id, data] of Object.entries(rsvp)) {
      saveMember(id, data)
    }
  }

  function scheduleAutoSave(guestId: string, data: MemberRsvp) {
    if (autoSaveTimers.current[guestId]) {
      clearTimeout(autoSaveTimers.current[guestId])
    }
    autoSaveTimers.current[guestId] = setTimeout(() => {
      saveMember(guestId, data)
    }, 1000)
  }

  function updateMember(guestId: string, updates: Partial<MemberRsvp>) {
    setRsvp((prev) => {
      const updated = { ...prev[guestId], ...updates }
      scheduleAutoSave(guestId, updated)
      return { ...prev, [guestId]: updated }
    })
    setSaved(false)
  }

  async function handleSave() {
    if (!guest) return

    const missing = guest.members.filter((m) => {
      const r = rsvp[m.id]
      return r?.confirmed === true && !r?.shoe_size
    })

    if (missing.length > 0) {
      setMissingSizes(missing.map((m) => m.name))
      return
    }

    setSaving(true)
    setMissingSizes([])

    await Promise.all(guest.members.map((m) => saveMember(m.id, rsvp[m.id])))

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function switchLanguage(newLang: 'pt' | 'en') {
    const stored = sessionStorage.getItem('guest')
    if (stored) {
      const g = JSON.parse(stored)
      sessionStorage.setItem('guest', JSON.stringify({ ...g, language: newLang }))
    }
    setGuest((prev) => prev ? { ...prev, language: newLang } : prev)
  }

  if (!guest) return null

  const t = texts[guest.language]
  const currentLang = guest.language

  return (
    <main className="min-h-screen p-6 max-w-lg mx-auto space-y-12">

      <LanguageSwitcher lang={guest.language} onSwitch={switchLanguage} />

      {/* Welcome */}
      <section className="text-center space-y-2 pt-8">
        <h1 className="text-2xl font-semibold">{t.welcome(guest.name)}</h1>
        <p className="text-gray-500">{t.subtitle}</p>
      </section>

      {/* RSVP */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t.rsvpTitle}</h2>

        {guest.members.map((member) => {
          const r = rsvp[member.id]
          if (!r) return null

          const useChildSizes = r.is_child && r.age_range !== '11+'
          const sizeOptions = useChildSizes ? CHILDREN_SIZES[guest.language] : ADULT_SIZES

          return (
            <div key={member.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{member.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMember(member.id, { confirmed: true })}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      r.confirmed === true ? 'bg-green-500 text-white' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {t.confirm}
                  </button>
                  <button
                    onClick={() => updateMember(member.id, { confirmed: false })}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      r.confirmed === false ? 'bg-red-500 text-white' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {t.decline}
                  </button>
                </div>
              </div>

              {r.confirmed === true && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`child-${member.id}`}
                      checked={r.is_child}
                      onChange={(e) => updateMember(member.id, {
                        is_child: e.target.checked,
                        age_range: '',
                        shoe_size: '',
                      })}
                    />
                    <label htmlFor={`child-${member.id}`} className="text-sm">{t.isChild}</label>
                  </div>

                  {r.is_child && (
                    <div>
                      <label className="text-sm text-gray-500">{t.ageRange}</label>
                      <div className="flex flex-col gap-2 mt-1">
                        {(['0-7', '8-10', '11+'] as const).map((range, i) => (
                          <label key={range} className="flex items-center gap-2 text-sm">
                            <input
                              type="radio"
                              name={`age-${member.id}`}
                              value={range}
                              checked={r.age_range === range}
                              onChange={() => updateMember(member.id, {
                                age_range: range,
                                shoe_size: '',
                              })}
                            />
                            {[t.age1, t.age2, t.age3][i]}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {(!r.is_child || r.age_range) && (
                    <div>
                      <label className="text-sm text-gray-500">{t.shoeSize}</label>
                      <select
                        value={r.shoe_size}
                        onChange={(e) => updateMember(member.id, { shoe_size: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 mt-1 bg-white text-black"
                      >
                        <option value="">{t.shoeSizePlaceholder}</option>
                        {sizeOptions.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {missingSizes.length > 0 && (
          <p className="text-red-500 text-sm">{t.missingShoeSize(missingSizes.join(', '))}</p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-black text-white rounded-lg px-4 py-3 text-lg disabled:opacity-50"
        >
          {saving ? t.saving : saved ? t.saved : t.save}
        </button>
      </section>

      {/* Gifts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t.giftsTitle}</h2>
        <p className="text-gray-500 text-sm">{t.giftsSubtitle}</p>
        <div className="space-y-3">
          {gifts.map((gift) => (
            <div key={gift.id} className="border rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-medium">{currentLang === 'pt' ? gift.namePt : gift.nameEn}</p>
                <p className="text-sm text-gray-500">R$ {gift.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border rounded-lg px-4 py-3 space-y-2">
          <p className="text-sm text-gray-500">{t.pixKey}</p>
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">{PIX_KEY}</span>
            <button onClick={copyPix} className="text-sm border rounded px-3 py-1 hover:bg-gray-50">
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>
      </section>

    </main>
  )
}