'use client'

import { useEffect } from 'react'

const COLORS = [
  '#FF1493',
  '#FF69B4',
  '#FF0000',
  '#FFD700',
  '#FFF44F',
  '#00FF7F',
  '#00FA9A',
  '#00ff2f',
  '#00BFFF',
  '#1E90FF',
  '#FFFFFF',
  '#F0F0F0',
]

function createSparkle(x: number, y: number) {
  const el = document.createElement('div')
  const size = Math.random() * 12 + 6
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const duration = Math.random() * 800 + 400
  const angle = Math.random() * 360
  const distance = Math.random() * 50 + 15
  const rotation = Math.random() * 360

  el.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    transform: translate(-50%, -50%) rotate(${rotation}deg);
    animation: sparkle-fall ${duration}ms ease-out forwards;
    --dx: ${Math.cos((angle * Math.PI) / 180) * distance}px;
    --dy: ${Math.sin((angle * Math.PI) / 180) * distance}px;
    filter: drop-shadow(0 0 3px ${color}) drop-shadow(0 0 6px ${color});
  `

  el.innerHTML = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polygon 
        points="12,2 13.5,9 20,9 14.5,13.5 16.5,21 12,16.5 7.5,21 9.5,13.5 4,9 10.5,9"
        fill="${color}"
        filter="url(#glow)"
      />
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </svg>
  `

  document.body.appendChild(el)
  setTimeout(() => el.remove(), duration)
}

export default function GlitterCursor() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes sparkle-fall {
        0% { 
          opacity: 1; 
          transform: translate(-50%, -50%) rotate(var(--rot, 0deg)) scale(1);
        }
        100% { 
          opacity: 0; 
          transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) rotate(calc(var(--rot, 0deg) + 180deg)) scale(0.2);
        }
      }
    `
    document.head.appendChild(style)

    const lastPos: Record<number, { x: number; y: number }> = {}
    let lastMouseX = 0
    let lastMouseY = 0
    let viewportResizing = false
    let resizeTimer: ReturnType<typeof setTimeout>
    let idleInterval: ReturnType<typeof setInterval> | null = null

    function onViewportResize() {
      viewportResizing = true
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        viewportResizing = false
        Object.keys(lastPos).forEach((k) => delete lastPos[Number(k)])
      }, 300)
    }

    let lastSparkleTime = 0

    function onMouseMove(e: MouseEvent) {
      if (viewportResizing) return
      const dx = e.clientX - lastMouseX
      const dy = e.clientY - lastMouseY
      if (Math.sqrt(dx * dx + dy * dy) > 1) {
        const now = Date.now()
        if (now - lastSparkleTime > 100) {  // sparkle every 30ms max
          createSparkle(e.clientX, e.clientY)
          lastSparkleTime = now
        }
        lastMouseX = e.clientX
        lastMouseY = e.clientY
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (viewportResizing) return
      Array.from(e.changedTouches).forEach((touch) => {
        const id = touch.identifier
        const last = lastPos[id]
        const x = touch.clientX
        const y = touch.clientY - 30
        if (last) {
          const dx = x - last.x
          const dy = y - last.y
          if (Math.sqrt(dx * dx + dy * dy) > 6) {
            createSparkle(x, y)
            lastPos[id] = { x, y }
          }
        } else {
          lastPos[id] = { x, y }
        }
      })
    }

    function onTouchEnd(e: TouchEvent) {
      Array.from(e.changedTouches).forEach((touch) => {
        delete lastPos[touch.identifier]
      })
    }

    const isMobile = window.matchMedia('(hover: none)').matches
    if (!isMobile) {
      idleInterval = setInterval(() => {
        if (lastMouseX === 0 && lastMouseY === 0) return
        const offsetX = (Math.random() - 0.5) * 40
        const offsetY = (Math.random() - 0.5) * 40
        createSparkle(lastMouseX + offsetX, lastMouseY + offsetY)
      }, 100)
    }

    window.visualViewport?.addEventListener('resize', onViewportResize)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd)
    document.addEventListener('touchcancel', onTouchEnd)

    return () => {
      window.visualViewport?.removeEventListener('resize', onViewportResize)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('touchcancel', onTouchEnd)
      clearTimeout(resizeTimer)
      if (idleInterval) clearInterval(idleInterval)
      style.remove()
    }
  }, [])

  return null
}