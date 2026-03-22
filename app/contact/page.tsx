import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Contact() {
  return (
    <>
      <Nav/>

      <div className="page-hero">
        <div className="page-title" style={{color: '#FB7185'}}>Contact Us</div>
      </div>

      <div className="legal-body">

        <div className="legal-intro">
          If you have any questions, feedback, bug reports, or other inquiries, please feel free to reach out to us. We value your input and will do our best to respond in a timely manner within 1-2 business days.
        </div>

        <div className="legal-section">
          <div className="legal-heading">Contact & Support</div>
          <div className="legal-text">
            For general questions or support, please email us at:
            <br/><br/>
            <a href="mailto:support@discoverdramaland.com" className="pink-link" style={{fontSize: '15px', fontWeight: '600'}}>
              support@discoverdramaland.com
            </a>
            <br/><br/>
            Please note that Drama Land does not host any video content on its servers. If you have a DMCA notice or a copyright-related concern, please refer to our <a href="/dmca" className="pink-link">DMCA Policy</a> page for detailed instructions on how to submit a takedown request.
          </div>
        </div>

      </div>

      <Footer/>
    </>
  )
}