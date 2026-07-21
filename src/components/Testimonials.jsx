import SpecSection from './SpecSection';

// PLACEHOLDER CONTENT -- swap these three objects for real quotes/recommendations
// (LinkedIn recommendation, a lecturer, a freelance client) as soon as you have them.
// Structure to keep: quote, name, role.
const TESTIMONIALS = [
  {
    quote: 'Placeholder quote — replace with a real recommendation once you have one.',
    name: 'Name Surname',
    role: 'Role · Company',
  },
  {
    quote: 'Placeholder quote — replace with a real recommendation once you have one.',
    name: 'Name Surname',
    role: 'Role · Company',
  },
];

export default function Testimonials() {
  return (
    <SpecSection id="testimonials" num="06" title="Testimonials">
      <div className="testimonial-note">
        <span className="tag">placeholder</span>
        <span>Real quotes go here — structure is ready, content isn't yet.</span>
      </div>
      <div className="testimonial-grid">
        {TESTIMONIALS.map((t, i) => (
          <blockquote key={i} className="testimonial-card stagger-up" style={{ transitionDelay: `${i * 150}ms` }}>
            <p>&ldquo;{t.quote}&rdquo;</p>
            <footer>
              <span className="t-name">{t.name}</span>
              <span className="t-role">{t.role}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </SpecSection>
  );
}
