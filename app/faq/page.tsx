'use client'
import { useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'

const faqs = [
  { q: 'What is Drama Land?', a: 'Drama Land is a free streaming platform dedicated to Chinese and Asian dramas. We curate the best shows from third-party platforms so you can find and watch your next obsession all in one place.' },
  { q: 'Is Drama Land free to use?', a: 'Yes, completely free. No subscriptions, no paywalls, no hidden fees. Drama Land will always be free to watch.' },
  { q: 'Do I need an account to watch?', a: 'You can browse and watch without an account. However, creating a free account lets you save shows to your library, track your watch history, and rate dramas.' },
  { q: 'What types of dramas are available?', a: 'Drama Land currently focuses on Chinese dramas including romance, historical, CEO romance, revenge, fantasy, and more. We plan to add Korean dramas and other Asian content in the future.' },
  { q: 'How does the video player work?', a: 'Just press play and the show runs straight through automatically. Episodes play one after another without interruption so you can sit back and enjoy without clicking anything.' },
  { q: 'Can I search for a specific show or actor?', a: 'Yes! You can search by show title or actor name using the search bar at the top of any page.' },
  { q: 'Does Drama Land host its own videos?', a: 'No. Drama Land does not host or store any video content. All videos are linked from third-party platforms where studios and creators have published their content publicly.' },
  { q: 'Can I add shows to a watchlist?', a: 'Yes! Create a free account and use the Library button on any show page to save it to your personal watchlist.' },
  { q: 'How do I create an account?', a: 'Click the user icon in the top right corner of any page and sign in with your Google account.' },
  { q: 'How do I report a broken video?', a: 'If a video is not playing or has been removed, please use the Contact Us page to let us know.' },
  { q: 'I am a content owner. How do I request removal of my content?', a: 'Please visit our DMCA page and submit a takedown request. We take copyright seriously and will respond promptly to all valid requests.' },
  { q: 'Will you be adding more shows?', a: 'Absolutely! New content is added regularly. We are starting with Chinese dramas and plan to expand to Korean dramas, Thai dramas, and more in the future.' },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <Nav/>

      <div className="page-hero">
        <div className="page-title">Frequently Asked <span className="pink">Questions</span></div>
      </div>

      <div className="faq-body">
        {faqs.map((item, i) => (
          <div key={i} className="faq-item">
            <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
              {item.q}
              <span className="faq-icon">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div className="faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>

      <div className="contact-cta">
        <h3>Still have questions?</h3>
        <a href="/contact" className="pink-link">Contact Us</a>
      </div>

      <Footer/>
    </>
  )
}