'use client'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase'

export default function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const router = useRouter()
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

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [searchOpen])

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    setMenuOpen(false)
    window.location.href = '/'
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        if (pathname === '/search') {
          router.replace(`/search?q=${encodeURIComponent(value.trim())}`)
        } else {
          router.push(`/search?q=${encodeURIComponent(value.trim())}`)
        }
      }
    }, 400)
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
    if (e.key === 'Escape') {
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'New', href: '/recent' },
    { label: 'Popular', href: '/trending' },
    { label: 'My List', href: '/mylist' },
  ]

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 28px', border: 'none', background: 'rgba(14,10,13,0.95)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', position: 'relative', zIndex: 100}}>
        <div className="nav-left">
          <a href="/" style={{textDecoration: 'none'}}><div className="logo">Drama Land</div></a>

          {/* Desktop links with active pink pill */}
          <div className="nav-links">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: '15px',
                  cursor: 'pointer',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  letterSpacing: '0.3px',
                  background: isActive(link.href) ? 'rgba(251,113,133,0.2)' : 'transparent',
                  color: isActive(link.href) ? '#FB7185' : '#ffffff',
                  fontWeight: isActive(link.href) ? '600' : '400',
                  border: isActive(link.href) ? '1px solid rgba(251,113,133,0.4)' : '1px solid transparent',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="nav-right">
          {/* Search icon */}
          <div style={{display: 'flex', alignItems: 'center',gap: '8px', position: 'relative'}}>
            {searchOpen && (
              <input
                ref={searchRef}
                type="text"
                placeholder="Search titles, actors, genres..."
                value={searchQuery}
                onChange={e => handleSearchChange(e.target.value)}
                onKeyDown={handleSearch}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  width: '220px',
                  fontFamily: 'inherit',
                  padding: '7px 12px',
                  transition: 'all 0.3s ease',
                }}
              />
            )}
            <button
              onClick={() => {
                if (searchOpen && searchQuery.trim()) {
                  router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                } else {
                  setSearchOpen(!searchOpen)
                  if (searchOpen) setSearchQuery('')
                }
              }}
              style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#fff'}}
            >
              <svg width="18" height="18" viewBox="0 0 16 16"fill="none">
                <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5"/>
                <path d="M10.5 10.5L14 14" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Desktop user icon */}
          <div className="user-wrap" style={{position: 'relative', zIndex: 200}}>
            {user ? (
              <>
                <div className="user-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <svg width="18" height="18" viewBox="0 0 2424" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                  </svg>
                </div>
                {dropdownOpen && (
                  <div className="user-dropdown" style={{zIndex: 9999}}>
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
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0012-2h4M16 17l5-5-5-5M21 12H9"/>
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

          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: '#fff',
            }}
            className="hamburger-btn"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24"fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24"fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M3 12h18M3 18h18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: '#0E0A0D',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          position: 'relative',
          zIndex: 100,
        }}
        className="mobile-menu"
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '8px',
          }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search titles, actors, genres..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              onKeyDown={handleSearch}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '14px',
                width: '100%',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {[
            { label: 'Home', href: '/' },
            { label: 'New', href: '/recent' },
            { label: 'Popular', href: '/trending' },
            { label: 'My List', href: '/mylist' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                color: isActive(link.href) ? '#FB7185' : '#F0EEE8',
                textDecoration: 'none',
                fontSize: '15px',
                padding: '12px 4px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'block',
                fontWeight: isActive(link.href) ? '600' : '400',
              }}
            >
              {link.label}
            </a>
          ))}

          {user ? (
            <div style={{marginTop: '4px'}}>
              <div style={{fontSize: '13px', color: 'rgba(255,255,255,0.4)', padding: '8px 4px'}}>
                {user.email}
              </div>
              <button
                onClick={signOut}
                style={{
                  background: 'none',
                  border: '1px solid rgba(251,113,133,0.4)',
                  color: '#FB7185',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  width: '100%',
                  marginTop: '4px',
                  fontFamily: 'inherit',
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <a
              href="/signin"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '4px',
                background: '#FB7185',
                color: '#fff',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                textDecoration: 'none',
                fontWeight: '600',
              }}
            >
              Sign In
            </a>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .hamburger-btn { display: block !important; }
          .nav-links { display: none !important; }
          .user-wrap { display: none !important; }
        }
        @media (min-width: 641px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  )
}
