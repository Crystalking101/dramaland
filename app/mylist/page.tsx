'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function MyList() {
  const [activeTab, setActiveTab] = useState('saved')
  const [savedShows, setSavedShows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSaved() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setLoading(false)
        return
      }

      const userId = session.user.id
      const token = session.access_token

      // Get watchlist entries
      const watchRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Watchlist?user_id=eq.${userId}&select=show_id`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${token}`,
          }
        }
      )
      const watchData = await watchRes.json()
      if (!watchData.length) {
        setLoading(false)
        return
      }

      // Get show details for each saved show
      const showIds = watchData.map((w: any) => w.show_id).join(',')
      const showRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?id=in.(${showIds})&select=*`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${token}`,
          }
        }
      )
      const showData = await showRes.json()
      setSavedShows(showData)
      setLoading(false)
    }
    loadSaved()
  }, [])

  return (
    <>
      <Nav/>

      <div className="library-hero">
        <div className="library-title">My List</div>
        <div className="library-sub">Your saved shows and watch history</div>
      </div>

      <div className="tabs">
        <div className={`tab ${activeTab === 'saved' ? 'active' : ''}`} onClick={() => setActiveTab('saved')}>Saved Shows</div>
        <div className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>Watch History</div>
      </div>

      {activeTab === 'saved' && (
        <div className="library-content">
          {loading ? (
            <div style={{textAlign:'center', color:'#FB7185', padding:'40px', fontFamily:'Playfair Display, serif', fontSize:'20px'}}>
              Loading...
            </div>
          ) : savedShows.length === 0 ? (
            <div style={{textAlign:'center', color:'rgba(255,255,255,0.4)', padding:'60px', fontSize:'15px'}}>
              No saved shows yet! Hit the My List button on any show to save it here 🩷
            </div>
          ) : (
            <div className="cards-grid">
              {savedShows.map((show: any) => (
                <a href={`/show/${show.id}`} key={show.id} className="card">
                  <div className="card-poster">
                    {show.thumbnail_url ? (
                      <img
                        src={show.thumbnail_url}
                        alt={show.title}
                        style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'10px'}}
                      />
                    ) : (
                      <div className="card-poster-bg p1"><div className="card-overlay"></div></div>
                    )}
                  </div>
                  <div className="card-title">{show.title}</div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="library-content">
          <div style={{textAlign:'center', color:'rgba(255,255,255,0.4)', padding:'60px', fontSize:'15px'}}>
            Watch history coming soon! 🩷
          </div>
        </div>
      )}

      <Footer/>
    </>
  )
}