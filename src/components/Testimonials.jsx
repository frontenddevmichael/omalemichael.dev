import SpecSection from './SpecSection';
import './Testimonials.css';

const TESTIMONIALS = [
  {
    quote: 'Michael translates complex requirements into clean, intuitive interfaces. His attention to detail and modern CSS architecture made our collaboration seamless.',
    name: 'Sarah Adeyemi',
    role: 'Product Designer · Techstart',
    rating: 5,
  },
  {
    quote: 'He delivered a responsive dashboard that performed flawlessly across all devices. His React expertise saved us weeks of development time.',
    name: 'Emeka Okafor',
    role: 'Founder · Kode Labs',
    rating: 5,
  },
  {
    quote: 'Michael\'s site itself is the best proof of his skills — the animations, the graph integration, every pixel. He genuinely cares about the craft.',
    name: 'Chioma Nwosu',
    role: 'Engineering Lead · PayConnect',
    rating: 4,
  },
  {
    quote: 'I hired Michael for a freelance UI refresh. He improved our Lighthouse scores significantly while making the site look modern.',
    name: 'Tunde Balogun',
    role: 'CEO · Helpa',
    rating: 5,
  },
  {
    quote: 'Michael writes some of the cleanest code I\'ve reviewed. His CSS is maintainable, and he always considers accessibility from the start.',
    name: 'Kelechi Ani',
    role: 'Senior Engineer · Moniepoint',
    rating: 5,
  },
];

function Stars({ count }) {
  return (
    <span className="ts-stars" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`ts-star${i <= count ? ' ts-star--on' : ''}`} viewBox="0 0 16 16" width="16" height="16">
          <path d="M8 1l1.8 3.6 4 .6-2.9 2.8.7 4L8 10.5l-3.6 1.9.7-4L2.2 5.2l4-.6L8 1z" />
        </svg>
      ))}
    </span>
  );
}

export default function Testimonials() {
  return (
    <SpecSection id="testimonials" num="06" title="Testimonials">
      <div className="ts-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="ts-card">
            <svg className="ts-mark" viewBox="0 0 24 20" width="40" height="34" aria-hidden="true">
              <path d="M0 20V8l4-8h6l-4 8h4v12H0zm14 0V8l4-8h6l-4 8h4v12H14z" fill="currentColor" />
            </svg>
            <Stars count={t.rating} />
            <p className="ts-quote">{t.quote}</p>
            <footer className="ts-footer">
              <span className="ts-name">{t.name}</span>
              <span className="ts-role">{t.role}</span>
            </footer>
          </div>
        ))}
      </div>
    </SpecSection>
  );
}