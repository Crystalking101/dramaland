import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function About() {
  return (
    <>
      <Nav/>

      <div className="hero">
        <div className="hero-label">Our Story</div>
        <div className="hero-title">Welcome to <span className="pink">Drama Land</span></div>
        <div className="hero-subtitle">Bringing Asian Drama&apos;s to the world</div>
      </div>

      <div className="stats-row">
        <div className="stat"><div className="stat-number">10K+</div><div className="stat-label">Episodes Available</div></div>
        <div className="stat"><div className="stat-number">500+</div><div className="stat-label">Shows & Series</div></div>
        <div className="stat"><div className="stat-number">100%</div><div className="stat-label">Free to Watch</div></div>
      </div>

      <div className="content-section">
        <div className="section-label">Our Mission</div>
        <div className="mission-statement">Make the world&apos;s best Asian dramas accessible to everyone, everywhere, for free.</div>
        <div className="section-body">Drama Land was built for drama lovers who are tired of hunting across a dozen different platforms to find their next obsession. We believe the best Chinese and Asian dramas deserve a dedicated home where fans can discover, watch, and share the stories they love without barriers.</div>
      </div>

      <div className="values-grid">
        <div className="value-card">
          <div className="value-title">Quality Curation</div>
          <div className="value-desc">Every show on Drama Land is hand-picked or verified. We don&apos;t flood the site with low-quality content. We focus on dramas worth your time.</div>
        </div>
        <div className="value-card">
          <div className="value-title">Always Free</div>
          <div className="value-desc">No subscriptions, no paywalls. Drama Land is and always will be free to watch. Great stories shouldn&apos;t cost a fortune.</div>
        </div>
        <div className="value-card">
          <div className="value-title">Built for Fans</div>
          <div className="value-desc">Drama Land is built by fans, for fans. Every feature from watchlists to recommendations is designed around how drama lovers actually watch.</div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-label">How It Works</div>
        <div className="section-body">Drama Land does not host or store video content on its servers. Instead, we provide links to videos hosted by third-party streaming platforms where creators and studios have published their content publicly. We encourage all users to respect copyright laws and support creators through official channels whenever possible.<br/><br/>For additional information, please review our <a href="/dmca" className="pink-link">DMCA Policy</a>.</div>
      </div>

      <Footer/>
    </>
  )
}