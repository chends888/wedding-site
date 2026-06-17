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

    const lastPos: Record<number, { x: number; y: number }> = {}
    let lastMouseX = 0
    let lastMouseY = 0
    let viewportResizing = false
    let resizeTimer: ReturnType<typeof setTimeout>

    // Pause sparkles during viewport resize (address bar show/hide)
    function onViewportResize() {
      viewportResizing = true
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        viewportResizing = false
        // Clear stale touch positions after resize
        Object.keys(lastPos).forEach((k) => delete lastPos[Number(k)])
      }, 300)
    }

    function onMouseMove(e: MouseEvent) {
      if (viewportResizing) return
      const dx = e.clientX - lastMouseX
      const dy = e.clientY - lastMouseY
      if (Math.sqrt(dx * dx + dy * dy) > 8) {
        createSparkle(e.clientX, e.clientY)
        lastMouseX = e.clientX
        lastMouseY = e.clientY
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (viewportResizing) return
      Array.from(e.changedTouches).forEach((touch) => {
        const id = touch.identifier
        const last = lastPos[id]
        if (last) {
          const dx = touch.clientX - last.x
          const dy = touch.clientY - last.y
          if (Math.sqrt(dx * dx + dy * dy) > 6) {
            createSparkle(touch.clientX, touch.clientY)
            lastPos[id] = { x: touch.clientX, y: touch.clientY }
          }
        } else {
          lastPos[id] = { x: touch.clientX, y: touch.clientY }
        }
      })
    }

    function onTouchEnd(e: TouchEvent) {
      Array.from(e.changedTouches).forEach((touch) => {
        delete lastPos[touch.identifier]
      })
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
      style.remove()
    }
  }, [])

  return null
}