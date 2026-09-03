 'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getPublicStats, sendContactMessage } from '../services/api';

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@sugasaitech.com';

const services = [
  {
    number: '01',
    title: 'Find your people',
    text: 'Bring classmates, campus friends, colleagues, and mentors into one trusted community that stays useful long after the first hello.'
  },
  {
    number: '02',
    title: 'Make moments',
    text: 'Create reunions, campus meetups, professional gatherings, and chapter events with simple RSVPs and clear details.'
  },
  {
    number: '03',
    title: 'Keep growing',
    text: 'Give your community a living home for introductions, shared milestones, new opportunities, and the stories still being written.'
  }
];

const communities = [
  ['Schools', 'Keep former students connected from the first bell to every milestone that follows.'],
  ['Colleges', 'Turn graduating batches into a lasting network for friendships, guidance, and opportunity.'],
  ['Companies', 'Strengthen your alumni network with a warm, organized place for former teammates to return.']
];

const testimonials = [
  ['Asha Rao', 'Alumni coordinator', 'Our reunion planning finally feels personal instead of scattered across spreadsheets and chat groups.'],
  ['Daniel Kim', 'College administrator', 'Students leave with a network, not just a certificate. Alumni Meet helps that relationship continue.'],
  ['Meera Shah', 'People and culture lead', 'It gives former teammates a warm way to stay connected without adding another noisy social feed.']
];

const steps = [
  ['01', 'Create your space', 'Start a private community for your school, college, company, or professional network.'],
  ['02', 'Invite your people', 'Share a simple link and let members build profiles, find one another, and reconnect.'],
  ['03', 'Bring it to life', 'Plan gatherings, celebrate milestones, and keep the network useful year after year.']
];

const plans = [
  {
    name: 'Community',
    price: 'Free',
    detail: 'For alumni and students who want to stay connected',
    features: ['Create your own profile', 'Find classmates in the directory', 'Discover events and reserve your seat'],
    featured: false
  },
  {
    name: 'Chapter',
    price: 'Custom',
    detail: 'For schools and alumni teams who run the community',
    features: ['Everything in Community', 'Manage members and their roles', 'Create events and track attendance', 'Use QR check-in for faster entry', 'Export attendance reports', 'See chapter analytics and get onboarding support'],
    featured: true
  }
];

