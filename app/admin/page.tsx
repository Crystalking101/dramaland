'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const ADMIN_EMAIL = 'support@discoverdramaland.com'

export default function AdminPanel() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [shows, setShows] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('shows')

  // Add Show form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [episodeCount, setEpisodeCount] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [cast, setCast] = useState('')
  const [language, setLanguage] = useState('Chinese')

  // Add Episode form
  const [selectedShowId, setSelectedShowId] = useState('')
  const [epNumber, setEpNumber] = useState('')
  const [epTitle, setEpTitle] = useState('')
  const [epVideoUrl, setEpVideoUrl] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function getSession() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserEmail(session.user.email || null)
        setUserToken(session.access_token)
      }
      setLoading(false)
    }
    getSession()
  }, [])

  useEffect(() => {
    if (userToken) {
      loadShows()
      loadComments()
    }
  }, [userToken])

  async function loadShows() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
      }
    )
    const data = await res.json()
    setShows(data)
  }

  async function loadComments() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Comments?select=*&order=created_at.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
      }
    )
    const data = await res.json()
    setComments(data)
  }

  async function addShow() {
    if (!title || !description) return
    setSaving(true)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows`,
      {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          title,
          description,
          genre,
          release_year: releaseYear ? parseInt(releaseYear) : null,
          episode_count: episodeCount ? parseInt(episodeCount) : null,
          thumbnail_url: thumbnailUrl,
          cast,
          language,
        })
      }
    )
    if (res.ok) {
      setMessage('✅ Show added successfully!')
      setTitle('')
      setDescription('')
      setGenre('')
      setReleaseYear('')
      setEpisodeCount('')
      setThumbnailUrl('')
      setCast('')
      loadShows()
    } else {
      setMessage('❌ Error adding show. Please try again.')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function addEpisode() {
    if (!selectedShowId || !epVideoUrl) return
    setSaving(true)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Episodes`,
      {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          show_id: selectedShowId,
          episode_number: epNumber ? parseInt(epNumber) : 1,
          title: epTitle || `Episode ${epNumber}`,
          video_url: epVideoUrl,
        })
      }
    )
    if (res.ok) {
      setMessage('✅ Episode added successfully!')
      setEpNumber('')
      setEpTitle('')
      setEpVideoUrl('')
    } else {
      setMessage('❌ Error adding episode.')
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function deleteShow(showId: string) {
    if (!confirm('Are you sure you want to delete this show?')) return
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?id=eq.${showId}`,
      {
        method: 'DELETE',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
        }
      }
    )
    loadShows()
  }

  async function deleteComment(commentId: string) {
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Comments?id=eq.${commentId}`,
      {
        method: 'DELETE',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
        }
      }
    )
    loadComments()
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.05)',
    color: '#F0EEE8',
    fontSize: '14px',
    fontFamily: 'inherit',
    marginBottom: '12px',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '4px',
    display: 'block',
  }

  if (loading) return (
    <>
      <Nav/>
      <div style={{padding: '60px 28px', textAlign: 'center', color: '#FB7185', fontSize: '22px', fontFamily: 'Playfair Display, serif'}}>
        Loading...
      </div>
      <Footer/>
    </>
  )

  if (!userEmail || userEmail !== ADMIN_EMAIL) return (
    <>
      <Nav/>
      <div style={{padding: '60px 28px', textAlign: 'center', color: '#fff', fontSize: '18px'}}>
        🔒 Access denied. Admins only.
      </div>
      <Footer/>
    </>
  )

  return (
    <>
      <Nav/>

      <div style={{padding: '40px 28px', maxWidth: '800px', margin: '0 auto'}}>
        <div style={{fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#FB7185', marginBottom: '8px'}}>
          Admin Panel
        </div>
        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px'}}>
          Signed in as {userEmail}
        </div>

        {message && (
          <div style={{padding: '12px 16px', borderRadius: '8px', background: 'rgba(251,113,133,0.15)', border: '1px solid #FB7185', color: '#FB7185', fontSize: '14px', marginBottom: '24px'}}>
            {message}
          </div>
        )}

        <div className="tabs" style={{marginBottom: '32px'}}>
          {['shows', 'add show', 'add episode', 'comments'].map(tab => (
            <div
              key={tab}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
              style={{textTransform: 'capitalize'}}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* ALL SHOWS */}
        {activeTab === 'shows' && (
          <div>
            <div style={{fontSize: '16px', color: '#fff', marginBottom: '16px', fontWeight: '600'}}>
              All Shows ({shows.length})
            </div>
            {shows.map((show: any) => (
              <div key={show.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.08)'}}>
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                  {show.thumbnail_url && (
                    <img src={show.thumbnail_url} alt={show.title} style={{width: '40px', height: '56px', objectFit: 'cover', borderRadius: '6px'}}/>
                  )}
                  <div>
                    <div style={{color: '#F0EEE8', fontSize: '14px', fontWeight: '500'}}>{show.title}</div>
                    <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '12px'}}>{show.genre} · {show.release_year}</div>
                  </div>
                </div>
                <button
                  onClick={() => deleteShow(show.id)}
                  style={{background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.4)', color: '#ff6b6b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ADD SHOW */}
        {activeTab === 'add show' && (
          <div>
            <div style={{fontSize: '16px', color: '#fff', marginBottom: '20px', fontWeight: '600'}}>Add New Show</div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Show title"/>
            <label style={labelStyle}>Description *</label>
            <textarea style={{...inputStyle, height: '100px', resize: 'vertical'}} value={description} onChange={e => setDescription(e.target.value)} placeholder="Show description"/>
            <label style={labelStyle}>Genre</label>
            <input style={inputStyle} value={genre} onChange={e => setGenre(e.target.value)} placeholder="Romance, Drama, Fantasy..."/>
            <label style={labelStyle}>Language</label>
            <input style={inputStyle} value={language} onChange={e => setLanguage(e.target.value)} placeholder="Chinese"/>
            <label style={labelStyle}>Release Year</label>
            <input style={inputStyle} value={releaseYear} onChange={e => setReleaseYear(e.target.value)} placeholder="2024"/>
            <label style={labelStyle}>Episode Count</label>
            <input style={inputStyle} value={episodeCount} onChange={e => setEpisodeCount(e.target.value)} placeholder="24"/>
            <label style={labelStyle}>Thumbnail URL</label>
            <input style={inputStyle} value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="https://..."/>
            <label style={labelStyle}>Cast</label>
            <input style={inputStyle} value={cast} onChange={e => setCast(e.target.value)} placeholder="Actor 1, Actor 2..."/>
            <button
              onClick={addShow}
              disabled={saving || !title || !description}
              style={{padding: '12px 28px', borderRadius: '8px', background: '#FB7185', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: (!title || !description) ? 0.5 : 1}}
            >
              {saving ? 'Adding...' : 'Add Show'}
            </button>
          </div>
        )}

        {/* ADD EPISODE */}
        {activeTab === 'add episode' && (
          <div>
            <div style={{fontSize: '16px', color: '#fff', marginBottom: '20px', fontWeight: '600'}}>Add Episode</div>
            <label style={labelStyle}>Select Show *</label>
            <select style={{...inputStyle, cursor: 'pointer'}} value={selectedShowId} onChange={e => setSelectedShowId(e.target.value)}>
              <option value="">-- Select a show --</option>
              {shows.map((show: any) => (
                <option key={show.id} value={show.id}>{show.title}</option>
              ))}
            </select>
            <label style={labelStyle}>Episode Number</label>
            <input style={inputStyle} value={epNumber} onChange={e => setEpNumber(e.target.value)} placeholder="1"/>
            <label style={labelStyle}>Episode Title</label>
            <input style={inputStyle} value={epTitle} onChange={e => setEpTitle(e.target.value)} placeholder="Episode 1"/>
            <label style={labelStyle}>YouTube URL *</label>
            <input style={inputStyle} value={epVideoUrl} onChange={e => setEpVideoUrl(e.target.value)} placeholder="https://youtu.be/..."/>
            <button
              onClick={addEpisode}
              disabled={saving || !selectedShowId || !epVideoUrl}
              style={{padding: '12px 28px', borderRadius: '8px', background: '#FB7185', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: (!selectedShowId || !epVideoUrl) ? 0.5 : 1}}
            >
              {saving ? 'Adding...' : 'Add Episode'}
            </button>
          </div>
        )}

        {/* COMMENTS */}
        {activeTab === 'comments' && (
          <div>
            <div style={{fontSize: '16px', color: '#fff', marginBottom: '16px', fontWeight: '600'}}>
              All Comments ({comments.length})
            </div>
            {comments.map((c: any) => (
              <div key={c.id} style={{padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.08)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <div style={{color: '#FB7185', fontSize: '13px', fontWeight: '500', marginBottom: '4px'}}>{c.user_name || 'Anonymous'}</div>
                    <div style={{color: '#F0EEE8', fontSize: '14px', marginBottom: '4px'}}>{c.content}</div>
                    <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '12px'}}>{new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  <button
                    onClick={() => deleteComment(c.id)}
                    style={{background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.4)', color: '#ff6b6b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', flexShrink: 0}}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 0'}}>No comments yet!</div>
            )}
          </div>
        )}
      </div>

      <Footer/>
    </>
  )
}