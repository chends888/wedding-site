'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import SizeDropdown from '@/components/SizeDropdown'
import BackgroundPhoto from '@/components/BackgroundPhoto'
import MetricDropdown from '@/components/MetricDropdown'
import Divider from '@/components/Divider'
import PokeballBurst from '@/components/PokeballBurst'


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
  { value: 'BR33', BR: '33/34', EU: '35/36', US: '5W', CN: '33', AU: '3', cm: '21.5-22.5cm' },
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
    subtitle: 'Convidam para a celebração de seu casamento. 💍',
    subtitle2: 'Ficaremos muito felizes com a sua presença neste dia tão especial.',
    rsvpTitle: 'Confirmar presença',
    confirm: 'Confirmar',
    confirmed: 'Confirmado✓',
    decline: 'Não vou',
    shoeSize: 'Numeração de chinelo🩴:',
    shoeSizePlaceholder: 'Selecione a numeração do calçado',
    ageRange: 'Faixa etária',
    age1: '7 anos ou menos',
    age2: '8 a 10 anos',
    age3: '11 anos ou mais',
    missingShoeSizeError: 'Por favor selecione o número do calçado.',
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
    giftsComingSoon: 'Em breve...',
    experienceGifts: 'Experiências',
    furnitureGifts: 'Móveis e decoração',
    wishlists: 'Listas de produtos',
    custom: 'Outro valor',
    close: 'Fechar',
    scanQr: 'Escaneie o QR code ou copie a chave PIX',
    customMessage: 'Copie a chave PIX e faça a transferência pelo valor que desejar.',
    wishlistMessage: 'Acesse a lista e escolha um presente:',
    sizeSystem: 'Numeração da Havaianas em:',
    eventTitle: 'Cerimônia & Recepção',
    eventDate: '19 de junho de 2027 • 19h à 1h',
    eventLocation: 'Espaço Antakya',
    eventAddress: 'Rua Vergueiro 1515, Paraíso, São Paulo, Brasil',
    dresscode: 'Regras de vestimenta',
    dresscodeDesc: 'Traje cocktail🍸',
    dresscodeFem: '👗 Feminino — Vestidos midi, longos ou macacão social. Saltos de qualquer tipo ou sapatilhas.',
    dresscodeMan: '👔 Masculino — Terno: blazer com calça e camisa social, gravata opcional. Sapato social ou mocassin.',
    dresscodeInsp:'Aqui estão algumas inspirações:',
    faqTitle: 'Perguntas frequentes',
    faqs: [
      { q: 'Tem estacionamento?', a: 'Sim, há estacionamento incluso no local.' },
      { q: 'Existem hotéis perto do local?',   a: 'Sim, existem várias opções próximas ao local:\n\nIbis Budget São Paulo Paraíso ★★\nRua Vergueiro, 1571 (distância: 50m)\n+55 11 5085-5699\nall.accor.com/hotel/3531/index.en.shtml\n\nTRYP by Wyndham São Paulo Paulista ★★★★\nRua Afonso de Freitas, 148 (distância: 550m)\n+55 11 3059-0999\nwyndhamhotels.com/tryp/sao-paulo-brazil/tryp-sao-paulo-paulista/overview\n\nLaghetto Stilo Ibirapuera ★★★★★\nRua Coronel Oscar Porto, 836 (distância 750m)\n+55 11 3050-9601\nlaghettohoteis.com.br/hoteis/sao-paulo' },
      { q: 'Como é o transporte público?', a: 'O Espaço Antakya está ao lado da estação de metrô Paraíso (Linha 1 Azul).' },
      { q: 'E outros tipos de transporte?', a: 'Uber e 99 estão amplamente disponíveis na região.' },
      { q: 'O que devo esperar do tempo?', a: "Temperaturas por volta de 15°C/59°F durante o evento, porém tudo ocorrerá em local fechado e climatizado." },

    ],
  },
  en: {
    welcome: (name: string) => `Hi, ${name}!`,
    subtitle: 'Invite you to celebrate their wedding. 💍',
    subtitle2: 'We would be so happy to have you with us on this special day.',
    rsvpTitle: 'RSVP',
    confirm: 'Confirm',
    confirmed: 'Confirmed✓',
    decline: 'Decline',
    shoeSize: 'Flip-flop shoe size🩴:',
    shoeSizePlaceholder: 'Select shoe size',
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
    giftsComingSoon: 'Coming soon...',
    experienceGifts: 'Experiences',
    furnitureGifts: 'Furniture and decoration',
    wishlists: 'Product lists',
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
    faqTitle: 'Frequently asked questions',
    dresscode: 'Dress Code',
    dresscodeDesc: 'Cocktail attire🍸',
    dresscodeFem: '👗 Feminine — Midi dresses, floor-length gowns or elegant suits. Heels of any type or flats.',
    dresscodeMan: '👔 Masculine — Suit: blazer with trousers and dress shirt, optional tie. Dress shoes or moccasin.',
    dresscodeInsp:'Here are some inspirations:',
    faqs: [
      { q: 'Is there on-site parking?', a: 'Yes, there is free parking available at the venue.' },
      { q: 'Is there accommodation nearby?',   a: 'Yes, there are several options nearby:\n\nIbis Styles São Paulo Paraíso ★★\nRua Vergueiro, 1571 (distance: 50m)\n+55 11 5085-5699\nall.accor.com/hotel/3531/index.en.shtml\n\nTRYP by Wyndham São Paulo Paulista ★★★★\nRua Afonso de Freitas, 148 (distance: 550m)\n+55 11 3059-0999\nwyndhamhotels.com/tryp/sao-paulo-brazil/tryp-sao-paulo-paulista/overview\n\nLaghetto Stilo Ibirapuera ★★★★★\nRua Coronel Oscar Porto, 836 (distance 750m)\n+55 11 3050-9601\nlaghettohoteis.com.br/hoteis/sao-paulo' },
      { q: 'How is public transportation?', a: 'There is easy access to subway station Paraíso (Line 1 Blue) next to Antakya.' },
      { q: 'What are other types of transportation?', a: 'Uber and 99 are widely available.' },
      { q: 'What should I expect for the weather?', a: "Tempratures around 15°C/59°F. The event will take place indoors, so don't worry about bringing thick jackets." },
    ],
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
]

