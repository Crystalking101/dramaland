'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const ADMIN_EMAIL = 'crystalking101@gmail.com'

export default function AdminPanel() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [shows, setShows] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])
  const [actors, setActors] = useState<any[]>([])
  const [actorShows, setActorShows] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('shows')
  const [showSearch, setShowSearch] = useState('')
  const [showHiddenOnly, setShowHiddenOnly] = useState(false)
  const [actorSearch, setActorSearch] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [genre, setGenre] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [episodeCount, setEpisodeCount] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [backdropUrl, setBackdropUrl] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [cast, setCast] = useState('')
  const [language, setLanguage] = useState('Chinese')
  const [videoUrl, setVideoUrl] = useState('')

  const [selectedShowId, setSelectedShowId] = useState('')
  const [epNumber, setEpNumber] = useState('')
  const [epTitle, setEpTitle] = useState('')
  const [epVideoUrl, setEpVideoUrl] = useState('')

  // Actor form fields
  const [actorName, setActorName] = useState('')
  const [actorPhotoUrl, setActorPhotoUrl] = useState('')
  const [actorBio, setActorBio] = useState('')
  const [actorFunFacts, setActorFunFacts] = useState('')
  const [actorUpcomingWork, setActorUpcomingWork] = useState('')
  const [actorInstagram, setActorInstagram] = useState('')
  const [actorWeibo, setActorWeibo] = useState('')
  const [actorYoutube, setActorYoutube] = useState('')
  const [actorFeaturedVideoUrl, setActorFeaturedVideoUrl] = useState('')
  const [actorIsTrending, setActorIsTrending] = useState(false)
  const [actorSelectedShowIds, setActorSelectedShowIds] = useState<string[]>([])
  const [editingActorId, setEditingActorId] = useState<string | null>(null)

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [expandedShowId, setExpandedShowId] = useState<string | null>(null)
  const [editBackdropUrl, setEditBackdropUrl] = useState('')

  useEffect(() => {
    async function getSession() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserEmail(session.user.email || null)
        setUserToken(session.access_token)
      } else {
        const { data: { session: refreshed } } = await supabase.auth.refreshSession()
        if (refreshed?.user) {
          setUserEmail(refreshed.user.email || null)
          setUserToken(refreshed.access_token)
        }
      }
      setLoading(false)
    }
    getSession()
  }, [])

  useEffect(() => {
    if (userToken) {
      loadShows()
      loadComments()
      loadActors()
      loadActorShows()
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

  async function loadActors() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actors?select=*&order=sort_order.asc,created_at.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
      }
    )
    const data = await res.json()
    setActors(data)
  }

  async function loadActorShows() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actor_Shows?select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
      }
    )
    const data = await res.json()
    setActorShows(data)
  }

  async function addShow() {
    if (!title || !description) return
    setSaving(true)

    const showRes = await fetch(
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
          title, description, genre,
          release_year: releaseYear ? parseInt(releaseYear) : null,
          episode_count: episodeCount ? parseInt(episodeCount) : null,
          thumbnail_url: thumbnailUrl,
          backdrop_url: backdropUrl || null,
          is_featured: isFeatured,
          language, cast,
          video_url: videoUrl || null,
        })
      }
    )

    if (!showRes.ok) {
      const err = await showRes.json()
      setMessage(`❌ Error: ${JSON.stringify(err)}`)
      setSaving(false)
      setTimeout(() => setMessage(''), 8000)
      return
    }

    const showData = await showRes.json()
    const newShowId = showData[0]?.id

    if (newShowId && videoUrl) {
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Episodes`,
        {
          method: 'POST',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            show_id: newShowId,
            episode_number: 1,
            title: 'Episode 1',
            video_url: videoUrl,
          })
        }
      )
    }

    setMessage('✅ Show added successfully!')
    setTitle(''); setDescription(''); setGenre(''); setReleaseYear('')
    setEpisodeCount(''); setThumbnailUrl(''); setBackdropUrl('')
    setIsFeatured(false); setCast(''); setVideoUrl('')
    loadShows()
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
      setEpNumber(''); setEpTitle(''); setEpVideoUrl('')
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

  async function toggleField(show: any, field: string, current: boolean) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?id=eq.${show.id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ [field]: !current })
      }
    )
    if (!res.ok) {
      const err = await res.text()
      setMessage(`❌ Error: ${res.status} — ${err}`)
      setTimeout(() => setMessage(''), 6000)
      return
    }
    setMessage('✅ Updated successfully!')
    setTimeout(() => setMessage(''), 3000)
    loadShows()
  }

  async function saveBackdrop(showId: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?id=eq.${showId}`,
      {
        method: 'PATCH',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ backdrop_url: editBackdropUrl })
      }
    )
    if (!res.ok) {
      const err = await res.text()
      setMessage(`❌ Error saving backdrop: ${res.status} — ${err}`)
      setTimeout(() => setMessage(''), 6000)
      return
    }
    setExpandedShowId(null)
    setEditBackdropUrl('')
    setMessage('✅ Backdrop saved! Hero banner is ready.')
    loadShows()
    setTimeout(() => setMessage(''), 3000)
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

  function resetActorForm() {
    setActorName(''); setActorPhotoUrl(''); setActorBio('')
    setActorFunFacts(''); setActorUpcomingWork('')
    setActorInstagram(''); setActorWeibo(''); setActorYoutube('')
    setActorFeaturedVideoUrl(''); setActorIsTrending(false)
    setActorSelectedShowIds([])
    setEditingActorId(null)
  }

  function startEditActor(actor: any) {
    setEditingActorId(actor.id)
    setActorName(actor.name || '')
    setActorPhotoUrl(actor.photo_url || '')
    setActorBio(actor.bio || '')
    setActorFunFacts((actor.fun_facts || []).join(', '))
    setActorUpcomingWork((actor.upcoming_work || []).join(', '))
    setActorInstagram(actor.social_links?.instagram || '')
    setActorWeibo(actor.social_links?.weibo || '')
    setActorYoutube(actor.social_links?.youtube || '')
    setActorFeaturedVideoUrl(actor.featured_video_url || '')
    setActorIsTrending(!!actor.is_trending)
    setActorSelectedShowIds(actorShows.filter(link => link.actor_id === actor.id).map(link => link.show_id))
    setActiveTab('add actor')
  }

  async function saveActor() {
    if (!actorName) return
    setSaving(true)

    const payload = {
      name: actorName,
      photo_url: actorPhotoUrl || null,
      bio: actorBio || null,
      fun_facts: actorFunFacts ? actorFunFacts.split(',').map(s => s.trim()).filter(Boolean) : [],
      upcoming_work: actorUpcomingWork ? actorUpcomingWork.split(',').map(s => s.trim()).filter(Boolean) : [],
      social_links: {
        instagram: actorInstagram || undefined,
        weibo: actorWeibo || undefined,
        youtube: actorYoutube || undefined,
      },
      featured_video_url: actorFeaturedVideoUrl || null,
      is_trending: actorIsTrending,
    }

    let actorId = editingActorId

    if (editingActorId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actors?id=eq.${editingActorId}`,
        {
          method: 'PATCH',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(payload)
        }
      )
      if (!res.ok) {
        const err = await res.text()
        setMessage(`❌ Error: ${res.status} — ${err}`)
        setSaving(false)
        setTimeout(() => setMessage(''), 8000)
        return
      }
    } else {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actors`,
        {
          method: 'POST',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
          },
          body: JSON.stringify(payload)
        }
      )
      if (!res.ok) {
        const err = await res.json()
        setMessage(`❌ Error: ${JSON.stringify(err)}`)
        setSaving(false)
        setTimeout(() => setMessage(''), 8000)
        return
      }
      const data = await res.json()
      actorId = data[0]?.id
    }

    // Sync Actor_Shows: delete existing links for this actor, then re-insert selected ones
    if (actorId) {
      await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actor_Shows?actor_id=eq.${actorId}`,
        {
          method: 'DELETE',
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${userToken}`,
          }
        }
      )
      if (actorSelectedShowIds.length > 0) {
        await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actor_Shows`,
          {
            method: 'POST',
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              Authorization: `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(actorSelectedShowIds.map(show_id => ({ actor_id: actorId, show_id })))
          }
        )
      }
    }

    setMessage(editingActorId ? '✅ Actor updated successfully!' : '✅ Actor added successfully!')
    resetActorForm()
    loadActors()
    loadActorShows()
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function deleteActor(actorId: string) {
    if (!confirm('Are you sure you want to delete this actor?')) return
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actors?id=eq.${actorId}`,
      {
        method: 'DELETE',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
        }
      }
    )
    loadActors()
    loadActorShows()
  }

  async function toggleActorTrending(actor: any) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Actors?id=eq.${actor.id}`,
      {
        method: 'PATCH',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ is_trending: !actor.is_trending })
      }
    )
    if (!res.ok) {
      const err = await res.text()
      setMessage(`❌ Error: ${res.status} — ${err}`)
      setTimeout(() => setMessage(''), 6000)
      return
    }
    loadActors()
  }

  function toggleActorShowSelection(showId: string) {
    setActorSelectedShowIds(prev =>
      prev.includes(showId) ? prev.filter(id => id !== showId) : [...prev, showId]
    )
  }

  function normalizeName(name: string) {
    return name.toLowerCase().replace(/[\s\-_.]/g, '')
  }

  function findShowsByCast() {
    if (!actorName.trim()) return
    const nameNormalized = normalizeName(actorName)
    const matches = shows
      .filter((show: any) => show.cast && normalizeName(show.cast).includes(nameNormalized))
      .map((show: any) => show.id)
    setActorSelectedShowIds(prev => Array.from(new Set([...prev, ...matches])))
    setMessage(matches.length > 0 ? `✅ Found ${matches.length} matching show${matches.length === 1 ? '' : 's'} from cast` : '❌ No shows found with that name in cast')
    setTimeout(() => setMessage(''), 4000)
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

  function toggleBtn(active: boolean, label: string, onClick: () => void) {
    return (
      <button
        onClick={onClick}
        style={{
          background: active ? 'rgba(251,113,133,0.2)' : 'rgba(255,255,255,0.08)',
          border: `1px solid ${active ? '#FB7185' : 'rgba(255,255,255,0.2)'}`,
          color: active ? '#FB7185' : 'rgba(255,255,255,0.5)',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {label}
      </button>
    )
  }

  const filteredShows = shows
    .filter(show =>
      show.title?.toLowerCase().includes(showSearch.toLowerCase()) || show.id?.toLowerCase().includes(showSearch.toLowerCase())
    )
    .filter(show => showHiddenOnly ? show.is_published === false : true)

  const filteredActors = actors.filter(actor =>
    actor.name?.toLowerCase().includes(actorSearch.toLowerCase())
  )

  function actorShowCount(actorId: string) {
    return actorShows.filter(link => link.actor_id === actorId).length
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
        🔒 Access denied. Admins only. <br/>
        <span style={{fontSize: '13px', color: '#FB7185'}}>Detected email: {userEmail || 'not signed in'}</span>
      </div>
      <Footer/>
    </>
  )

  return (
    <>
      <Nav/>
      <div style={{padding: '40px 28px', maxWidth: '800px', margin: '0 auto'}}>
        <div style={{fontFamily: 'Playfair Display, serif', fontSize: '28px', color: '#FB7185', marginBottom: '8px'}}>Admin Panel</div>
        <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '32px'}}>Signed in as {userEmail}</div>

        {message && (
          <div style={{padding: '12px 16px', borderRadius: '8px', background: message.startsWith('❌') ? 'rgba(255,50,50,0.15)' : 'rgba(251,113,133,0.15)', border: `1px solid ${message.startsWith('❌') ? 'rgba(255,50,50,0.6)' : '#FB7185'}`, color: message.startsWith('❌') ? '#ff6b6b' : '#FB7185', fontSize: '14px', marginBottom: '24px'}}>
            {message}
          </div>
        )}

        <div className="tabs" style={{marginBottom: '32px', flexWrap: 'wrap' as const}}>
          {['shows', 'add show', 'add episode', 'actors', 'add actor', 'comments'].map(tab => (
            <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => { if (tab !== 'add actor') resetActorForm(); setActiveTab(tab) }} style={{textTransform: 'capitalize'}}>{tab}</div>
          ))}
        </div>

        {activeTab === 'shows' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' as const}}>
              <div style={{fontSize: '16px', color: '#fff', fontWeight: '600'}}>All Shows ({filteredShows.length}{showSearch || showHiddenOnly ? ` of ${shows.length}` : ''})</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' as const}}>
                <button
                  onClick={() => setShowHiddenOnly(!showHiddenOnly)}
                  style={{
                    background: showHiddenOnly ? 'rgba(251,113,133,0.2)' : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${showHiddenOnly ? '#FB7185' : 'rgba(255,255,255,0.2)'}`,
                    color: showHiddenOnly ? '#FB7185' : 'rgba(255,255,255,0.5)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    whiteSpace: 'nowrap' as const,
                  }}
                >
                  🙈 Hidden Only
                </button>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px 14px', flex: 1, maxWidth: '280px'}}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
                    <path d="M10.5 10.5L14 14" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <input type="text" placeholder="Search shows..." value={showSearch} onChange={e => setShowSearch(e.target.value)} style={{background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '100%', fontFamily: 'inherit'}}/>
                  {showSearch && <button onClick={() => setShowSearch('')} style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px', padding: 0, lineHeight: 1}}>×</button>}
                </div>
              </div>
            </div>

            {filteredShows.length === 0 && <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 0'}}>{showHiddenOnly ? 'No hidden shows.' : `No shows found for "${showSearch}"`}</div>}

            {filteredShows.map((show: any) => (
              <div key={show.id} style={{borderRadius: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', border: `1px solid ${show.is_featured ? 'rgba(251,113,133,0.4)' : 'rgba(255,255,255,0.08)'}`, overflow: 'hidden'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', flexWrap: 'wrap', gap: '10px'}}>
                  <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    {show.thumbnail_url && <img src={show.thumbnail_url} alt={show.title} referrerPolicy="no-referrer" style={{width: '40px', height: '56px', objectFit: 'cover', borderRadius: '6px'}}/>}
                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                        <div style={{color: '#F0EEE8', fontSize: '14px', fontWeight: '500'}}>{show.title}</div>
                        {show.is_featured && <span style={{fontSize: '10px', background: '#FB7185', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: '600'}}>FEATURED</span>}
                        {show.is_hot_pick && <span style={{fontSize: '10px', background: 'rgba(255,150,50,0.3)', color: '#ffaa50', padding: '2px 7px', borderRadius: '4px', fontWeight: '600'}}>🔥 HOT</span>}
                        {show.is_fan_favorite && <span style={{fontSize: '10px', background: 'rgba(100,200,100,0.2)', color: '#80e080', padding: '2px 7px', borderRadius: '4px', fontWeight: '600'}}>⭐ FAV</span>}
                        {show.is_spicy && <span style={{fontSize: '10px', background: 'rgba(255,80,80,0.2)', color: '#ff8080', padding: '2px 7px', borderRadius: '4px', fontWeight: '600'}}>🌶️ SPICY</span>}
                      </div>
                      <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '12px'}}>{show.genre} · {show.release_year}</div>
                      {show.backdrop_url && <div style={{color: 'rgba(251,113,133,0.6)', fontSize: '11px', marginTop: '2px'}}>✓ Backdrop uploaded</div>}
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0}}>
                    <button onClick={() => { setExpandedShowId(expandedShowId === show.id ? null : show.id); setEditBackdropUrl(show.backdrop_url || '') }} style={{background: show.backdrop_url ? 'rgba(251,113,133,0.2)' : 'rgba(255,255,255,0.08)', border: `1px solid ${show.backdrop_url ? '#FB7185' : 'rgba(255,255,255,0.2)'}`, color: show.backdrop_url ? '#FB7185' : 'rgba(255,255,255,0.5)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>🖼 Backdrop</button>
                    {toggleBtn(show.is_featured, show.is_featured ? '★ Featured' : '☆ Feature', () => toggleField(show, 'is_featured', show.is_featured))}
                    {toggleBtn(show.is_hot_pick, show.is_hot_pick ? '🔥 Hot' : '🔥 Hot Pick', () => toggleField(show, 'is_hot_pick', show.is_hot_pick))}
                    {toggleBtn(show.is_fan_favorite, show.is_fan_favorite ? '⭐ Fav' : '⭐ Fan Fav', () => toggleField(show, 'is_fan_favorite', show.is_fan_favorite))}
                    {toggleBtn(show.is_spicy, show.is_spicy ? '🌶️ Spicy' : '🌶️ Spicy', () => toggleField(show, 'is_spicy', show.is_spicy))}
                    <button onClick={() => deleteShow(show.id)} style={{background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.4)', color: '#ff6b6b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>Delete</button>
                  </div>
                </div>
                {expandedShowId === show.id && (
                  <div style={{padding: '12px 16px', borderTop: '1px solid rgba(251,113,133,0.2)', background: 'rgba(251,113,133,0.05)'}}>
                    <div style={{fontSize: '12px', color: '#FB7185', marginBottom: '8px', fontWeight: '600'}}>🎬 Paste a landscape backdrop image URL for the hero banner:</div>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <input style={{...inputStyle, marginBottom: 0, flex: 1}} value={editBackdropUrl} onChange={e => setEditBackdropUrl(e.target.value)} placeholder="https://... (wide/landscape image, 1280×720 recommended)"/>
                      <button onClick={() => saveBackdrop(show.id)} style={{padding: '10px 18px', borderRadius: '8px', background: '#FB7185', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', flexShrink: 0}}>Save</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
            <input style={inputStyle} value={thumbnailUrl} onChange={e => setThumbnailUrl(e.target.value)} placeholder="https://... (portrait poster)"/>
            <label style={labelStyle}>Backdrop URL <span style={{color: '#FB7185'}}>(landscape image for hero banner)</span></label>
            <input style={inputStyle} value={backdropUrl} onChange={e => setBackdropUrl(e.target.value)} placeholder="https://... (wide/landscape image, 1280×720 recommended)"/>
            <label style={labelStyle}>Cast</label>
            <input style={inputStyle} value={cast} onChange={e => setCast(e.target.value)} placeholder="Actor 1, Actor 2..."/>
            <label style={labelStyle}>Episode 1 YouTube/Dailymotion URL</label>
            <input style={inputStyle} value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtu.be/... or https://dai.ly/..."/>
            <div onClick={() => setIsFeatured(!isFeatured)} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '8px', border: `1px solid ${isFeatured ? '#FB7185' : 'rgba(255,255,255,0.15)'}`, background: isFeatured ? 'rgba(251,113,133,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', marginBottom: '20px'}}>
              <div style={{width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${isFeatured ? '#FB7185' : 'rgba(255,255,255,0.3)'}`, background: isFeatured ? '#FB7185' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                {isFeatured && <span style={{color: '#fff', fontSize: '13px', lineHeight: 1}}>✓</span>}
              </div>
              <div>
                <div style={{color: '#F0EEE8', fontSize: '14px', fontWeight: '500'}}>Feature this show on homepage</div>
                <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '12px'}}>Appears in the hero banner carousel</div>
              </div>
            </div>
            <button onClick={addShow} disabled={saving || !title || !description} style={{padding: '12px 28px', borderRadius: '8px', background: '#FB7185', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: (!title || !description) ? 0.5 : 1}}>
              {saving ? 'Adding...' : 'Add Show'}
            </button>
          </div>
        )}

        {activeTab === 'add episode' && (
          <div>
            <div style={{fontSize: '16px', color: '#fff', marginBottom: '20px', fontWeight: '600'}}>Add Episode</div>
            <label style={labelStyle}>Select Show *</label>
            <select style={{...inputStyle, cursor: 'pointer'}} value={selectedShowId} onChange={e => setSelectedShowId(e.target.value)}>
              <option value="">-- Select a show --</option>
              {shows.map((show: any) => <option key={show.id} value={show.id}>{show.title}</option>)}
            </select>
            <label style={labelStyle}>Episode Number</label>
            <input style={inputStyle} value={epNumber} onChange={e => setEpNumber(e.target.value)} placeholder="1"/>
            <label style={labelStyle}>Episode Title</label>
            <input style={inputStyle} value={epTitle} onChange={e => setEpTitle(e.target.value)} placeholder="Episode 1"/>
            <label style={labelStyle}>YouTube / Dailymotion URL *</label>
            <input style={inputStyle} value={epVideoUrl} onChange={e => setEpVideoUrl(e.target.value)} placeholder="https://youtu.be/... or https://dai.ly/..."/>
            <button onClick={addEpisode} disabled={saving || !selectedShowId || !epVideoUrl} style={{padding: '12px 28px', borderRadius: '8px', background: '#FB7185', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: (!selectedShowId || !epVideoUrl) ? 0.5 : 1}}>
              {saving ? 'Adding...' : 'Add Episode'}
            </button>
          </div>
        )}

        {activeTab === 'actors' && (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '12px'}}>
              <div style={{fontSize: '16px', color: '#fff', fontWeight: '600'}}>All Actors ({filteredActors.length}{actorSearch ? ` of ${actors.length}` : ''})</div>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', padding: '8px 14px', flex: 1, maxWidth: '280px'}}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
                  <path d="M10.5 10.5L14 14" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input type="text" placeholder="Search actors..." value={actorSearch} onChange={e => setActorSearch(e.target.value)} style={{background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: '13px', width: '100%', fontFamily: 'inherit'}}/>
                {actorSearch && <button onClick={() => setActorSearch('')} style={{background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '16px', padding: 0, lineHeight: 1}}>×</button>}
              </div>
            </div>

            {filteredActors.length === 0 && <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 0'}}>No actors found{actorSearch ? ` for "${actorSearch}"` : ''}</div>}

            {filteredActors.map((actor: any) => (
              <div key={actor.id} style={{borderRadius: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', border: `1px solid ${actor.is_trending ? 'rgba(251,113,133,0.4)' : 'rgba(255,255,255,0.08)'}`, overflow: 'hidden'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', flexWrap: 'wrap', gap: '10px'}}>
                  <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    {actor.photo_url && <img src={actor.photo_url} alt={actor.name} referrerPolicy="no-referrer" style={{width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px'}}/>}
                    <div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
                        <div style={{color: '#F0EEE8', fontSize: '14px', fontWeight: '500'}}>{actor.name}</div>
                        {actor.is_trending && <span style={{fontSize: '10px', background: '#FB7185', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: '600'}}>TRENDING</span>}
                      </div>
                      <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '12px'}}>{actorShowCount(actor.id)} show{actorShowCount(actor.id) === 1 ? '' : 's'} linked</div>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0}}>
                    {toggleBtn(actor.is_trending, actor.is_trending ? '★ Trending' : '☆ Trending', () => toggleActorTrending(actor))}
                    <button onClick={() => startEditActor(actor)} style={{background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>Edit</button>
                    <button onClick={() => deleteActor(actor.id)} style={{background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.4)', color: '#ff6b6b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'add actor' && (
          <div>
            <div style={{fontSize: '16px', color: '#fff', marginBottom: '20px', fontWeight: '600'}}>{editingActorId ? 'Edit Actor' : 'Add New Actor'}</div>
            <label style={labelStyle}>Name *</label>
            <input style={inputStyle} value={actorName} onChange={e => setActorName(e.target.value)} placeholder="Actor name"/>
            <label style={labelStyle}>Photo URL</label>
            <input style={inputStyle} value={actorPhotoUrl} onChange={e => setActorPhotoUrl(e.target.value)} placeholder="https://... (portrait, uploaded via imgbb)"/>
            <label style={labelStyle}>Bio</label>
            <textarea style={{...inputStyle, height: '90px', resize: 'vertical'}} value={actorBio} onChange={e => setActorBio(e.target.value)} placeholder="Short bio"/>
            <label style={labelStyle}>Fun Facts <span style={{color: 'rgba(255,255,255,0.35)'}}>(comma-separated)</span></label>
            <input style={inputStyle} value={actorFunFacts} onChange={e => setActorFunFacts(e.target.value)} placeholder="Trained in classical dance, Speaks 3 languages..."/>
            <label style={labelStyle}>Upcoming Work <span style={{color: 'rgba(255,255,255,0.35)'}}>(comma-separated)</span></label>
            <input style={inputStyle} value={actorUpcomingWork} onChange={e => setActorUpcomingWork(e.target.value)} placeholder="New drama title (2027), Film premiere (2027)..."/>
            <label style={labelStyle}>Instagram URL</label>
            <input style={inputStyle} value={actorInstagram} onChange={e => setActorInstagram(e.target.value)} placeholder="https://instagram.com/..."/>
            <label style={labelStyle}>Weibo URL</label>
            <input style={inputStyle} value={actorWeibo} onChange={e => setActorWeibo(e.target.value)} placeholder="https://weibo.com/..."/>
            <label style={labelStyle}>YouTube URL</label>
            <input style={inputStyle} value={actorYoutube} onChange={e => setActorYoutube(e.target.value)} placeholder="https://youtube.com/..."/>
            <label style={labelStyle}>Featured Video URL <span style={{color: 'rgba(255,255,255,0.35)'}}>(trailer or interview embed)</span></label>
            <input style={inputStyle} value={actorFeaturedVideoUrl} onChange={e => setActorFeaturedVideoUrl(e.target.value)} placeholder="https://youtu.be/... or https://dai.ly/..."/>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
              <label style={{...labelStyle, marginBottom: 0}}>Link to Shows on Drama Land</label>
              <button
                onClick={findShowsByCast}
                disabled={!actorName.trim()}
                style={{
                  background: 'rgba(251,113,133,0.15)',
                  border: '1px solid #FB7185',
                  color: '#FB7185',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  opacity: !actorName.trim() ? 0.5 : 1,
                }}
              >
                🔎 Find from Cast
              </button>
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px'}}>
              {shows.map((show: any) => (
                <button
                  key={show.id}
                  onClick={() => toggleActorShowSelection(show.id)}
                  style={{
                    background: actorSelectedShowIds.includes(show.id) ? 'rgba(251,113,133,0.2)' : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${actorSelectedShowIds.includes(show.id) ? '#FB7185' : 'rgba(255,255,255,0.2)'}`,
                    color: actorSelectedShowIds.includes(show.id) ? '#FB7185' : 'rgba(255,255,255,0.5)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {show.title}
                </button>
              ))}
              {shows.length === 0 && <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '13px'}}>No shows yet — add a show first.</div>}
            </div>

            <div onClick={() => setActorIsTrending(!actorIsTrending)} style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '8px', border: `1px solid ${actorIsTrending ? '#FB7185' : 'rgba(255,255,255,0.15)'}`, background: actorIsTrending ? 'rgba(251,113,133,0.1)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', marginBottom: '20px'}}>
              <div style={{width: '20px', height: '20px', borderRadius: '4px', border: `2px solid ${actorIsTrending ? '#FB7185' : 'rgba(255,255,255,0.3)'}`, background: actorIsTrending ? '#FB7185' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                {actorIsTrending && <span style={{color: '#fff', fontSize: '13px', lineHeight: 1}}>✓</span>}
              </div>
              <div>
                <div style={{color: '#F0EEE8', fontSize: '14px', fontWeight: '500'}}>Show in Fan Favorites row on homepage</div>
                <div style={{color: 'rgba(255,255,255,0.4)', fontSize: '12px'}}>Appears in the trending actors row (max 4 shown)</div>
              </div>
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={saveActor} disabled={saving || !actorName} style={{padding: '12px 28px', borderRadius: '8px', background: '#FB7185', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: !actorName ? 0.5 : 1}}>
                {saving ? 'Saving...' : editingActorId ? 'Save Changes' : 'Add Actor'}
              </button>
              {editingActorId && (
                <button onClick={() => { resetActorForm(); setActiveTab('actors') }} style={{padding: '12px 28px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '14px', fontWeight: '600'}}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            <div style={{fontSize: '16px', color: '#fff', marginBottom: '16px', fontWeight: '600'}}>All Comments ({comments.length})</div>
            {comments.map((c: any) => (
              <div key={c.id} style={{padding: '14px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.08)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <div style={{color: '#FB7185', fontSize: '13px', fontWeight: '500', marginBottom: '4px'}}>{c.user_name || 'Anonymous'}</div>
                    <div style={{color: '#F0EEE8', fontSize: '14px', marginBottom: '4px'}}>{c.content}</div>
                    <div style={{color: 'rgba(255,255,255,0.3)', fontSize: '12px'}}>{new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => deleteComment(c.id)} style={{background: 'rgba(255,50,50,0.15)', border: '1px solid rgba(255,50,50,0.4)', color: '#ff6b6b', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', flexShrink: 0}}>Delete</button>
                </div>
              </div>
            ))}
            {comments.length === 0 && <div style={{textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 0'}}>No comments yet!</div>}
          </div>
        )}
      </div>
      <Footer/>
    </>
  )
}
