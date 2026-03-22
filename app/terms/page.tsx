import Nav from '../components/Nav'
import Footer from '../components/Footer'

export default function Terms() {
  return (
    <>
      <Nav/>

      <div className="page-hero">
        <div className="page-title"><span className="pink">Terms</span> of Service</div>
      </div>

      <div className="legal-body">

        <div className="legal-intro">
          Welcome to Drama Land! These Terms of Service (&quot;Terms&quot;) govern your use of the Drama Land website (the &quot;Service&quot;) and any related services provided by us. By accessing or using our Service, you agree to be bound by these terms. Please review these terms carefully before using our platform. If you do not agree to these terms, we kindly ask that you do not use the platform.
        </div>

        <div className="legal-section">
          <div className="legal-heading">Cost of Service</div>
          <div className="legal-text">Drama Land is a free platform for discovering and watching Asian dramas. Drama Land does not host or store video content on its servers. All videos are embedded or linked from third-party platforms where the content has been made publicly available. All content remains the property of its respective owners.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">User Requirements</div>
          <div className="legal-text">You must be at least 13 years old, or the minimum legal age required in your country, to use Drama Land. You agree to use Drama Land only for lawful purposes and in a way that does not harm or interfere with the Service or other users. You must comply with all applicable laws and regulations when using the platform.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">User Accounts</div>
          <div className="legal-text">You may use Drama Land without creating an account. If you choose to create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. Drama Land reserves the right to suspend or terminate accounts that violate these Terms of Service.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">User Comments</div>
          <div className="legal-text">You are solely responsible for the content of your comments. By posting comments on Drama Land, you grant us a non-exclusive, worldwide, royalty-free license to display, reproduce, modify, adapt, publish, translate, distribute, and otherwise use your comments in connection with the Service. You represent and warrant that you own or have the necessary rights to post your content and that it does not violate any applicable law, third-party right, or regulation.<br/><br/>
          We reserve the right, but are not obligated, to remove, edit, or moderate any comments at our sole discretion. You agree not to post content that:</div>
          <ul className="legal-list">
            <li>Infringes on intellectual property rights or privacy rights of others</li>
            <li>Contains viruses, malware, or harmful code</li>
            <li>Promotes illegal activity, harassment, discrimination, or hate speech</li>
          </ul>
          <div className="legal-text" style={{marginTop: '12px'}}>By posting, you acknowledge that your comments may be publicly visible and that Drama Land assumes no responsibility or liability for the content of comments posted by users.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Third-Party Services</div>
          <div className="legal-text">Drama Land links to content hosted on third-party platforms. We are not responsible for the availability, accuracy, or content of those third-party services. Your use of any third-party platform is governed by that platform&apos;s own terms of service and privacy policy. We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit. For more details, please see our <a href="/disclaimer" className="pink-link">Disclaimer</a>.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Limitation of Liability</div>
          <div className="legal-text">To the maximum extent permitted by law, Drama Land shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service. The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Changes to These Terms</div>
          <div className="legal-text">We reserve the right to update or modify these Terms of Service at any time. We will notify users of significant changes by updating this page. Continued use of Drama Land after any changes constitutes your acceptance of the updated terms.</div>
        </div>

        <div className="legal-section">
          <div className="legal-heading">Contact Us</div>
          <div className="legal-text">If you have any questions about these Terms of Service, please visit our <a href="/contact" className="pink-link">Contact Us</a> page.</div>
        </div>

      </div>

      <Footer/>
    </>
  )
}