const FURNITURE_GIFTS = [
  {
    id: 'home',
    namePt: 'Contribua para mobiliar e decorar o nosso lar',
    nameEn: 'Contribute to furnish and decorate our home',
    descPt: 'Ajude a construir nosso cantinho.',
    descEn: 'Help us build our home together.',
  },
]

const WISHLISTS = [
  { id: 'amazon', name: 'Amazon', url: 'https://amazon.com.br', placeholder: true },
  { id: 'camicado', name: 'Camicado', url: 'https://camicado.com.br', placeholder: true },
]

const VALUES = [50, 100, 200]
const PIX_KEY = 'seu-pix@email.com'

export default function HomePage() {
  const [guest, setGuest] = useState<Guest | null>(null)
  const [rsvp, setRsvp] = useState<RsvpState>({})
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const autoSaveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const [collapsing, setCollapsing] = useState<Record<string, boolean>>({})
  const [modalVisible, setModalVisible] = useState(false)
  const [modalContent, setModalContent] = useState<GiftModal>(null)
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>('BR')
  const [photoIndex, setPhotoIndex] = useState(0)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [langKey, setLangKey] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [burstTrigger, setBurstTrigger] = useState(false)
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 })

  function openModal(data: NonNullable<GiftModal>) {
    setModalContent(data)
    setModalVisible(true)
  }

  function closeModal() {
    setModalVisible(false)
    setTimeout(() => setModalContent(null), 200)
  }

  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout>
    const observers = sectionRefs.current.map((ref, i) => {
      if (!ref) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => setPhotoIndex(i % 3), 100)
          }
        },
        { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }
      )
      observer.observe(ref)
      return observer
    })
    return () => {
      observers.forEach((o) => o?.disconnect())
      clearTimeout(debounceTimer)
    }
  }, [guest])

  useEffect(() => {
    const stored = sessionStorage.getItem('guest')
    if (!stored) { router.push('/'); return }
    const g = JSON.parse(stored) as Guest
    setGuest(g)
    fetchRsvp(g)
  }, [router])

  useEffect(() => {
    const handleBeforeUnload = () => { if (guest) autoSaveAll() }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [guest, rsvp])

  useEffect(() => {
    const weddingDate = new Date('2027-06-19T22:00:00Z')
    function update() {
      const diff = weddingDate.getTime() - new Date().getTime()
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
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
    for (const [id, data] of Object.entries(rsvp)) saveMember(id, data)
  }

  function scheduleAutoSave(guestId: string, data: MemberRsvp) {
    if (autoSaveTimers.current[guestId]) clearTimeout(autoSaveTimers.current[guestId])
    autoSaveTimers.current[guestId] = setTimeout(() => saveMember(guestId, data), 1000)
  }

  function updateMember(guestId: string, updates: Partial<MemberRsvp>) {
    setRsvp((prev) => {
      const updated = { ...prev[guestId], ...updates }
      scheduleAutoSave(guestId, updated)
      return { ...prev, [guestId]: updated }
    })
  }

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
    <main className="animate-fade-switch min-h-screen p-6 max-w-lg mx-auto space-y-12 text-white">
      <BackgroundPhoto />
      <LanguageSwitcher lang={guest.language} onSwitch={switchLanguage} />

      {/* Welcome */}
      <section ref={(el) => { sectionRefs.current[0] = el }} className="min-h-screen flex flex-col items-center justify-center text-center space-y-6 -mt-12">
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,1)] shadow-[0_2px_4px_0_rgba(0,0,0,1)]" />
          <p className="font-medium text-white tracking-widest text-shadow text-stroke bold-text">
            {currentLang === 'pt' ? '19.06.2027' : '06.19.2027'}
          </p>
          <div className="h-px w-12 bg-white shadow-[0_1px_2px_0_rgba(0,0,0,1)] shadow-[0_2px_4px_0_rgba(0,0,0,1)]" />
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="relative">
            <div className="flex justify-between md:hidden font-medium text-white mb-1 gap-16 text-shadow text-stroke bold-text">
              <div className="text-left">
                <p>Yun Eliana Masuda</p>
                <p>Sergio Tomio Masuda</p>
              </div>
              <div className="text-right">
                <p>Alice Chen</p>
                <p>Duilio Alba</p>
              </div>
            </div>

            <h1
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-6xl md:text-8xl italic leading-tight text-center text-white text-shadow-lg text-stroke-lg"
            >
              <span className="hidden md:inline whitespace-nowrap">Pamella & Lucas</span>
              <span className="md:hidden text-center block">
                Pamella<br />&amp;<br />Lucas
              </span>
            </h1>

            <div className="hidden md:flex absolute -top-8 w-full justify-between font-medium text-white text-shadow text-stroke bold-text">
              <div className="text-left">
                <p>Yun Eliana Masuda</p>
                <p>Sergio Tomio Masuda</p>
              </div>
              <div className="text-right">
                <p>Alice Chen</p>
                <p>Duilio Alba</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 w-screen px-6 text-center relative">
        <p className="text-gray-200 text-2xl text-shadow text-stroke">{t.subtitle}</p>
        <p className="text-gray-200 text-xl text-shadow text-stroke">{t.subtitle2}</p>
        
        {/* Scroll Indicator anchored to the text block */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 sm:mt-12 animate-bounce">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            className="w-10 h-10 overflow-visible"
          >
            {/* Define the native SVG shadow filter */}
            <defs>
              <filter id="smooth-shadow" x="-50%" y="-50%" width="200%" height="300%">
                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.6"/>
              </filter>
            </defs>
            
            {/* The Arrow (using the filter) */}
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M19.5 8.25l-7.5 7.5-7.5-7.5" 
              stroke="white" 
              strokeWidth={2.5} 
              filter="url(#smooth-shadow)"
            />
          </svg>
        </div>
      </div>
      </section>

      <Divider />


{/* Countdown */}
<section ref={(el) => { sectionRefs.current[1] = el }} className="space-y-3 mt-40 mb-40">
  <h2 className="text-4xl font-semibold text-center text-white text-shadow text-stroke">
    {t.countdown}
  </h2>
  
  {/* The main flex wrapper for centering */}
  <div className="flex justify-center w-full">
    
    {/* 1. We make the timer wrapper relative so Pikachu anchors tightly to the text */}
    <div className="relative flex gap-4 text-center items-end">
      
      {/* 2. Pikachu is locked to the left side of the countdown numbers */}
      {/* Adjust "pr-2" to tweak your exact pixel distance from the text */}
      <div className="absolute right-full bottom-2 flex items-center pr-1">
        <img
          src="/assets/pikachu_run.gif"
          alt="Pikachu"
          className="w-16 min-w-16 max-w-none"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* 4. The actual countdown structure */}
      {[
        { value: timeLeft.days, label: t.days },
        { value: timeLeft.hours, label: t.hours },
        { value: timeLeft.minutes, label: t.minutes },
        { value: timeLeft.seconds, label: t.seconds },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-3xl font-bold text-white text-shadow text-stroke">
            {String(value).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-300 text-shadow text-stroke">
            {label}
          </span>
        </div>
      ))}
    </div>
  </div>
</section>

      <Divider />

      {/* Event info */}
      <section ref={(el) => { sectionRefs.current[2] = el }} className="space-y-2 text-center mt-40 mb-40">
        <h2 className="text-4xl font-semibold text-white text-shadow text-stroke">{t.eventTitle}</h2>
        <p className="text-2xl text-gray-300 text-shadow text-stroke">{t.eventDate}</p>
        <p className="text-2xl font-medium text-white text-shadow text-stroke">{t.eventLocation}</p>
        <a
          href="https://www.instagram.com/espacoantakya/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-white/30 rounded-lg px-4 py-3 bg-black/40 hover:bg-white/10 transition-colors btn-pop mt-2"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
          <span className="text-white text-stroke bold-text">@espacoantakya</span>
        </a>
        <p className="text-xl text-gray-300 text-shadow text-stroke">{t.eventAddress}</p>
        <div className="rounded-lg overflow-hidden border border-white/30 mt-2 mb-10">
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
        <a
          href="https://www.waze.com/live-map/directions/br/sp/espaco-antakya?to=place.ChIJt8mH7jxZzpQRZqzUgNa4I5g"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border border-white/30 rounded-lg px-4 py-3 bg-black/40 hover:bg-white/20 transition-colors btn-pop mt-2"
        >
          <svg viewBox="0 0 24 32" className="w-10 h-10" fill="#05C8F7">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 3.313 1.343 6.313 3.515 8.485l-.01 3.516 3.516-.01C9.192 25.328 10.57 26 12 26c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.08 0-2.11-.22-3.05-.61l-2.45.007.007-2.45A9.956 9.956 0 0 1 2 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-3-11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm6 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm1.5 3.5c0 2.485-2.015 4-4.5 4s-4.5-1.515-4.5-4h9z"/>
          </svg>
          <span className="text-xl text-white text-stroke bold-text">Waze</span>
        </a>
      </section>

      <Divider />

      {/* RSVP */}
      <section ref={(el) => { sectionRefs.current[3] = el }} className="space-y-4 mt-40 mb-40">
        <h2 className="text-4xl font-semibold text-white text-shadow text-stroke">{t.rsvpTitle}</h2>

        {guest.members.map((member) => {
          const r = rsvp[member.id]
          if (!r) return null
          const showShoeSizeError = r.confirmed === true && !r.shoe_size

          return (
            <div key={member.id} className="border border-white/30 rounded-lg p-4 space-y-3 bg-black/40">
              {/* MODIFIED: Changed from 'flex items-center justify-between' to a vertical column block */}
              <div className="flex flex-col gap-3">
                {/* The name now sits safely on its own line and will wrap naturally if ultra-long */}
                <span className="font-medium text-white text-stroke bold-text text-lg">
                  {member.name}
                </span>
                
                {/* The buttons sit perfectly on the line below the name */}
                {/* Grid layout stretches them equally to fit nicely across the card */}
                <div className="grid grid-cols-2 gap-2 w-full sm:max-w-xs">
                  <button
                    onClick={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      setBurstOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
                      setBurstTrigger(false)
                      setTimeout(() => setBurstTrigger(true), 10)
                      updateMember(member.id, { confirmed: true })
                    }}
                    className={`px-3 py-2 rounded-lg text-md btn-pop text-stroke bold-text text-center ${
                      r.confirmed === true ? 'bg-green-500 text-white' : 'border border-white/40 text-white hover:bg-white/20'
                    }`}
                  >
                    {r.confirmed === true ? t.confirmed : t.confirm}
                  </button>
                  <button
                    onClick={() => {
                      setCollapsing((prev) => ({ ...prev, [member.id]: true }))
                      setTimeout(() => {
                        updateMember(member.id, { confirmed: false })
                        setCollapsing((prev) => ({ ...prev, [member.id]: false }))
                      }, 200)
                    }}
                    className={`px-3 py-2 rounded-lg text-md btn-pop text-stroke bold-text text-center ${
                      r.confirmed === false ? 'bg-red-500 text-white' : 'border border-white/40 text-white hover:bg-white/20'
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
                      <label className="text-medium text-gray-300 text-stroke bold-text">{t.ageRange}</label>
                      <div className="flex flex-col gap-2 mt-1">
                        {(['0-7', '8-10', '11+'] as const).map((range, i) => (
                          <label key={range} className="flex items-center gap-2 text-sm text-white text-stroke bold-text">
                            <input
                              type="radio"
                              name={`age-${member.id}`}
                              value={range}
                              checked={r.age_range === range}
                              onChange={() => updateMember(member.id, { age_range: range, shoe_size: '' })}
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
                    <label className="text-medium text-gray-300 text-stroke bold-text">{t.shoeSize}</label>
                    <div className="flex gap-2">
                      {/* Size system dropdown */}
                      <MetricDropdown value={sizeSystem} onChange={setSizeSystem} />
                      {/* Size dropdown */}
                      <div className="flex-1">
                        <SizeDropdown
                          value={r.shoe_size}
                          onChange={(val) => updateMember(member.id, { shoe_size: val })}
                          placeholder={t.shoeSizePlaceholder}
                          options={(member.is_child && r.age_range !== '11+'
                            ? CHILDREN_SIZE_TABLE
                            : SIZE_TABLE
                          ).map((s) => ({ value: s.value, label: s[sizeSystem] }))}
                        />
                      </div>
                    </div>

                    {showShoeSizeError && (
                      <p className="text-red-400 text-md mt-1 text-stroke bold-text">{t.missingShoeSizeError}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </section>

      <Divider />

      {/* Gifts */}
      <section ref={(el) => { sectionRefs.current[4] = el }} className="space-y-6 mt-40 mb-40">
        <h2 className="text-4xl font-semibold text-white text-shadow text-stroke">{t.giftsTitle}</h2>
        <p className="text-xl text-gray-300 text-stroke bold-text">{t.giftsComingSoon}</p>

        <div className="rounded-lg overflow-hidden mt-2">
          <img src="/assets/coming-soon.png" alt="Coming Soon" className="object-contain w-100 h-100 mx-auto" />
        </div>
        {/*

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white uppercase tracking-wide text-shadow text-stroke">{t.experienceGifts}</h3>
          {EXPERIENCE_GIFTS.map((gift) => (
            <div key={gift.id} className="border border-white/30 rounded-lg p-4 space-y-3 bg-black/40">
              <div>
                <p className="font-medium text-white text-stroke bold-text">{currentLang === 'pt' ? gift.namePt : gift.nameEn}</p>
                <p className="text-sm text-gray-300 text-stroke bold-text">{currentLang === 'pt' ? gift.descPt : gift.descEn}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {VALUES.map((value) => (
                  <button
                    key={value}
                    onClick={() => openModal({ qrCode: `/qr/${gift.id}-${value}.png`, pixKey: PIX_KEY })}
                    className="border border-white/40 text-white rounded-lg px-4 py-2 text-sm hover:bg-white/20 btn-pop text-stroke bold-text"
                  >
                    R$ {value}
                  </button>
                ))}
                <button
                  onClick={() => openModal({ qrCode: null, pixKey: PIX_KEY })}
                  className="border border-white/40 text-white rounded-lg px-4 py-2 text-sm hover:bg-white/20 btn-pop text-stroke bold-text"
                >
                  {t.custom}
                </button>
              </div>
            </div>
          ))}
          <h3 className="text-xl font-semibold text-white uppercase tracking-wide text-shadow text-stroke bold-text">{t.furnitureGifts}</h3>
          {FURNITURE_GIFTS.map((gift) => (
            <div key={gift.id} className="border border-white/30 rounded-lg p-4 space-y-3 bg-black/40">
              <div>
                <p className="font-medium text-white text-stroke bold-text">{currentLang === 'pt' ? gift.namePt : gift.nameEn}</p>
                <p className="text-sm text-gray-300 text-stroke bold-text">{currentLang === 'pt' ? gift.descPt : gift.descEn}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {VALUES.map((value) => (
                  <button
                    key={value}
                    onClick={() => openModal({ qrCode: `/qr/${gift.id}-${value}.png`, pixKey: PIX_KEY })}
                    className="border border-white/40 text-white rounded-lg px-4 py-2 text-sm hover:bg-white/20 btn-pop text-stroke bold-text"
                  >
                    R$ {value}
                  </button>
                ))}
                <button
                  onClick={() => openModal({ qrCode: null, pixKey: PIX_KEY })}
                  className="border border-white/40 text-white rounded-lg px-4 py-2 text-sm hover:bg-white/20 btn-pop text-stroke bold-text"
                >
                  {t.custom}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl bold-text text-white uppercase tracking-wide text-shadow text-stroke bold-text">{t.wishlists}</h3>
          {WISHLISTS.map((list) => (
            <a key={list.id} href={list.url} target="_blank" rel="noopener noreferrer" className="border border-white/30 rounded-lg px-4 py-3 flex items-center justify-between bg-black/40 hover:bg-black/40 transition-colors btn-pop">
              <span className="font-medium text-white text-stroke bold-text">{list.name}</span>
              <span className="text-white/80 text-stroke">{'→'}</span>
            </a>
          ))}
        </div>
        */}
      </section>
      
      <Divider />

      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
          modalVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeModal}
      >
        <div
          className={`bg-white text-black rounded-2xl p-6 w-full max-w-sm space-y-4 transition-all duration-200 ${
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
            <span className="font-mono text-sm text-black">{modalContent?.pixKey}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(modalContent?.pixKey || '')
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="text-sm border rounded px-3 py-1 hover:bg-gray-50 btn-pop text-black"
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>

          <button
            onClick={closeModal}
            className="w-full border rounded-lg px-4 py-2 text-sm hover:bg-gray-50 btn-pop text-black"
          >
            {t.close}
          </button>
        </div>
      </div>


      {/* Dress Code */}
      <section ref={(el) => { sectionRefs.current[5] = el }} className="space-y-4 mt-40 mb-40">
        <h2 className="text-4xl font-semibold text-white text-shadow text-stroke">{t.dresscode}</h2>
        <p className="text-xl text-gray-300 text-stroke bold-text">{t.dresscodeDesc}</p>
        <div className="text-stroke bold-text flex flex-col gap-2">
  {/* The header label */}
  <p>{currentLang === 'pt' ? 'Cores Proibidas:' : 'Prohibited Colors:'}</p>
  
  {/* The color list - each item takes up a full new line */}
  <div className="flex flex-col gap-1.5 pl-4">
    {/* White */}
    <div className="flex items-center">
      <span 
        className="px-2 py-0.5 rounded text-black font-semibold"
        style={{ color: '#ffffff', backgroundColor: '#ffffff' }}
      >
        {currentLang === 'pt' ? 'BRANCO' : 'WHITE'}
      </span>
    </div>

    {/* Off White */}
    <div className="flex items-center">
      <span 
        className="px-2 py-0.5 rounded text-black font-semibold"
        style={{ color: '#f5f0dc', backgroundColor: '#f5f0dc' }}
      >
        {currentLang === 'pt' ? 'OFF WHITE' : 'OFF WHITE'}
      </span>
    </div>

    {/* Baby Yellow */}
    <div className="flex items-center">
      <span 
        className="px-2 py-0.5 rounded text-black font-semibold"
        style={{ color: '#fffacd', backgroundColor: '#fffacd' }}
      >
        {currentLang === 'pt' ? 'AMARELO BEBÊ' : 'BABY YELLOW'}
      </span>
    </div>

    {/* Red */}
    <div className="flex items-center">
      <span 
        className="px-2 py-0.5 rounded text-white font-semibold"
        style={{ color: 'red', backgroundColor: 'red' }}
      >
        {currentLang === 'pt' ? 'VERMELHO' : 'RED'}
      </span>
    </div>
  </div>
</div>

        <p className="text-gray-300 text-stroke bold-text mt-5">{t.dresscodeFem}</p>
        <p className="text-gray-300 text-stroke bold-text">{t.dresscodeMan}</p>
        <p className="text-gray-300 text-stroke bold-text">{t.dresscodeInsp}</p>
        <div className="rounded-lg overflow-hidden border border-white/30 mt-2">
          <img src="/assets/dress-code.png" alt="Dress code" className="w-full object-contain" />
        </div>
      </section>

      <Divider />

      {/* FAQ */}
      <section ref={(el) => { sectionRefs.current[6] = el }} className="space-y-4 mt-40 mb-40">
        <h2 className="text-4xl font-semibold text-white text-shadow text-stroke">{t.faqTitle}</h2>
        {t.faqs.map((faq, i) => (
          <div key={i} className="border border-white/30 rounded-lg bg-black/40 hover:bg-white/10 overflow-hidden">
            <button
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-3 text-left text-white btn-pop"
            >
              <span className="text-xl text-white text-stroke bold-text">{faq.q}</span>
              <span className={`transition-transform duration-200 text-white/80 ${openFaq === i ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${
              openFaq === i ? 'max-h-300 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="px-4 pb-4 text-md text-gray-300 text-stroke bold-text space-y-3">
                {faq.a.split('\n\n').map((block, bi) => (
                  <div key={bi}>
                    {block.split('\n').map((line, li) => (
                      <p key={li} className={li === 0 ? 'font-semibold text-white' : 'text-gray-300'}>
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
      <PokeballBurst trigger={burstTrigger} originX={burstOrigin.x} originY={burstOrigin.y} />
    </main>
  )
}
