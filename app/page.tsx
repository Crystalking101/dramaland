import Nav from './components/Nav'
import Footer from './components/Footer'
import HeroBanner from './components/HeroBanner'

async function getShows() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Shows?select=*&order=created_at.desc`,
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

export default async function Home() {
  const shows = await getShows()

  const featured = shows.filter((s: any) => s.is_featured && s.backdrop_url)
  const hotPicks = shows.filter((s: any) => s.is_hot_pick)
  const trending = shows.slice(0, 20)
  const fanFavorites = shows.filter((s: any) => s.is_fan_favorite)
  const recentlyAdded = shows.slice(0, 20)
  const spicy = shows.filter((s: any) => s.is_spicy)

  return (
    <>
      <Nav/>
      <HeroBanner shows={featured} />
      <ShowRow title="Drama Land Hot Picks 🔥" shows={hotPicks} />
      <ShowRow title="Trending" shows={trending} seeAllHref="/trending" />
      <ShowRow title="Fan Favorites ⭐" shows={fanFavorites} />
      <ShowRow title="Recently Added" shows={recentlyAdded} seeAllHref="/recent" />
      <ShowRow title="Spicy & Steamy Dramas 🌶️" shows={spicy} />
      <Footer/>
    </>
  )
}
