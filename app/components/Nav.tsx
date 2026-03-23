'use client'
import { useState, useEffect } from 'react'
import { createClient } from '../../lib/supabase'

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    window.location.href = '/'
  }

  return (
    <nav>
      <div className="nav-left">
        <div className="logo">Drama Land</div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/search">New</a>
          <a href="/search">Popular</a>
          <a href="/search">Updated</a>
        </div>
      </div>
      <div className="nav-right">
        <div className="search">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
            <path d="M10.5 10.5L14 14" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Search dramas...
        </div>

        <div className="user-wrap">
          {user ? (
            <>
              <div className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </div>
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-user-info">
                    <div className="dropdown-name">{user.user_metadata?.full_name || 'Drama Fan'}</div>
                    <div className="dropdown-email">{user.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <a href="/mylist" className="dropdown-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                    </svg>
                    My List
                  </a>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item dropdown-signout" onClick={signOut}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Sign Out
                  </div>
                </div>
              )}
            </>
          ) : (
            <a href="/signin" className="user-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}