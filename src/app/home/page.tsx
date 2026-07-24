'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import SizeDropdown from '@/components/SizeDropdown'

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


type SizeSystem = 'BR' | 'EU' | 'US' | 'CN' | 'AU' | 'cm'

const SIZE_TABLE = [
  { value: 'BR35', BR: '35/36', EU: '37/38', US: '6W / 5M', CN: '35', AU: '4/5', cm: '23-24cm' },
  { value: 'BR37', BR: '37/38', EU: '39/40', US: '7-8W / 6-7M', CN: '37', AU: '5.5/6', cm: '24-25cm' },
  { value: 'BR39', BR: '39/40', EU: '41/42', US: '9-10W / 8M', CN: '39', AU: '7/7.5', cm: '25.5-26.5cm' },
  { value: 'BR41', BR: '41/42', EU: '43/44', US: '11-12W / 9-10M', CN: '41', AU: '8/9', cm: '27-28cm' },
  { value: 'BR43', BR: '43/44', EU: '45/46', US: '11-12M', CN: '43', AU: '10/11', cm: '28-29cm' },
  { value: 'BR45', BR: '45/46', EU: '47/48', US: '13M', CN: '45', AU: '12', cm: '29-30cm' },
]

const CHILDREN_SIZE_TABLE = [
  { value: 'EU17', BR: '17/18', EU: '19/20', US: '4C', CN: '17', AU: '2', cm: '11.5-12.5cm' },
  { value: 'EU19', BR: '19', EU: '20', US: '5C', CN: '19', AU: '3', cm: '12-13cm' },
  { value: 'EU20', BR: '20', EU: '21', US: '6C', CN: '20', AU: '3.5', cm: '12.5-13.5cm' },
  { value: 'EU21', BR: '21', EU: '22', US: '7C', CN: '21', AU: '4', cm: '13.5-14.5cm' },
  { value: 'EU22', BR: '22', EU: '23', US: '8C', CN: '22', AU: '4.5', cm: '14-15cm' },
  { value: 'EU23', BR: '23/24', EU: '25/26', US: '9C', CN: '23', AU: '5/6', cm: '15-16cm' },
  { value: 'EU25', BR: '25/26', EU: '27/28', US: '10C', CN: '25', AU: '7', cm: '16-17cm' },
  { value: 'EU27', BR: '27/28', EU: '29/30', US: '11-12C', CN: '27', AU: '8', cm: '17.5-18.5cm' },
  { value: 'EU29', BR: '29/30', EU: '31/32', US: '13C-1Y', CN: '29', AU: '9', cm: '18.5-19.5cm' },
  { value: 'EU31', BR: '31/32', EU: '33/34', US: '2Y', CN: '31', AU: '10', cm: '20-21cm' },
  { value: 'EU33', BR: '33/34', EU: '35/36', US: '3-4Y', CN: '33', AU: '11', cm: '21.5-22.5cm' },
]

