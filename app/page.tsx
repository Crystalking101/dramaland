import Nav from './components/Nav'
import Footer from './components/Footer'

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

export default async function Home() {
  const shows = await getShows()

  const curated = shows.slice(0, 6)
  const trending = shows.slice(0, 6)
  const recent = shows.slice().reverse().slice(0, 6)

  return (
    <>
      <Nav/>

      {shows.length > 0 ? (
        <div className="section">
          <div className="section-header">
            <div className="section-title">Curated Picks</div>
          </div>
          <div className="cards-row">
            {curated.map((show: any) => (
              <a href={`/show/${show.id}`} key={show.id} className="card" style={{textDecoration:'none'}}>
                <div className="card-poster">
                  {show.thumbnail_url ? (
                    <img
                      src={show.thumbnail_url}
                      alt={show.title}
                      style={{width:'100%', height:'100%', objectFit:'cover', borderRadius:'10px'}}
                    />
                  ) : (
                    <div className="card-poster-bg p1">
                      <div className="card-overlay"></div>
                    </div>
                  )}
                </div>
                <div className="card-title">{show.short_title || show.title}</div>
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="section">
          <div className="section-header">
            <div className="section-title">Curated Picks</div>
          </div>
          <div className="cards-row">
            <div className="card"><div className="card-poster"><div className="card-poster-bg p1"><div className="card-overlay"></div></div></div><div className="card-title">Her Silence Broke His World</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p2"><div className="card-overlay"></div></div></div><div className="card-title">A Scorned Queen&apos;s Retribution</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p3"><div className="card-overlay"></div></div></div><div className="card-title">Moonfall Over Hale</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p4"><div className="card-overlay"></div></div></div><div className="card-title">Stand-in? She&apos;s the Sun Now!</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p5"><div className="card-overlay"></div></div></div><div className="card-title">Betrayed? Groveling For Mercy!</div></div>
            <div className="card"><div className="card-poster"><div className="card-poster-bg p6"><div className="card-overlay"></div></div></div><div className="card-title">Bye Mr. Ice</div></div>
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <div className="section-title">Trending Now</div>
          <div className="see-all">See All →</div>
        </div>
        <div className="cards-row">
          {trending.map((show: any) => (
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

      <div className="section">
        <div className="section-header">
          <div className="section-title">Recently Added</div>
          <div className="see-all">See All →</div>
        </div>
        <div className="cards-row">
          {recent.map((show: any) => (
            <a href={`/show/${show.id}`} key={`recent-${show.id}`} className="card" style={{textDecoration:'none'}}>
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

      <Footer/>
    </>
  )
}