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
    <div style={{padding: '12px 16px 20px 16px'}}>
      <div style={{position: 'relative', width: '100%', height: '280px', overflow: 'hidden', borderRadius: '16px'}}>

        {/* Backdrop image */}
        <div style={{position: 'absolute', inset: 0}}>
          <img
            src={show.backdrop_url || show.thumbnail_url}
            alt={show.title}
            style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top'}}
          />
        </div>

        {/* Content */}
        <div style={{position: 'absolute', bottom: '24px', left: '24px', maxWidth: '380px'}}>
          <div style={{fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: '700', color: '#fff', lineHeight: 1.15, marginBottom: '10px', textShadow: '0 4px 12px rgba(0,0,0,0.9)'}}>
            {show.title}
          </div>

          <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 2px 6px rgba(0,0,0,0.8)'}}>
            {show.description}
          </div>

          {/* Buttons */}
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <a
              href={`/show/${show.id}`}
              style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 20px', borderRadius: '8px', background: '#FB7185', color: '#fff', fontWeight: '700', fontSize: '13px', textDecoration: 'none'}}
            >
              ▶ Watch Now
            </a>
            <a
              href={`/show/${show.id}`}
              style={{display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '8px', background: 'rgba(0,0,0,0.45)', color: '#fff', fontWeight: '600', fontSize: '13px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)'}}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              My List
            </a>
          </div>
        </div>

        {/* Dot indicators */}
        {shows.length > 1 && (
          <div style={{position: 'absolute', bottom: '14px', right: '16px', display: 'flex', gap: '6px'}}>
            {shows.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{width: i === current ? '20px' : '6px', height: '6px', borderRadius: '3px', background: i === current ? '#FB7185' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.3s ease'}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