const texts = {
  pt: {
    welcome: (name: string) => `Olá, ${name}!`,
    subtitle: 'Este é o seu convite para o nosso casamento. 💍',
    subtitle2: 'Ficaremos muito felizes em ter você conosco neste dia tão especial.',
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
    sizeSystem: 'Tamanho da Havaianas em:',
    eventTitle: 'Cerimônia & Recepção',
    eventDate: '19 de junho de 2027 • 19h à 1h',
    eventLocation: 'Espaço Antakya',
    eventAddress: 'Rua Vergueiro 1515, Paraíso, São Paulo, Brasil',

  },
  en: {
    welcome: (name: string) => `Hi, ${name}!`,
    subtitle: 'This is your invitation to our wedding. 💍',
    subtitle2: 'We would be so happy to have you with us on this special day.',
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
    sizeSystem: 'Havaianas size in:',
    eventTitle: 'Ceremony & Reception',
    eventDate: 'June 19th, 2027 • 7PM to 1AM',
    eventLocation: 'Espaço Antakya',
    eventAddress: 'Rua Vergueiro 1515, Paraíso, São Paulo, Brasil',
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
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>('BR')


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
      <section className="min-h-screen flex flex-col items-center justify-center text-center space-y-6 pt-8">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gray-400" />
          <p className="text-sm text-gray-400 tracking-widest">
            {currentLang === 'pt' ? '19.06.2027' : '06.19.2027'}
          </p>
          <div className="h-px w-12 bg-gray-400" />
        </div>
        <h1
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-5xl sm:text-7xl italic leading-tight"
        >
          <span className="hidden sm:inline whitespace-nowrap">Pamella & Lucas</span>
          <span className="sm:hidden">
            Pamella
            <br />
            &amp;
            <br />
            Lucas
          </span>
        </h1>
        <div className="space-y-3">
          <p className="text-gray-500 text-lg">{t.subtitle}</p>
          <p className="text-gray-500">{t.subtitle2}</p>
        </div>
      </section>

      {/* Countdown */}
      <section className="space-y-3 relative">
        <h2 className="text-xl font-semibold text-center">{t.countdown}</h2>
        <div className="flex justify-center gap-4 text-center">
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
        <img
          src="/assets/pikachu_run.gif"
          alt="Pikachu"
          className="w-16 absolute -bottom-0 left-9"
          style={{ imageRendering: 'pixelated' }}
        />
      </section>

      {/* Event info */}
      <section className="space-y-2 text-center">
        <h2 className="text-3xl font-semibold">{t.eventTitle}</h2>
        <p className="text-2xl text-gray-500">{t.eventDate}</p>
        <p className="text-2xl font-medium">{t.eventLocation}</p>
        <p className="text-xl text-gray-500">{t.eventAddress}</p>
        <div className="rounded-lg overflow-hidden border mt-2">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.7988001165277!2d-46.64274292572889!3d-23.575668578789994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce593cee87c9b7%3A0x9823b8d680d4ac66!2sEspaco%20Antakya!5e0!3m2!1sen!2sus!4v1784762474177!5m2!1sen!2sus"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* RSVP */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{t.rsvpTitle}</h2>

        {/* Size system selector */}
        <div className="space-y-1">
          <label className="text-sm text-gray-500">{t.sizeSystem}</label>
          <div className="flex flex-wrap gap-2">
            {(['BR', 'EU', 'US', 'CN', 'AU', 'cm'] as SizeSystem[]).map((sys) => (
              <button
                key={sys}
                onClick={() => setSizeSystem(sys)}
                className={`px-3 py-1 rounded-lg text-xs border btn-pop ${
                  sizeSystem === sys ? 'bg-black text-white' : 'hover:bg-gray-50'
                }`}
              >
                {sys}
              </button>
            ))}
          </div>
        </div>
        {guest.members.map((member) => {
          const r = rsvp[member.id]
          if (!r) return null

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

                  <div className={`space-y-2 transition-all duration-200 ${
                    (!member.is_child || r.age_range)
                      ? 'opacity-100 max-h-96 overflow-visible'
                      : 'opacity-0 max-h-0 overflow-hidden pointer-events-none'
                  }`}>
                    <label className="text-sm text-gray-500">{t.shoeSize}</label>

                    <SizeDropdown
                      value={r.shoe_size}
                      onChange={(val) => updateMember(member.id, { shoe_size: val })}
                      placeholder={t.shoeSizePlaceholder}
                      options={(member.is_child && r.age_range !== '11+'
                        ? CHILDREN_SIZE_TABLE
                        : SIZE_TABLE
                      ).map((s) => ({
                        value: s.value,
                        label: s[sizeSystem],
                      }))}
                    />

                    {showShoeSizeError && (
                      <p className="text-red-500 text-sm mt-1">{t.missingShoeSizeError}</p>
                    )}
                  </div>
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