import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Privacy() {
  return (
    <>
      <Nav/>

      <div className="page-hero">
        <div className="page-title"><span className="pink">Privacy</span> Policy</div>
      </div>

      <div className="legal-body">

        <div className="legal-intro">
          Welcome to Drama Land. We are committed to protecting your privacy and being transparent about how we handle your information. This Privacy Policy outlines the information we collect, how it is used, and the rights you have regarding your data.
        </div>

        <div className="legal-section">
          <div className="legal-heading">Information We Collect</div>
          <div className="legal-text">Drama Land collects limited anonymous data to improve user experience and better understand how our service is used. To help us identify popular content and improve our platform, we collect data from your IP address, browser type, device information, and pages visited to analyze website traffic and remember user preferences. We also use cookies and similar tracking technologies to improve your experience. You can control cookies through your browser settings. Some content on our site may come from third-party services, which may collect information according to their own privacy policies.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Account Authentication and Security</div>
          <div className="legal-text">Drama Land uses a third-party authentication provider to manage user account sign up and sign in. We do not receive or store your password. We do not sell or share your personal data with third parties for their marketing purposes.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">How We Use Information</div>
          <div className="legal-text">We use your information to:</div>
          <ul className="legal-list">
            <li>Personalize your experience, including show recommendations.</li>
            <li>Allow you to save shows to your library and track your watch history.</li>
            <li>Send you updates and notifications if you have opted in.</li>
            <li>Improve and develop new features for Drama Land.</li>
            <li>Ensure the security and integrity of our platform.</li>
          </ul>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Changes to This Policy</div>
          <div className="legal-text">We may update this Privacy Policy from time to time. We will notify you of any significant changes by updating this page. We encourage you to review this policy periodically to stay informed about how we protect your information.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Contact Us</div>
          <div className="legal-text">If you have any questions or concerns about this Privacy Policy or our data practices, please visit our <a href="/contact" className="pink-link">Contact Us</a> page.</div>
        </div>

      </div>

      <Footer/>
    </>
  )
}