'use client'

import { useEffect, useRef } from 'react'

export default function WailmerCursor() {
  const wailmerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posRef = useRef({ x: -200, y: -200 })
  const targetRef = useRef({ x: -200, y: -200 })
  const animFrameRef = useRef<number | null>(null)
  const movingRef = useRef(false)
  const movingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const trailRef = useRef<{
    x: number; y: number;
    width: number; height: number;
    opacity: number;
  }[]>([])

  useEffect(() => {
    const WAILMER_SIZE = 80
    const LERP_SPEED = 0.08
    const Y_OFFSET = 40

    const wailmer = wailmerRef.current
    const canvas = canvasRef.current
    if (!wailmer || !canvas) return

    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 9998;
    `
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length > 0) {
        targetRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
        movingRef.current = true
        if (movingTimerRef.current) clearTimeout(movingTimerRef.current)
        movingTimerRef.current = setTimeout(() => {
          movingRef.current = false
        }, 150)
      }
    }

    function onMouseMove(e: MouseEvent) {
      targetRef.current = { x: e.clientX, y: e.clientY }
      movingRef.current = true
      if (movingTimerRef.current) clearTimeout(movingTimerRef.current)
      movingTimerRef.current = setTimeout(() => {
        movingRef.current = false
      }, 150)
    }

    function onResize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function spawnTrail() {
      const x = posRef.current.x
      const y = posRef.current.y + Y_OFFSET + WAILMER_SIZE * 0.25

      trailRef.current.push({
        x,
        y: y + (Math.random() - 0.5) * 10,
        width: WAILMER_SIZE * 0.6,
        height: 4 + Math.random() * 4,
        opacity: 0.5 + Math.random() * 0.2,
      })
    }

    function loop() {
      if (!ctx || !canvas) return
      const prev = { ...posRef.current }
      posRef.current.x += (targetRef.current.x - posRef.current.x) * LERP_SPEED
      posRef.current.y += (targetRef.current.y - posRef.current.y) * LERP_SPEED

      const dx = posRef.current.x - prev.x
      const dy = posRef.current.y - prev.y
      const speed = Math.sqrt(dx * dx + dy * dy)

      if (wailmer) {
        const flipX = dx > 0.1 ? -1 : dx < -0.1 ? 1 : (Number(wailmer.dataset.flip) || 1)
        wailmer.dataset.flip = String(flipX)
        wailmer.style.transform = `translate(${posRef.current.x - WAILMER_SIZE / 2}px, ${posRef.current.y - WAILMER_SIZE / 2 + Y_OFFSET}px) scaleX(${flipX})`
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (movingRef.current && speed > 0.3) {
        spawnTrail()
      }

      trailRef.current = trailRef.current.filter(t => t.opacity > 0.01)

      for (const t of trailRef.current) {
        t.width *= 1.03      // spread sideways
        t.height *= 0.98     // flatten vertically
        t.opacity -= 0.025

        const gradient = ctx.createLinearGradient(t.x - t.width, t.y, t.x + t.width, t.y)
        gradient.addColorStop(0, `rgba(0, 50, 120, 0)`)
        gradient.addColorStop(0.3, `rgba(0, 90, 160, ${t.opacity})`)
        gradient.addColorStop(0.5, `rgba(0, 120, 180, ${t.opacity})`)
        gradient.addColorStop(0.7, `rgba(0, 90, 160, ${t.opacity})`)
        gradient.addColorStop(1, `rgba(0, 50, 120, 0)`)

        ctx.save()
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.ellipse(t.x, t.y, t.width, t.height, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animFrameRef.current = requestAnimationFrame(loop)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('resize', onResize)
    loop()

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('resize', onResize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (movingTimerRef.current) clearTimeout(movingTimerRef.current)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} />
      <div
        ref={wailmerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 80,
          height: 80,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        <img
          src="/assets/wailmer.png"
          alt="Wailmer"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </>
  )
}