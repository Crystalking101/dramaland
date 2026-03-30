import Nav from '../components/Nav'
import Footer from '../components/Footer'

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

export default async function Trending() {
  const shows = await getShows()

  return (
    <>
      <Nav/>
      <div className="section">
        <div className="section-header">
          <div className="section-title">Trending Now</div>
        </div>
        <div className="search-grid">
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
      <Footer/>
    </>
  )
}