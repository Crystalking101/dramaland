'use client'
import { useState, useEffect } from 'react'

export default function HeroBanner({ shows }: { shows: any[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (shows.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % shows.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [shows.length])

  if (!shows || shows.length === 0) return null

  const show = shows[current]

  return (
    <div style={{position: 'relative', width: '100%', height: '520px', overflow: 'hidden', marginTop: '-80px', marginBottom: '8px'}}>

      {/* Backdrop image */}
      <div style={{position: 'absolute', inset: 0}}>
        <img
          src={show.backdrop_url || show.thumbnail_url}
          alt={show.title}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top'}}
        />
      </div>

      {/* Content */}
      <div style={{position: 'absolute', bottom: '60px', left: '40px', maxWidth: '480px'}}>
        <div style={{fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: '700', color: '#fff', lineHeight: 1.15, marginBottom: '12px', textShadow: '0 4px 12px rgba(0,0,0,0.8)'}}>
          {show.title}
        </div>

        <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 2px 6px rgba(0,0,0,0.8)'}}>
          {show.description}
        </div>

        {/* Buttons */}
        <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
          <a
            href={`/show/${show.id}`}
            style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '8px', background: '#FB7185', color: '#fff', fontWeight: '700', fontSize: '15px', textDecoration: 'none'}}
          >
            ▶ Watch Now
          </a>
          <a
            href={`/show/${show.id}`}
            style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '8px', background: 'rgba(0,0,0,0.45)', color: '#fff', fontWeight: '600', fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)'}}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            My List
          </a>
        </div>
      </div>

      {/* Dot indicators */}
      {shows.length > 1 && (
        <div style={{position: 'absolute', bottom: '24px', left: '40px', display: 'flex', gap: '8px'}}>
          {shows.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === current ? '#FB7185' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease'}}
            />
          ))}
        </div>
      )}
    </div>
  )
}
