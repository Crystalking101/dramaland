'use client'
import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const data = {
  shows: ['The CEO\'s Secret Wife','Bound by Contract','His Cold Heart','Midnight Inheritance','Love & Revenge','Dark Obsession','Stolen Vows','The Billionaire\'s Secret','Second Chance','Crimson Fate','The Heir\'s Game','Shattered Crown','Forbidden Love','The Emperor\'s Bride','Hidden Identity','Sweet Revenge','My Cold CEO Husband','The Princess\'s Escape','Dangerous Attraction','A Noble Heart'],
  actors: ['Xiao Zhan','Wang Yibo','Yang Zi','Dilraba Dilmurat','Li Yifeng','Zhao Liying','Dylan Wang','Shen Yue','Chen Zheyuan','Esther Yu'],
  genres: ['CEO Romance','Historical Drama','Fantasy Romance','Revenge Drama','Modern Romance','Ancient Love','Romantic Comedy','Suspense Thriller'],
  tags: ['Contract Marriage','Enemies to Lovers','Second Chance','Reborn','Fake Dating','Arranged Marriage','Hidden Identity','Forbidden Love','Time Travel','Revenge Plot','Cold CEO','Billionaire Romance','Strong Female Lead','Slow Burn','Love Triangle']
}

const cards = [
  { title: "The CEO's Secret Wife", color: 'p1', tag: 'CEO Romance' },
  { title: 'Bound by Contract', color: 'p2', tag: 'Contract Marriage' },
  { title: 'His Cold Heart', color: 'p3', tag: 'CEO Romance' },
  { title: 'Midnight Inheritance', color: 'p4', tag: 'Reborn' },
  { title: 'Love & Revenge', color: 'p5', tag: 'Enemies to Lovers' },
  { title: 'Dark Obsession', color: 'p6', tag: 'Second Chance' },
  { title: 'Stolen Vows', color: 'p7', tag: 'Contract Marriage' },
  { title: "The Billionaire's Secret", color: 'p8', tag: 'Romance' },
  { title: 'Second Chance', color: 'p9', tag: 'Second Chance' },
  { title: 'Crimson Fate', color: 'p10', tag: 'Historical' },
  { title: "The Heir's Game", color: 'p11', tag: 'Reborn' },
  { title: 'Shattered Crown', color: 'p12', tag: 'Fantasy' },
]

export default function Search() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{text: string, type: string}[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  function handleInput(val: string) {
    setQuery(val)
    if (val.trim().length === 0) { setSuggestions([]); setShowSuggestions(false); return }
    const q = val.toLowerCase()
    const results = [
      ...data.shows.filter(s => s.toLowerCase().includes(q)).slice(0,3).map(s => ({ text: s, type: 'Show' })),
      ...data.actors.filter(a => a.toLowerCase().includes(q)).slice(0,2).map(a => ({ text: a, type: 'Actor' })),
      ...data.genres.filter(g => g.toLowerCase().includes(q)).slice(0,2).map(g => ({ text: g, type: 'Genre' })),
      ...data.tags.filter(t => t.toLowerCase().includes(q)).slice(0,3).map(t => ({ text: t, type: 'Tag' })),
    ]
    setSuggestions(results)
    setShowSuggestions(results.length > 0)
  }

  function selectSuggestion(val: string) {
    setQuery(val)
    setShowSuggestions(false)
  }

  return (
    <>
      <Nav/>

      <div className="search-results-header">
        <div className="search-results-wrap">
          <div className="search-bar-large">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search dramas..."
              value={query}
              onChange={e => handleInput(e.target.value)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
          </div>
          {showSuggestions && (
            <div className="suggestions-box">
              {suggestions.map((s, i) => (
                <div key={i} className="suggestion-item" onMouseDown={() => selectSuggestion(s.text)}>
                  <span className="suggestion-text">{s.text}</span>
                  <span className="suggestion-type">{s.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="results-query">
          Results for <span className="pink">&quot;{query || 'CEO romance'}&quot;</span>
        </div>
        <div className="results-count">Showing 12 results</div>
      </div>

      <div className="search-grid">
        {cards.map((card, i) => (
          <div key={i} className="card">
            <div className="card-poster">
              <div className={`card-poster-bg ${card.color}`}>
                <div className="card-overlay"></div>
              </div>
            </div>
            <div className="card-title">{card.title}</div>
            <div className="card-tag-label">{card.tag}</div>
          </div>
        ))}
      </div>

      <Footer/>
    </>
  )
}