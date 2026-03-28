'use client'
import { useState, useEffect, useRef } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const episodes = [
  'The Encounter', 'Forbidden Attraction', 'The Secret Contract',
  'A Dangerous Game', 'Torn Between Two Worlds', 'The Truth Unravels',
  'Heart of Darkness', 'No Turning Back'
]

export default function ShowDetail() {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentEp, setCurrentEp] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  function togglePlay() {
    setPlaying(prev => {
      if (!prev) {
        intervalRef.current = setInterval(() => {
          setProgress(p => {
            if (p >= 100) {
              setCurrentEp(ep => (ep + 1) % episodes.length)
              return 0
            }
            return p + 0.5
          })
        }, 60)
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
      return !prev
    })
  }

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <>
      <Nav/>

      <div className="player-wrap" onClick={togglePlay}>
        <div className="player-bg"></div>
        <div className="player-overlay"></div>
        <div className="player-center">
          <button className="play-btn">
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#0E0A0D">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 12 12" fill="#0E0A0D">
                <polygon points="2,1 11,6 2,11"/>
              </svg>
            )}
          </button>
        </div>
        <div className="player-bottom">
          <div className="now-playing">Episode {currentEp + 1}</div>
          <div className="ep-title">{episodes[currentEp]} — Midnight Inheritance</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${progress}%`}}></div>
          </div>
        </div>
      </div>

      <div className="below-player">
        <div className="action-bar">
          <button className="action-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Comment
          </button>
          <button className="action-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            My List
          </button>
        </div>

        <div className="show-info">
          <div className="show-title">Midnight Inheritance</div>
          <div className="show-meta">2025 · 24 Episodes · Drama · Romance</div>
          <div className="show-tags">
            <span className="show-tag">CEO Romance</span>
            <span className="show-tag">Reborn</span>
            <span className="show-tag">Enemies to Lovers</span>
          </div>
          <div className="show-desc">A powerful CEO discovers his new assistant is the reincarnation of his first love. As their past lives unravel, they must choose between duty and destiny in this sweeping romance set across two lifetimes.</div>
        </div>

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