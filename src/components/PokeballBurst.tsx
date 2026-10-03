'use client'

import { useEffect, useState } from 'react'

type Ball = {
  id: number
  x: number
  y: number
  angle: number
  distance: number
  rotation: number
  size: number
}

type Props = {
  trigger: boolean
  originX: number
  originY: number
}

export default function PokeballBurst({ trigger, originX, originY }: Props) {
  const [balls, setBalls] = useState<Ball[]>([])

  useEffect(() => {
    if (!trigger) return

    const newBalls: Ball[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: originX,
      y: originY,
      angle: (360 / 8) * i,
      distance: Math.random() * 80 + 60,
      rotation: Math.random() * 720 - 360,
      size: Math.random() * 20 + 20,
    }))

    setBalls(newBalls)
    setTimeout(() => setBalls([]), 800)
  }, [trigger])

  return (
    <>
      {balls.map((ball) => {
        const dx = Math.cos((ball.angle * Math.PI) / 180) * ball.distance
        const dy = Math.sin((ball.angle * Math.PI) / 180) * ball.distance

        return (
          <div
            key={ball.id}
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: ball.x,
              top: ball.y,
              width: ball.size,
              height: ball.size,
              transform: 'translate(-50%, -50%)',
              animation: `pokeball-fly 1.3s ease-out forwards`,
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
              '--rot': `${ball.rotation}deg`,
            } as React.CSSProperties}
          >
            <img
              src="/assets/pokeball.png"
              alt=""
              style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            />
          </div>
        )
      })}
    </>
  )
}