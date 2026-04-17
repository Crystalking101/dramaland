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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="HFA9fgH8YkH6NIi9x" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.8/index.css"/>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-L4FTNE24FJ"></script>
        <script dangerouslySetInnerHTML={{__html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-L4FTNE24FJ');
        `}}/>
      </head>
      <body>{children}</body>
    </html>
  )
}