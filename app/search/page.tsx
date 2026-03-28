'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any[]>([])
  const [allShows, setAllShows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
      setAllShows(data)
      setLoading(false)
    }
    loadShows()
  }, [])

  useEffect(() => {
    const q = searchParams.get('q') || ''
    setQuery(q)
  }, [searchParams])

  useEffect(() => {
    if (!query.trim()) {
      setResults(allShows)
      return
    }
    const q = query.toLowerCase()
    const filtered = allShows.filter((show: any) =>
      show.title?.toLowerCase().includes(q) ||
      show.genre?.toLowerCase().includes(q) ||
      show.description?.toLowerCase().includes(q) ||
      show.cast?.toLowerCase().includes(q)
    )
    setResults(filtered)
  }, [query, allShows])

  return (
    <>
      <div className="search-results-header">
        <div className="results-query">
          {query ? (
            <>Results for <span className="pink">&quot;{query}&quot;</span></>
          ) : (
            <>All Shows</>
          )}
        </div>
        <div className="results-count">
          {loading ? 'Loading...' : `Showing ${results.length} result${results.length !== 1 ? 's' : ''}`}
        </div>
      </div>

      {loading ? (
        <div style={{textAlign:'center', color:'#FB7185', padding:'60px', fontFamily:'Playfair Display, serif', fontSize:'22px'}}>
          Loading...
        </div>
      ) : results.length === 0 ? (
        <div style={{textAlign:'center', color:'rgba(255,255,255,0.4)', padding:'60px', fontSize:'15px'}}>
          No shows found for &quot;{query}&quot; 🩷
        </div>
      ) : (
        <div className="search-grid">
          {results.map((show: any) => (
            <a href={`/show/${show.id}`} key={show.id} className="card" style={{textDecoration:'none'}}>
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
              <div className="card-title">{show.short_title || show.title}</div>
            </a>
          ))}
        </div>
      )}
    </>
  )
}

export default function Search() {
  return (
    <>
      <Nav/>
      <Suspense fallback={<div style={{textAlign:'center', color:'#FB7185', padding:'60px'}}>Loading...</div>}>
        <SearchContent/>
      </Suspense>
      <Footer/>
    </>
  )
}