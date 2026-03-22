import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Drama Land',
  description: 'Your destination for the best Chinese and Asian dramas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.8/index.css"/>
      </head>
      <body>{children}</body>
    </html>
  )
}