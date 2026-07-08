'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'

type Guest = {
  id: string
  name: string
  language: 'pt' | 'en'
  members: { id: string; name: string; is_child: boolean }[]
}

type MemberRsvp = {
  confirmed: boolean | null
  shoe_size: string
  age_range: string
}

type RsvpState = Record<string, MemberRsvp>

const ADULT_SIZES = [
  { label: 'BR/EU 33 - CN 33 - AU 2 - 21cm', value: 'BR33' },
  { label: 'BR/EU 34 - CN 34 - AU 3 - 21.5cm', value: 'BR34' },
  { label: 'BR/EU 35 - CN 35 - AU 4 - 22cm', value: 'BR35' },
  { label: 'BR/EU 36 - CN 36 - AU 5 - 23cm', value: 'BR36' },
  { label: 'BR/EU 37 - CN 37 - AU 5.5 - 23.5cm', value: 'BR37' },
  { label: 'BR/EU 38 - CN 38 - AU 6 - 24cm', value: 'BR38' },
  { label: 'BR/EU 39 - CN 39 - AU 7 - 25cm', value: 'BR39' },
  { label: 'BR/EU 40 - CN 40 - AU 7.5 - 25.5cm', value: 'BR40' },
  { label: 'BR/EU 41 - CN 41 - AU 8 - 26cm', value: 'BR41' },
  { label: 'BR/EU 42 - CN 42 - AU 9 - 27cm', value: 'BR42' },
  { label: 'BR/EU 43 - CN 43 - AU 10 - 28cm', value: 'BR43' },
  { label: 'BR/EU 44 - CN 44 - AU 11 - 29cm', value: 'BR44' },
  { label: 'BR/EU 45 - CN 45 - AU 12 - 30cm', value: 'BR45' },
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
    ageRange: 'Faixa etária',
    age1: '7 anos ou menos',
    age2: '8 a 10 anos',
    age3: '11 anos ou mais',
    missingShoeSizeError: 'Por favor, selecione o número do sapato.',
    giftsSubtitle: 'Sua presença é o melhor presente. Mas se quiser nos presentear, aqui estão algumas sugestões:',
    pixKey: 'Chave PIX',
    copy: 'Copiar',
    copied: 'Copiado!',
    countdown: 'Contagem regressiva',
    days: 'dias',
    hours: 'horas',
    minutes: 'minutos',
    seconds: 'segundos',
    giftsTitle: 'Presentes',
    experienceGifts: 'Experiências',
    wishlists: 'Listas de presentes',
    custom: 'Outro valor',
    close: 'Fechar',
    scanQr: 'Escaneie o QR code ou copie a chave PIX',
    customMessage: 'Copie a chave PIX e faça a transferência pelo valor que desejar.',
    wishlistMessage: 'Acesse a lista e escolha um presente:',
  },
  en: {
    welcome: (name: string) => `Hi, ${name}!`,
    subtitle: 'We are so happy to have you with us.',
    rsvpTitle: 'RSVP',
    confirm: 'Confirm',
    decline: 'Decline',
    shoeSize: 'Shoe size',
    shoeSizePlaceholder: 'Select size',
    ageRange: 'Age range',
    age1: '7 years old or under',
    age2: '8 to 10 years old',
    age3: '11 years old or older',
    missingShoeSizeError: 'Please select a shoe size.',
    giftsSubtitle: 'Your presence is the best gift. But if you would like to give us something, here are some suggestions:',
    pixKey: 'PIX key',
    copy: 'Copy',
    copied: 'Copied!',
    countdown: 'Countdown',
    days: 'days',
    hours: 'hours',
    minutes: 'minutes',
    seconds: 'seconds',
    giftsTitle: 'Gifts',
    experienceGifts: 'Experiences',
    wishlists: 'Gift lists',
    custom: 'Custom amount',
    close: 'Close',
    scanQr: 'Scan the QR code or copy the PIX key',
    customMessage: 'Copy the PIX key and transfer any amount you wish.',
    wishlistMessage: 'Visit the list and choose a gift:',
  },
}

type GiftModal = {
  qrCode: string | null
  pixKey: string
} | null

const EXPERIENCE_GIFTS = [
  {
    id: 'honeymoon',
    namePt: 'Contribua para nossa lua de mel',
    nameEn: 'Assist us on our honeymoon',
    descPt: 'Ajude a tornar nossa lua de mel inesquecível.',
    descEn: 'Help make our honeymoon unforgettable.',
  },
  {
    id: 'home',
    namePt: 'Contribua para mobiliar nosso lar',
    nameEn: 'Contribute to furnish our home',
    descPt: 'Ajude a construir nosso cantinho.',
    descEn: 'Help us build our home together.',
  },
]

const WISHLISTS = [
  {
    id: 'amazon',
    name: 'Amazon',
    url: 'https://amazon.com.br',
    placeholder: true,
  },
  {
    id: 'camicado',
    name: 'Camicado',
    url: 'https://camicado.com.br',
    placeholder: true,
  },
]

const VALUES = [50, 100, 200]
const PIX_KEY = 'seu-pix@email.com'


