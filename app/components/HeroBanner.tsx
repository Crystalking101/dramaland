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
    <div style={{position: 'relative', width: '100%', height: '520px', overflow: 'hidden', marginBottom: '8px'}}>

      {/* Backdrop image */}
      <div style={{position: 'absolute', inset: 0}}>
        <img
          src={show.backdrop_url || show.thumbnail_url}
          alt={show.title}
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top'}}
        />
      </div>

      {/* Gradient overlays */}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to right, #0E0A0D 35%, transparent 75%)'}}/>
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0E0A0D 0%, transparent 50%)'}}/>

      {/* Content */}
      <div style={{position: 'absolute', bottom: '60px', left: '40px', maxWidth: '480px'}}>
        <div style={{fontFamily: 'Playfair Display, serif', fontSize: '42px', fontWeight: '700', color: '#fff', lineHeight: 1.15, marginBottom: '12px', textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>
          {show.title}
        </div>

        {show.genre && (
          <div style={{display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap'}}>
            {show.genre.split(',').slice(0, 3).map((g: string) => (
              <span key={g} style={{fontSize: '11px', padding: '3px 10px', borderRadius: '20px', border: '1px solid rgba(251,113,133,0.5)', color: '#FB7185', background: 'rgba(251,113,133,0.1)'}}>
                {g.trim()}
              </span>
            ))}
          </div>
        )}

        <div style={{fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
          {show.description}
        </div>

        {/* Buttons */}
        <div style={{display: 'flex', gap: '12px'}}>
          <a
            href={`/show/${show.id}`}
            style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', borderRadius: '8px', background: '#FB7185', color: '#fff', fontWeight: '700', fontSize: '15px', textDecoration: 'none'}}
          >
            ▶ Watch Now
          </a>
          <a
            href={`/show/${show.id}`}
            style={{display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '8px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: '600', fontSize: '15px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)'}}
          >
            + My List
          </a>
        </div>
      </div>

      {/* Dot indicators */}
      {shows.length > 1 && (
        <div style={{position: 'absolute', bottom: '40px', left: '40px', display: 'flex', gap: '8px'}}>
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
