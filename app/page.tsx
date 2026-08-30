import Nav from './components/Nav'
import Footer from './components/Footer'
import HeroBanner from './components/HeroBanner'

async function getShows() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?is_published=eq.true&select=*&order=created_at.desc`,
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

function ShowRow({ title, shows, seeAllHref }: { title: string, shows: any[], seeAllHref?: string }) {
  if (shows.length === 0) return null
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">{title}</div>
        {seeAllHref && (
          <a href={seeAllHref} className="see-all" style={{textDecoration:'none', color:'inherit'}}>See All →</a>
        )}
      </div>
      <div className="cards-row">
        {shows.map((show: any) => (
          <a href={`/show/${show.id}`} key={show.id} className="card" style={{textDecoration:'none'}}>
            <div className="card-poster">
              {show.thumbnail_url ? (
                <img
                  src={show.thumbnail_url}
                  alt={show.title}
                  referrerPolicy="no-referrer"
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
    </div>
  )
}

function Top10Row({ shows }: { shows: any[] }) {
  if (shows.length === 0) return null
  const top10 = shows.slice(0, 10)
  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">Top 10 on Drama Land Today</div>
      </div>
      <div style={{
        display: 'flex',
        gap: '0px',
        overflowX: 'auto',
        paddingBottom: '16px',
        paddingLeft: '4px',
        paddingTop: '8px',
      }}>
        {top10.map((show: any, index: number) => (
          <a
            href={`/show/${show.id}`}
            key={show.id}
            style={{
              textDecoration: 'none',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              flexShrink: 0,
              marginRight: '8px',
            }}
          >
            {/* Big number */}
            <div style={{
              fontSize: '160px',
              fontWeight: '900',
              lineHeight: 1,
              fontFamily: 'Arial Black, Impact, sans-serif',
              color: 'transparent',
              WebkitTextStroke: '3px rgba(255,255,255,0.6)',
              position: 'relative',
              zIndex: 0,
              userSelect: 'none',
              marginRight: '-30px',
              paddingBottom: '10px',
              flexShrink: 0,
            }}>
              {index + 1}
            </div>
            {/* Card */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              width: '115px',
              height: '170px',
              flexShrink: 0,
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '4px 4px 20px rgba(0,0,0,0.8)',
            }}>
              {show.thumbnail_url ? (
                <img
                  src={show.thumbnail_url}
                  alt={show.title}
                  referrerPolicy="no-referrer"
                  style={{width:'100%', height:'100%', objectFit:'cover'}}
                />
              ) : (
                <div className="card-poster-bg p1" style={{width:'100%', height:'100%'}}/>
              )}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export default async function Home() {
  const shows = await getShows()

  const featured = shows.filter((s: any) => s.is_featured && s.backdrop_url)
  const hotPicks = shows.filter((s: any) => s.is_hot_pick)

  // Trending — shows from the middle of the list (not newest, not oldest)
  const trending = shows.slice(10, 30)

  const fanFavorites = shows.filter((s: any) => s.is_fan_favorite)

  // Recently Added — always the newest shows (first 20 since sorted by created_at.desc)
  const recentlyAdded = shows.slice(0, 20)

  const spicy = shows.filter((s: any) => s.is_spicy)

  return (
    <>
      <Nav/>
      <HeroBanner shows={featured} />
      <Top10Row shows={hotPicks} />
      <ShowRow title="Trending" shows={trending} seeAllHref="/trending" />
      <ShowRow title="Fan Favorites ⭐" shows={fanFavorites} />
      <ShowRow title="Recently Added" shows={recentlyAdded} seeAllHref="/recent" />
      <ShowRow title="Spicy & Steamy Dramas 🌶️" shows={spicy} />
      <Footer/>
    </>
  )
}
