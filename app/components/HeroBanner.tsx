'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

export default function HeroBanner({ shows }: { shows: any[] }) {
  const [current, setCurrent] = useState(0)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (shows.length <= 1) return
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % shows.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [shows.length])

  useEffect(() => {
    setSaved(false)
  }, [current])

  if (!shows || shows.length === 0) return null

  const show = shows[current]

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      window.location.href = '/signin'
      return
    }

    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Watchlist`,
      {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=ignore-duplicates',
        },
        body: JSON.stringify({ user_id: session.user.id, show_id: show.id }),
      }
    )

    setSaved(true)
    setSaving(false)
  }

  return (
    <div style={{padding: '30px 32px 20px 32x'}}>
      <div style={{position: 'relative', width: '100%', height: '400px', overflow: 'hidden', borderRadius: '16px'}}>

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
            <button
              onClick={handleSave}
              disabled={saving || saved}
              style={{display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '8px', background: saved ? 'rgba(251,113,133,0.3)' : 'rgba(0,0,0,0.45)', color: '#fff', fontWeight: '600', fontSize: '13px', border: saved ? '1px solid #FB7185' : '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)', cursor: saving ? 'wait' : 'pointer'}}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? '#FB7185' : 'none'} stroke={saved ? '#FB7185' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              {saving ? 'Saving...' : saved ? 'Saved!' : 'My List'}
            </button>
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
