'use client'

import { useEffect } from 'react'

const COLORS = ['#FFD700', '#FF69B4', '#FF1493', '#FFC0CB', '#FFB6C1', '#FFFACD', '#E6E6FA']

function createSparkle(x: number, y: number) {
  const sparkle = document.createElement('div')
  const size = Math.random() * 8 + 4
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  const angle = Math.random() * 360
  const distance = Math.random() * 60 + 20
  const duration = Math.random() * 600 + 400

  sparkle.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    left: ${x}px;
    top: ${y - 30}px;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: sparkle-fly ${duration}ms ease-out forwards;
    --dx: ${Math.cos((angle * Math.PI) / 180) * distance}px;
    --dy: ${Math.sin((angle * Math.PI) / 180) * distance}px;
  `

  document.body.appendChild(sparkle)
  setTimeout(() => sparkle.remove(), duration)
}

export default function GlitterCursor() {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes sparkle-fly {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { 
          opacity: 0; 
          transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0);
        }
      }
    `
    document.head.appendChild(style)

    let lastX = 0
    let lastY = 0

    function onMouseMove(e: MouseEvent) {
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 8) {
        createSparkle(e.clientX, e.clientY)
        lastX = e.clientX
        lastY = e.clientY
      }
    }

    function onTouchMove(e: TouchEvent) {
      Array.from(e.touches).forEach((touch) => {
        const dx = touch.clientX - lastX
        const dy = touch.clientY - lastY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 6) {
          createSparkle(touch.clientX, touch.clientY)
          lastX = touch.clientX
          lastY = touch.clientY
        }
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
      style.remove()
    }
  }, [])

  return null
}