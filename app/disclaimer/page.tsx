import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Disclaimer() {
  return (
    <>
      <Nav/>

      <div className="page-hero">
        <div className="page-title"><span className="pink">Disclaimer</span></div>
      </div>

      <div className="legal-body">

        <div className="legal-intro">
          By using Drama Land, you agree to the terms outlined in this Disclaimer. Please read it carefully before using our platform.
        </div>

        <div className="legal-section">
          <div className="legal-heading">Reliable & Accessible Content</div>
          <div className="legal-text">Drama Land does not host any video or media files on its own servers. All content accessible through our service is hosted on and streamed from third-party websites and services. We provide links or embed codes to such content for informational and entertainment purposes only.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Third-Party Content</div>
          <div className="legal-text">Drama Land is not responsible for the accuracy, legality, copyright compliance, decency, or any other aspect of the content hosted on third-party platforms. If you have any concerns about specific content, please contact the original content owner or the platform hosting the video directly.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Copyright</div>
          <div className="legal-text">Drama Land respects intellectual property rights. We do not claim ownership of any content linked or embedded on this platform. All content belongs to its respective owners. If you are a rights holder and believe your content has been improperly linked, please visit our <a href="/dmca" className="pink-link">DMCA page</a> to submit a removal request.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Use at Your Own Risk</div>
          <div className="legal-text">Drama Land may contain links to external websites or platforms. We are not responsible for the content, privacy practices, or terms of those external sites. We encourage you to review the terms and privacy policies of any third-party platforms you visit. We do not guarantee that the platform will be uninterrupted, error-free, or free of viruses or other harmful components. Use of Drama Land is at your own risk.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Changes to This Disclaimer</div>
          <div className="legal-text">We reserve the right to update or modify this Disclaimer at any time without prior notice. Continued use of Drama Land after any changes constitutes your acceptance of the updated Disclaimer. We encourage you to review this page periodically.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Contact Us</div>
          <div className="legal-text">If you have any questions about this Disclaimer, please visit our <a href="/contact" className="pink-link">Contact Us</a> page.</div>
        </div>

      </div>

      <Footer/>
    </>
  )
}