export default function PublicHome() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({ members: 0, events: 0, chapters: 0 });
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', inquiry_type: 'support', organization: '', role: '', message: '', preferred_contact_method: 'email', phone: '', attachment: null, consent: false });
  const [contactState, setContactState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    getPublicStats().then(setStats).catch(() => {});
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  async function submitContact(event) {
    event.preventDefault();
    setContactState({ status: 'sending', message: '' });
    try {
      await sendContactMessage(contactForm);
      setContactForm({ name: '', email: '', subject: '', inquiry_type: 'support', organization: '', role: '', message: '', preferred_contact_method: 'email', phone: '', attachment: null, consent: false });
      setContactState({ status: 'success', message: 'Thanks for reaching out. We will be in touch soon.' });
    } catch (error) {
      setContactState({ status: 'error', message: error.message || 'We could not send your message. Please try again.' });
    }
  }

  return (
    <main className="public-home">
      <nav className="public-nav" aria-label="Public navigation">
        <a className="public-brand" href="#home" aria-label="Alumni Meet home">
          <span className="public-brand-mark"><img src="/alumni-meet-mark.svg" alt="" /></span>
          <span><strong>Alumni</strong><small>Meet</small></span>
        </a>
        <div className={menuOpen ? 'public-nav-links open' : 'public-nav-links'}>
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="/about" onClick={closeMenu}>About</a>
          <a href="#communities" onClick={closeMenu}>Communities</a>
          <a href="#services" onClick={closeMenu}>Services</a>
          <a href="#pricing" onClick={closeMenu}>Pricing</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </div>
        <div className="public-nav-actions">
          <Link className="public-login" href="/login">Log in</Link>
          <Link className="public-join" href="/register">Join the community <span aria-hidden="true">↗</span></Link>
          <button className="public-menu-button" type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}><span aria-hidden="true">{menuOpen ? '×' : '☰'}</span></button>
        </div>
      </nav>

      <section className="public-hero" id="home">
        <div className="public-hero-copy">
          <p className="public-overline">Where every chapter stays connected</p>
          <h1>The people who helped shape you are <em>still out there.</em></h1>
          <p className="public-hero-text">Alumni Meet gives schools, colleges, and companies a thoughtful home to reconnect people, celebrate shared history, and grow what comes next.</p>
          <div className="public-hero-actions">
            <Link className="public-primary-button" href="/register">Find your community <span aria-hidden="true">↗</span></Link>
            <a className="public-text-link" href="#about">See how it works <span aria-hidden="true">↓</span></a>
          </div>
          <div className="public-proof"><span className="public-proof-avatars"><i>AK</i><i>RM</i><i>NS</i><i>+</i></span><span><strong>Built for belonging</strong><small>One network. Every generation.</small></span></div>
        </div>
        <div className="public-hero-art" aria-label="Alumni community illustration">
          <div className="public-art-note note-top">THE STORIES CONTINUE</div>
          <div className="public-art-circle"><span>AM</span></div>
          <div className="public-art-card art-card-one"><small>THEN AND NOW</small><strong>Good people<br />are worth finding.</strong></div>
          <div className="public-art-card art-card-two"><span>↗</span><small>MAKE ROOM FOR WHAT IS NEXT</small></div>
          <div className="public-art-line" />
          <div className="public-art-note note-bottom">SINCE THE VERY FIRST DAY</div>
        </div>
      </section>

      <section className="public-stats" aria-label="Community statistics"><div><strong>{stats.members || '—'}</strong><span>Members connected</span></div><div><strong>{stats.events || '—'}</strong><span>Events shared</span></div><div><strong>{stats.chapters || '—'}</strong><span>Chapters growing</span></div></section>

      <section className="public-statement" id="about">
        <p className="public-overline">Why Alumni Meet</p>
        <h2>Some connections deserve more than a <span>“like.”</span></h2>
        <p>Whether your shared story began in a classroom, lecture hall, or workplace, Alumni Meet gives your people a reason to come back and a place to keep moving forward together.</p>
      </section>

      <section className="public-communities" id="communities" aria-labelledby="communities-heading">
        <div className="public-section-heading"><div><p className="public-overline">Made for your community</p><h2 id="communities-heading">Different beginnings.<br /><em>Same sense of belonging.</em></h2></div><p>Choose the community that feels like home today. The experience stays simple, personal, and ready to grow with you.</p></div>
        <div className="public-community-grid">{communities.map(([name, text], index) => <article className="public-community" key={name}><span>0{index + 1}</span><h3>{name}</h3><p>{text}</p><a href="#contact">Build your network <b>↗</b></a></article>)}</div>
      </section>

      <section className="public-photo-story" aria-labelledby="photo-story-heading">
        <div className="public-photo-copy"><p className="public-overline">The good part is people</p><h2 id="photo-story-heading">A network that feels <em>human.</em></h2><p>Not another feed to keep up with. A considered place for familiar faces, meaningful gatherings, and the next story your community will tell.</p></div>
        <div className="public-photo-grid"><figure><img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=700&q=85" alt="Friends sharing a moment outdoors" /></figure><figure><img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=85" alt="A group of people gathered together" /></figure><figure><img src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=85" alt="Community members celebrating together" /></figure></div>
      </section>

      <section className="public-services" id="services">
        <div className="public-section-heading"><div><p className="public-overline">What we provide</p><h2>More than a directory.</h2></div><p>A thoughtful home for the people, events, and memories that make a community feel like one.</p></div>
        <div className="public-service-grid">{services.map((service) => <article className="public-service" key={service.number}><span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p><a href="#contact" aria-label={`Learn more about ${service.title}`}>Learn more <b>↗</b></a></article>)}</div>
      </section>

      <section className="public-how-it-works" aria-labelledby="how-heading"><div className="public-section-heading"><div><p className="public-overline">How it works</p><h2 id="how-heading">From familiar names<br /><em>to shared moments.</em></h2></div><p>A simple rhythm for communities that want to stay close without making connection feel like work.</p></div><div className="public-steps">{steps.map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="public-testimonials" aria-labelledby="testimonials-heading"><div className="public-section-heading"><div><p className="public-overline">From the community</p><h2 id="testimonials-heading">People make the platform.</h2></div></div><div className="public-testimonial-grid">{testimonials.map(([name, role, quote]) => <article key={name}><span className="public-quote-mark">“</span><blockquote>{quote}</blockquote><strong>{name}</strong><small>{role}</small></article>)}</div></section>

      <section className="public-pricing" id="pricing">
        <div className="public-pricing-intro"><p className="public-overline">Simple by design</p><h2>A community should feel <em>open.</em></h2><p>Start with the essentials and grow your network when you are ready. No complicated tiers for the people who matter most.</p></div>
        <div className="public-plan-grid">{plans.map((plan) => <article className={plan.featured ? 'public-plan featured' : 'public-plan'} key={plan.name}>{plan.featured && <span className="public-plan-badge">For institutions</span>}<p className="public-plan-name">{plan.name}</p><h3>{plan.price}</h3><p className="public-plan-detail">{plan.detail}</p><ul>{plan.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>{plan.featured ? <a className="public-plan-button light" href="#contact">Talk to us <span aria-hidden="true">↗</span></a> : <Link className="public-plan-button" href="/register">Get started <span aria-hidden="true">↗</span></Link>}</article>)}</div>
      </section>

      <section className="public-contact" id="contact"><div className="public-contact-copy"><p className="public-overline">Start a conversation</p><h2>Have a question?<br /><em>We are listening.</em></h2><p>Tell us how we can help your community reconnect. Your message goes directly to our support team.</p><a href={`mailto:${supportEmail}`}>{supportEmail}</a></div><form className="public-contact-form" onSubmit={submitContact}><div className="public-contact-fields"><label>Name *<input required minLength="2" maxLength="100" value={contactForm.name} onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })} /></label><label>Email *<input required type="email" value={contactForm.email} onChange={(event) => setContactForm({ ...contactForm, email: event.target.value })} /></label><label>Subject *<input required minLength="3" maxLength="150" value={contactForm.subject} onChange={(event) => setContactForm({ ...contactForm, subject: event.target.value })} /></label><label>Inquiry type *<select required value={contactForm.inquiry_type} onChange={(event) => setContactForm({ ...contactForm, inquiry_type: event.target.value })}><option value="support">Technical support</option><option value="school_onboarding">School onboarding</option><option value="event_help">Event help</option><option value="feedback">Feedback</option><option value="other">Other</option></select></label><label>College or organization<input maxLength="150" value={contactForm.organization} onChange={(event) => setContactForm({ ...contactForm, organization: event.target.value })} /></label><label>Role<select value={contactForm.role} onChange={(event) => setContactForm({ ...contactForm, role: event.target.value })}><option value="">Select role</option><option value="student">Student</option><option value="alumnus">Alumnus</option><option value="administrator">School administrator</option><option value="event_organizer">Event organizer</option></select></label></div><label>Message *<textarea required minLength="10" maxLength="2000" rows="5" value={contactForm.message} onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })} /></label><div className="public-contact-fields"><label>Preferred contact method<select value={contactForm.preferred_contact_method} onChange={(event) => setContactForm({ ...contactForm, preferred_contact_method: event.target.value })}><option value="email">Email</option><option value="phone">Phone</option></select></label><label>Phone number (optional)<input type="tel" value={contactForm.phone} onChange={(event) => setContactForm({ ...contactForm, phone: event.target.value })} placeholder="+91 98765 43210" /></label></div><label>Attachment (optional)<input type="file" accept=".pdf,image/jpeg,image/png,image/webp" onChange={(event) => setContactForm({ ...contactForm, attachment: event.target.files?.[0] || null })} /></label><label className="public-consent"><input required type="checkbox" checked={contactForm.consent} onChange={(event) => setContactForm({ ...contactForm, consent: event.target.checked })} />I agree to be contacted about this request. *</label>{contactState.message && <div className={contactState.status === 'error' ? 'public-contact-status error' : 'public-contact-status success'} role="status"><span className="public-contact-status-icon" aria-hidden="true">{contactState.status === 'error' ? '!' : '✓'}</span><span>{contactState.message}</span></div>}<button className="public-primary-button" type="submit" disabled={contactState.status === 'sending'}>{contactState.status === 'sending' ? 'Sending...' : 'Send message'} <span aria-hidden="true">↗</span></button></form></section>
      <footer className="public-footer"><div><a className="public-brand" href="#home"><span className="public-brand-mark"><img src="/alumni-meet-mark.svg" alt="" /></span><span><strong>Alumni</strong><small>Meet</small></span></a><p>Keep the good people close.</p></div><div className="public-footer-end"><span>© 2026 Alumni Meet</span><a href="#home">Back to top ↑</a></div></footer>
    </main>
  );
}
