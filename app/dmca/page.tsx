import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function DMCA() {
  return (
    <>
      <Nav/>

      <div className="page-hero">
        <div className="page-title"><span className="pink">DMCA</span> Policy</div>
      </div>

      <div className="legal-body">

        <div className="legal-intro">
          Drama Land respects the intellectual property rights of all content creators and copyright holders. We comply with the Digital Millennium Copyright Act (DMCA) and will respond promptly to valid takedown notices.
        </div>

        <div className="legal-section">
          <div className="legal-heading">Our Content Policy</div>
          <div className="legal-text">Drama Land does not host, upload, or store any video content on its own servers. All videos linked or embedded on this platform are hosted by third-party platforms where the content has been made publicly available by its creators or rights holders. We act solely as an aggregator providing links to that publicly available content.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Copyright Infringement Notice</div>
          <div className="legal-text">If you are a copyright owner or an authorized representative and you believe that content linked or embedded on Drama Land infringes your copyright, you may submit a DMCA takedown notice. Your notice must include the following information:</div>
          <ul className="legal-list">
            <li>Your full legal name and contact information including email address.</li>
            <li>A description of the copyrighted work you believe has been infringed.</li>
            <li>The specific URL on Drama Land where the infringing content appears.</li>
            <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf.</li>
            <li>Your electronic or physical signature.</li>
          </ul>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Designated Copyright Agent</div>
          <div className="legal-text">
            Infringement notices should be sent to our Designated Copyright Agent at:
            <div className="agent-box">
              <a href="/contact" className="pink-link">Contact Us </a> page — please include &quot;DMCA Takedown Request&quot; in the subject line.
            </div>
            <br/>
            Upon receipt of a valid DMCA notification, Drama Land reserves the right, at its sole discretion, to take any action it deems appropriate, including the removal or disabling of access to the allegedly infringing content on the Drama Land site.
          </div>
        </div>

      </div>

      <Footer/>
    </>
  )
}