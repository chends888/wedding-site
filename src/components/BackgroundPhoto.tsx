'use client'

import { useState, useEffect } from 'react'

const PHOTOS = [
  '/assets/photos/photo1.jpg',
  '/assets/photos/photo2.jpg',
  '/assets/photos/photo3.jpg',
]

const INTERVAL = 6000

export default function BackgroundPhoto() {
  const [topIndex, setTopIndex] = useState(0)
  const [bottomIndex, setBottomIndex] = useState(1)
  const [topVisible, setTopVisible] = useState(true)

  useEffect(() => {
    PHOTOS.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (topVisible) {
        setBottomIndex((topIndex + 1) % PHOTOS.length)
        setTopVisible(false)
      } else {
        setTopIndex((bottomIndex + 1) % PHOTOS.length)
        setTopVisible(true)
      }
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [topVisible, topIndex, bottomIndex])

  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${PHOTOS[bottomIndex]})` }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${PHOTOS[topIndex]})`,
          opacity: topVisible ? 1 : 0,
          transition: 'opacity 1500ms ease-in-out',
        }}
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
    </div>
  )
}