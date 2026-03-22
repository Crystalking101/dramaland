'use client'
import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function MyList() {
  const [activeTab, setActiveTab] = useState('saved')

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
          <div className="cards-grid">
            <div className="card"><div className="card-poster"><div className="card-poster-bg p1"><div className="card-overlay"></div></div></div><div className="card-title">Midnight Inheritance</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p2"><div className="card-overlay"></div></div></div><div className="card-title">Bound by Contract</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p3"><div className="card-overlay"></div></div></div><div className="card-title">The Hidden Empress</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p4"><div className="card-overlay"></div></div></div><div className="card-title">Dark Obsession</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p5"><div className="card-overlay"></div></div></div><div className="card-title">Stolen Hearts</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p6"><div className="card-overlay"></div></div></div><div className="card-title">The CEO&apos;s Secret Wife</div></div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="library-content">
          <div className="history-list">
            <div className="history-item">
              <div className="history-thumb"><div className="history-thumb-bg p1"></div></div>
              <div className="history-info">
                <div className="history-title">Midnight Inheritance</div>
                <div className="history-ep">Episode 8 — Heart of Darkness</div>
                <div className="history-bar"><div className="history-fill" style={{width:'65%'}}></div></div>
              </div>
              <div className="history-time">2 hours ago</div>
            </div>
            <div className="history-item">
              <div className="history-thumb"><div className="history-thumb-bg p3"></div></div>
              <div className="history-info">
                <div className="history-title">The Hidden Empress</div>
                <div className="history-ep">Episode 3 — The Secret Revealed</div>
                <div className="history-bar"><div className="history-fill" style={{width:'30%'}}></div></div>
              </div>
              <div className="history-time">Yesterday</div>
            </div>
            <div className="history-item">
              <div className="history-thumb"><div className="history-thumb-bg p5"></div></div>
              <div className="history-info">
                <div className="history-title">Bound by Contract</div>
                <div className="history-ep">Episode 12 — The Final Vow</div>
                <div className="history-bar"><div className="history-fill" style={{width:'100%'}}></div></div>
              </div>
              <div className="history-time">3 days ago</div>
            </div>
            <div className="history-item">
              <div className="history-thumb"><div className="history-thumb-bg p2"></div></div>
              <div className="history-info">
                <div className="history-title">Dark Obsession</div>
                <div className="history-ep">Episode 1 — The Encounter</div>
                <div className="history-bar"><div className="history-fill" style={{width:'15%'}}></div></div>
              </div>
              <div className="history-time">Last week</div>
            </div>
          </div>
        </div>
      )}

      <Footer/>
    </>
  )
}