'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '../../../lib/supabase'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

async function getShow(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?id=eq.${id}&select=*`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      cache: 'no-store'
    }
  )
  if (!res.ok) return null
  const data = await res.json()
  return data[0] || null
}

async function getEpisodes(showId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Episodes?show_id=eq.${showId}&select=*&order=episode_number.asc`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
      },
      cache: 'no-store'
    }
  )
  if (!res.ok) return []
  return res.json()
}

export default function ShowDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [show, setShow] = useState<any>(null)
  const [episodes, setEpisodes] = useState<any[]>([])
  const [currentEp, setCurrentEp] = useState(0)
  const [loading, setLoading] = useState(true)
  const [inList, setInList] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const s = await getShow(id)
      const e = await getEpisodes(id)
      setShow(s)
      setEpisodes(e)
      setLoading(false)
    }
    load()

    async function getSession() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        setUserToken(session.access_token)
      }
    }
    getSession()
  }, [id])

  useEffect(() => {
    async function checkList() {
      if (!userId || !userToken) return
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Watchlist?user_id=eq.${userId}&show_id=eq.${id}&select=id`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${userToken}`,
          }
        }
      )
      if (!res.ok) return
      const data = await res.json()
      setInList(data.length > 0)
    }
    checkList()
  }, [userId, userToken, id])

  async function toggleList() {
    if (!userId || !userToken) {
      alert('Please sign in to save shows to your list!')
      return
    }
    setListLoading(true)
    if (inList) {
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Watchlist?user_id=eq.${userId}&show_id=eq.${id}`,
        {
          method: 'DELETE',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${userToken}`,
          }
        }
      )
      setInList(false)
    } else {
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Watchlist`,
        {
          method: 'POST',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId, show_id: id })
        }
      )
      setInList(true)
    }
    setListLoading(false)
  }

  function getYouTubeId(url: string) {
    const match = url?.match(/(?:v=|youtu\.be\/)([^&?\s]+)/)
    return match ? match[1] : null
  }

  if (loading) return (
    <>
      <Nav/>
      <div style={{padding: '60px 28px', textAlign: 'center', color: '#FB7185', fontFamily: 'Playfair Display, serif', fontSize: '22px'}}>
        Loading...
      </div>
      <Footer/>
    </>
  )

  if (!show) return (
    <>
      <Nav/>
      <div style={{padding: '60px 28px', textAlign: 'center', color: '#fff', fontSize: '18px'}}>
        Show not found.
      </div>
      <Footer/>
    </>
  )

  const currentEpisode = episodes[currentEp]
  const videoId = currentEpisode ? getYouTubeId(currentEpisode.video_url) : null

  return (
    <>
      <Nav/>

      <div className="player-wrap">
        {videoId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={currentEpisode?.title || 'Episode'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
          />
        ) : (
          <>
            <div className="player-bg"></div>
            <div className="player-overlay"></div>
            <div className="player-center">
              <div style={{color:'rgba(255,255,255,0.4)', fontSize:'14px'}}>No video available</div>
            </div>
          </>
        )}
      </div>

      <div className="below-player">
        <div className="action-bar">
          <button className="action-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Comment
          </button>
          <button
            className="action-btn"
            onClick={toggleList}
            disabled={listLoading}
            style={{color: inList ? '#FB7185' : '#ffffff'}}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={inList ? '#FB7185' : 'none'} stroke={inList ? '#FB7185' : '#ffffff'} strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            {listLoading ? '...' : inList ? 'Saved' : 'My List'}
          </button>
        </div>

        <div className="show-info">
          <div className="show-title">{show.title}</div>
          <div className="show-meta">
            {show.release_year} · {show.episode_count} Episodes · {show.genre}
          </div>
          <div className="show-desc">{show.description}</div>
          {show.cast && (
            <div style={{marginTop: '12px', fontSize: '13px', color: 'rgba(255,255,255,0.6)'}}>
              <span style={{color: '#FB7185'}}>Cast: </span>{show.cast}
            </div>
          )}
        </div>

        {episodes.length > 1 && (
          <div className="recommendations">
            <div className="section-title" style={{padding: '0 0 18px 0'}}>Episodes</div>
            <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
              {episodes.map((ep, i) => (
                <button
                  key={ep.id}
                  onClick={() => setCurrentEp(i)}
                  style={{
                    padding:'8px 16px',
                    borderRadius:'8px',
                    border: i === currentEp ? '1.5px solid #FB7185' : '0.5px solid rgba(255,255,255,0.2)',
                    background: i === currentEp ? 'rgba(251,113,133,0.15)' : 'transparent',
                    color: i === currentEp ? '#FB7185' : '#fff',
                    cursor:'pointer',
                    fontSize:'13px',
                    fontFamily:'inherit'
                  }}
                >
                  Ep {ep.episode_number}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="recommendations">
          <div className="section-title" style={{padding: '0 0 18px 0'}}>You May Also Like</div>
          <div className="cards-row">
            <div className="card"><div className="card-poster"><div className="card-poster-bg p1"><div className="card-overlay"></div></div></div><div className="card-title">The Hidden Empress</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p2"><div className="card-overlay"></div></div></div><div className="card-title">Gilded Cage</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p3"><div className="card-overlay"></div></div></div><div className="card-title">The Dragon&apos;s Bride</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p4"><div className="card-overlay"></div></div></div><div className="card-title">Stolen Hearts</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p5"><div className="card-overlay"></div></div></div><div className="card-title">Love in the Forbidden City</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p6"><div className="card-overlay"></div></div></div><div className="card-title">The CEO&apos;s Secret Wife</div></div>
          </div>
        </div>

        <div className="comments-section">
          <div className="section-title" style={{padding: '0 0 18px 0'}}>Comments</div>
          <div className="comment-input-row">
            <div className="comment-avatar">CK</div>
            <input className="comment-input" placeholder="Add a comment..."/>
          </div>
        </div>
      </div>

      <Footer/>
    </>
  )
}