export default function HomePage() {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [rsvp, setRsvp] = useState<RsvpState>({})
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const autoSaveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const [modal, setModal] = useState<GiftModal>(null)
  const [modalClosing, setModalClosing] = useState(false)
  const [collapsing, setCollapsing] = useState<Record<string, boolean>>({})
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState<GiftModal>(null)

  function openModal(data: NonNullable<GiftModal>) {
    setModalContent(data)
    setModalVisible(true)
  }

  function closeModal() {
    setModalVisible(false)
    setTimeout(() => setModalContent(null), 200)
  }




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

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const weddingDate = new Date('2027-06-19T22:00:00Z') // 7PM UTC-3 = 22:00 UTC

    function update() {
      const now = new Date()
      const diff = weddingDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

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
        age_range: data.age_range || null,
      }),
    })
  }

  function autoSaveAll() {
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
  }

  function copyPix() {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const [langKey, setLangKey] = useState(0)

  function switchLanguage(newLang: 'pt' | 'en') {
    const stored = sessionStorage.getItem('guest')
    if (stored) {
      const g = JSON.parse(stored)
      sessionStorage.setItem('guest', JSON.stringify({ ...g, language: newLang }))
    }
    setGuest((prev) => prev ? { ...prev, language: newLang } : prev)
    setLangKey((k) => k + 1)
  }

  if (!guest) return null

  const t = texts[guest.language]
  const currentLang = guest.language

  return (
    <main key={langKey} className="animate-fade-switch min-h-screen p-6 max-w-lg mx-auto space-y-12">

      <LanguageSwitcher lang={guest.language} onSwitch={switchLanguage} />

      {/* Welcome */}
      <section className="text-center space-y-2 pt-8">
        <h1 className="text-2xl font-semibold">{t.welcome(guest.name)}</h1>
        <p className="text-gray-500">{t.subtitle}</p>
      </section>

      {/* Countdown */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-center">{t.countdown}</h2>
          <div className="flex justify-center items-end gap-4 text-center">
            <img
              src="/assets/pikachu_run.gif"
              alt="Pikachu"
              className="w-17"
              style={{ imageRendering: 'pixelated' }}
            />
            {[
              { value: timeLeft.days, label: t.days },
              { value: timeLeft.hours, label: t.hours },
              { value: timeLeft.minutes, label: t.minutes },
              { value: timeLeft.seconds, label: t.seconds },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-3xl font-bold">{String(value).padStart(2, '0')}</span>
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

      {/* RSVP */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t.rsvpTitle}</h2>

        {guest.members.map((member) => {
          const r = rsvp[member.id]
          if (!r) return null

          const sizeOptions = member.is_child && r.age_range !== '11+'
            ? CHILDREN_SIZES[currentLang]
            : ADULT_SIZES

          const showShoeSizeError = r.confirmed === true && !r.shoe_size

          return (
            <div key={member.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{member.name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMember(member.id, { confirmed: true })}
                    className={`px-3 py-1 rounded-lg text-sm btn-pop ${
                      r.confirmed === true ? 'bg-green-500 text-white' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {t.confirm}
                  </button>
                  <button
                    onClick={() => {
                      setCollapsing((prev) => ({ ...prev, [member.id]: true }))
                      setTimeout(() => {
                        updateMember(member.id, { confirmed: false })
                        setCollapsing((prev) => ({ ...prev, [member.id]: false }))
                      }, 200)
                    }}
                    className={`px-3 py-1 rounded-lg text-sm btn-pop ${
                      r.confirmed === false ? 'bg-red-500 text-white' : 'border hover:bg-gray-50'
                    }`}
                  >
                    {t.decline}
                  </button>
                </div>
              </div>

              {r.confirmed === true && (
                <div className={`space-y-3 pt-1 ${collapsing[member.id] ? 'animate-fade-out-up' : 'animate-fade-in-down'}`}>
                  {member.is_child && (
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

                  {(!member.is_child || r.age_range) && (
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
                      {showShoeSizeError && (
                        <p className="text-red-500 text-sm mt-1">{t.missingShoeSizeError}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </section>

      {/* Gifts */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold">{t.giftsTitle}</h2>

        {/* Experience gifts */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{t.experienceGifts}</h3>
          {EXPERIENCE_GIFTS.map((gift) => (
            <div key={gift.id} className="border rounded-lg p-4 space-y-3">
              <div>
                <p className="font-medium">{currentLang === 'pt' ? gift.namePt : gift.nameEn}</p>
                <p className="text-sm text-gray-500">{currentLang === 'pt' ? gift.descPt : gift.descEn}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {VALUES.map((value) => (
                  <button
                    key={value}
                    onClick={() => openModal({
                      qrCode: `/qr/${gift.id}-${value}.png`,
                      pixKey: PIX_KEY,
                    })}
                    className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 btn-pop"
                  >
                    R$ {value}
                  </button>
                ))}
                <button
                  onClick={() => openModal({ qrCode: null, pixKey: PIX_KEY })}
                  className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 btn-pop"
                >
                  {t.custom}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wishlists */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{t.wishlists}</h3>
          {WISHLISTS.map((list) => (
            <div key={list.id} className="border rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="font-medium">{list.name}</span>
              <a href={list.url} target="_blank" rel="noopener noreferrer" className="text-sm border rounded-lg px-3 py-1 hover:bg-gray-50 btn-pop">
                {'→'}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
          modalVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeModal}
      >
        <div
          className={`bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 transition-all duration-200 ${
            modalVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {modalContent?.qrCode ? (
            <>
              <p className="text-center text-sm text-gray-500">{t.scanQr}</p>
              <img src={modalContent.qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
            </>
          ) : (
            <p className="text-center text-sm text-gray-500">{t.customMessage}</p>
          )}

          <div className="border rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="font-mono text-sm">{modalContent?.pixKey}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(modalContent?.pixKey || '')
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="text-sm border rounded px-3 py-1 hover:bg-gray-50 btn-pop"
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>

          <button
            onClick={closeModal}
            className="w-full border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 btn-pop"
          >
            {t.close}
          </button>
        </div>
      </div>

    </main>
  )
}