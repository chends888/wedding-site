import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import WailmerCursor from '@/components/WailmerCursor'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Pamella & Lucas',
  description: 'Casamento de Pamella e Lucas - 19 de junho de 2027',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WailmerCursor />
        {children}
      </body>
    </html>
  )
}
