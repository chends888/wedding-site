'use client'

import { useState, useEffect } from 'react'

const PHOTOS = [
  '/assets/photos/photo1.jpg',
  '/assets/photos/photo2.jpg',
  '/assets/photos/photo3.jpg',
]

const INTERVAL = 6000

export default function BackgroundPhoto() {
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState(1)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % PHOTOS.length)
        setNext((prev) => (prev + 1) % PHOTOS.length)
        setFading(false)
      }, 1000)
    }, INTERVAL)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      {/* Next photo sits behind */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${PHOTOS[next]})` }}
      />
      {/* Current photo fades out on top */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${PHOTOS[current]})`,
          opacity: fading ? 0 : 1,
          transition: 'opacity 1000ms ease-in-out',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  )
}