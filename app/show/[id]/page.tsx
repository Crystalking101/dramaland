'use client'
import { useState, useEffect, use } from 'react'
import { createClient } from '../../../lib/supabase'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'

const ADMIN_EMAIL = 'crystalking101@gmail.com'

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

async function getSimilarShows(currentId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?id=neq.${currentId}&select=*&limit=6`,
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
  const [similarShows, setSimilarShows] = useState<any[]>([])
  const [currentEp, setCurrentEp] = useState(0)
  const [loading, setLoading] = useState(true)
  const [inList, setInList] = useState(false)
  const [listLoading, setListLoading] = useState(false)
  const [userToken, setUserToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [userName, setUserName] = useState<string | null>(null)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const s = await getShow(id)
      const e = await getEpisodes(id)
      const similar = await getSimilarShows(id)
      setShow(s)
      setEpisodes(e)
      setSimilarShows(similar)
      setLoading(false)
    }
    load()

    async function getSession() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserId(session.user.id)
        setUserToken(session.access_token)
        setUserEmail(session.user.email || null)
        setUserName(session.user.user_metadata?.full_name || session.user.email || null)
      }
    }
    getSession()
    loadComments()
  }, [id])

  async function loadComments() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Comments?show_id=eq.${id}&select=*&order=created_at.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        }
      }
    )
    if (!res.ok) return
    const data = await res.json()
    setComments(data)
  }

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

  async function submitComment() {
    if (!userId || !userToken) {
      alert('Please sign in to comment!')
      return
    }
    if (!commentText.trim()) return
    setCommentLoading(true)
    await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Comments`,
      {
        method: 'POST',
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          show_id: id,
          content: commentText.trim(),
          user_name: userName || userEmail || 'Anonymous'
        })
      }
    )
    setCommentText('')
    setCommentLoading(false)
    loadComments()
  }

  async function deleteComment(commentId: string, commentUserId: string) {
    if (!userToken) return
    const isAdmin = userEmail === ADMIN_EMAIL
    const isOwner = commentUserId === userId
    if (!isAdmin && !isOwner) return
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

  function getYouTubeId(url: string) {
    const match = url?.match(/(?:v=|youtu\.be\/)([^&?\s]+)/)
    return match ? match[1] : null
  }

  function getInitials(name: string) {
    if (!name) return 'U'
    const parts = name.split(' ')
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return name.substring(0, 2).toUpperCase()
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  function handleTagClick(tag: string) {
    setActiveTag(tag)
    window.location.href = `/search?q=${encodeURIComponent(tag.trim())}`
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
  const isAdmin = userEmail === ADMIN_EMAIL

  // Parse tags - combine genre and tags fields
  const allTags = [
    ...(show.genre ? show.genre.split(',').map((t: string) => t.trim()) : []),
    ...(show.tags ? show.tags.split(',').map((t: string) => t.trim()) : []),
  ].filter(Boolean)

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
            frameBorder="auto"
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
          <button
            className="action-btn"
            onClick={() => {
              setShowComments(true)
              setTimeout(() => {
                document.querySelector('.comments-section')?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
            style={{color: showComments ? '#FB7185' : '#ffffff'}}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={showComments ? '#FB7185' : '#ffffff'} strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Comment {comments.length > 0 && `(${comments.length})`}
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
            {show.release_year} · {show.episode_count} Episodes
          </div>

          {allTags.length > 0 && (
            <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginTop:'12px'}}>
              {allTags.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: '1px solid rgba(251,113,133,0.4)',
                    background: activeTag === tag ? '#FB7185' : 'rgba(251,113,133,0.1)',
                    color: activeTag === tag ? '#fff' : '#FB7185',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          <div className="show-desc" style={{marginTop:'12px'}}>{show.description}</div>
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

        {similarShows.length > 0 && (
          <div className="recommendations">
            <div className="section-title" style={{padding: '0 0 18px 0'}}>You May Also Like</div>
            <div className="cards-row">
              {similarShows.map((s: any) => (
                <a href={`/show/${s.id}`} key={s.id} className="card" style={{textDecoration:'none', color:'inherit'}}>
                  <div className="card-poster">
                    {s.thumbnail_url ? (
                      <img
                        src={s.thumbnail_url}
                        alt={s.title}
                        style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'10px'}}
                      />
                    ) : (
                      <div className="card-poster-bg p1"><div className="card-overlay"></div></div>
                    )}
                  </div>
                  <div className="card-title">{s.short_title || s.title}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="comments-section">
          <div className="section-title" style={{padding: '0 0 18px 0'}}>
            Comments {comments.length > 0 && `(${comments.length})`}
          </div>
          <div className="comment-input-row">
            <div className="comment-avatar">
              {userName ? getInitials(userName) : userEmail ? getInitials(userEmail) : '?'}
            </div>
            <input
              className="comment-input"
              placeholder={userId ? 'Add a comment...' : 'Sign in to comment...'}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitComment() }}
              disabled={!userId || commentLoading}
            />
            <button
              onClick={submitComment}
              disabled={!userId || commentLoading || !commentText.trim()}
              style={{
                marginLeft: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#FB7185',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                opacity: (!userId || !commentText.trim()) ? 0.4 : 1
              }}
            >
              {commentLoading ? '...' : 'Post'}
            </button>
          </div>

          {comments.length > 0 && (
            <div style={{marginTop: '20px', display:'flex', flexDirection:'column', gap:'16px'}}>
              {comments.map((c: any) => (
                <div key={c.id} style={{display:'flex', gap:'12px', alignItems:'flex-start'}}>
                  <div className="comment-avatar" style={{flexShrink:0}}>
                    {getInitials(c.user_name || c.user_id)}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <div style={{fontSize:'13px', color:'rgba(255,255,255,0.7)', fontWeight:'500'}}>
                        {c.user_name || 'Anonymous'}
                      </div>
                      {(isAdmin || c.user_id === userId) && (
                        <button
                          onClick={() => deleteComment(c.id, c.user_id)}
                          style={{
                            background: 'rgba(251,113,133,0.15)',
                            border: '1px solid #FB7185',
                            color: '#FB7185',
                            cursor: 'pointer',
                            fontSize: '12px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', marginBottom:'4px'}}>
                      {timeAgo(c.created_at)}
                    </div>
                    <div style={{fontSize:'14px', color:'#F0EEE8'}}>
                      {c.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {comments.length === 0 && (
            <div style={{textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:'13px', padding:'24px 0'}}>
              No comments yet — be the first! 🩷
            </div>
          )}
        </div>
      </div>

      <Footer/>
    </>
  )
}