import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  type: string;
  logoText: string;
  description: string;
  technologies: string[];
  link?: string | null;
  active?: boolean;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'pantech',
    company: 'Pantech eLearning',
    role: 'Web Development Intern',
    duration: 'Jun 2025 — Aug 2025',
    type: 'Internship',
    logoText: 'P',
    description:
      'Built responsive web interfaces using HTML, CSS, JavaScript, and React while learning responsive design, Git, debugging, and real-world development practices.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Git'],
    link: null,
    active: false,
  },
  {
    id: 'freelance',
    company: 'Freelance',
    role: 'Web Developer',
    duration: '2024 — Present',
    type: 'Freelance',
    logoText: '✦',
    description:
      'Built responsive websites for clients using React and JavaScript while learning client communication, requirements gathering, deployment, and project delivery.',
    technologies: ['React', 'JavaScript', 'Tailwind CSS', 'Deployment', 'Git'],
    link: 'https://github.com/Madhu097',
    active: true,
  },
  {
    id: 'f1rstlook',
    company: 'F1RSTLOOK',
    role: 'Web Developer',
    duration: '2025 — Present',
    type: 'Startup',
    logoText: 'F',
    description:
      'Developed responsive websites using modern web technologies while learning client requirements, real-world development, and project delivery.',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'UI/UX'],
    link: 'https://firstlook.digital/',
    active: true,
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});
  const [beyondVisible, setBeyondVisible] = useState(false);
  // Safeguard against any stale HMR reference or closures
  const isVisible = headerVisible;

  // Individual scroll observers for each card and section element
  useEffect(() => {
    // Header observer
    const headerEl = document.querySelector('.pe-header');
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.15 }
    );
    if (headerEl) headerObserver.observe(headerEl);

    // Cards observer: each card reveals independently when scrolled into view
    // On mobile devices, use lower threshold and smaller rootMargin for snappy triggers
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const cardElements = document.querySelectorAll('.pe-card-row');
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setRevealedIds((prev) => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      {
        threshold: isMobile ? 0.08 : 0.15,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
      }
    );
    cardElements.forEach((el) => cardObserver.observe(el));

    // Beyond footer observer
    const beyondEl = document.querySelector('.pe-beyond-wrap');
    const beyondObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setBeyondVisible(true);
      },
      { threshold: 0.2 }
    );
    if (beyondEl) beyondObserver.observe(beyondEl);

    return () => {
      headerObserver.disconnect();
      cardObserver.disconnect();
      beyondObserver.disconnect();
    };
  }, []);

  // Spotlight mouse tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section ref={sectionRef} id="experience" className="pe-section">
      <style>{STYLES}</style>

      {/* Subtle ambient lighting */}
      <div className="pe-ambient-glow" aria-hidden="true" />

      <div className="pe-container">
        {/* Section Header */}
        <header className={`pe-header ${headerVisible ? 'is-in' : ''}`}>
          <div className="pe-label-wrap">
            <span className="pe-label-ping" />
            <span className="pe-label">EXPERIENCE</span>
          </div>
          <h2 className="pe-heading">Where I Turned Learning Into Experience</h2>
          <p className="pe-sub">
            A small journey of building, learning, and working on real-world projects.
          </p>
        </header>

        {/* Subtle Vertical Timeline Spine Marker */}
        <div className={`pe-marker-wrap ${headerVisible ? 'is-in' : ''}`} aria-hidden="true">
          <div className="pe-marker-dot" />
          <div className="pe-marker-line" />
        </div>

        {/* Stack of Clean, Spacious Experience Cards */}
        <div className="pe-cards-list">
          {EXPERIENCES.map((exp, idx) => {
            const isRevealed = !!revealedIds[exp.id];
            const CardTag = exp.link ? 'a' : 'article';
            const linkProps = exp.link
              ? {
                  href: exp.link,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  'aria-label': `Visit ${exp.company}`,
                }
              : {};

            return (
              <div
                key={exp.id}
                data-id={exp.id}
                className={`pe-card-row ${isRevealed ? 'is-in' : ''}`}
              >
                <div
                  onMouseMove={handleMouseMove}
                  className={`pe-card-spotlight-wrapper ${exp.link ? 'is-clickable' : ''}`}
                >
                  <CardTag {...linkProps} className="pe-card">
                    {/* Top Row: Company Info & Meta */}
                    <div className="pe-card-top">
                      <div className="pe-company-brand">
                        <div className="pe-logo" aria-hidden="true">
                          <span>{exp.logoText}</span>
                        </div>
                        <div className="pe-title-block">
                          <div className="pe-company-name-row">
                            <h3 className="pe-company">{exp.company}</h3>
                            <span className="pe-badge">{exp.type}</span>
                          </div>
                          <p className="pe-role">{exp.role}</p>
                        </div>
                      </div>

                      {/* Right Meta: Date & Arrow Button */}
                      <div className="pe-meta-block">
                        <div className="pe-date-wrap">
                          {exp.active && <span className="pe-live-pulse" />}
                          <time className="pe-date">{exp.duration}</time>
                        </div>
                        <div className="pe-arrow-btn" aria-hidden="true">
                          <ArrowUpRight className="pe-arrow-icon" />
                        </div>
                      </div>
                    </div>

                    {/* Middle: Clean Description */}
                    <p className="pe-desc">{exp.description}</p>

                    {/* Bottom: Technology Pill Tags */}
                    <div className="pe-tags">
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="pe-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardTag>
                </div>

                {/* Subtle vertical connector between cards */}
                {idx < EXPERIENCES.length - 1 && (
                  <div className="pe-connector" aria-hidden="true">
                    <div className="pe-connector-line">
                      <div className="pe-connector-beam" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Unique Signature Detail: Extending horizontal line to 'AND BEYOND' */}
        <div className={`pe-beyond-wrap ${beyondVisible ? 'is-in' : ''}`}>
          <div className="pe-beyond-line">
            <div className="pe-beyond-beam" />
          </div>
          <div className="pe-beyond-content">
            <div className="pe-beyond-header">
              <span className="pe-beyond-dot" />
              <span className="pe-beyond-title">AND BEYOND</span>
            </div>
            <p className="pe-beyond-sub">Still learning. Still building.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Theme-Matched Dark Premium SaaS Styles ───────────────────────────────────
const STYLES = `
/* Force clean modern sans-serif typography across the whole section */
.pe-section,
.pe-section * {
  box-sizing: border-box;
  font-family: 'Plus Jakarta Sans', 'Inter', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

.pe-section {
  position: relative;
  background-color: var(--color-background, #030308);
  color: #F8FAFC;
  padding: 120px 24px 140px;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ambient backlight */
.pe-ambient-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: min(1000px, 95vw);
  height: 500px;
  pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(99, 102, 241, 0.05) 0%, transparent 70%);
}

.pe-container {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* === HEADER ENTRANCE === */
.pe-header {
  margin-bottom: 36px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.pe-header.is-in {
  opacity: 1;
  transform: translateY(0);
}

.pe-label-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 99px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(129, 140, 248, 0.25);
  margin-bottom: 14px;
}

.pe-label-ping {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #818CF8;
  box-shadow: 0 0 8px #818CF8;
}

.pe-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #818CF8;
  text-transform: uppercase;
}

.pe-heading {
  font-size: clamp(2rem, 4vw, 3.1rem);
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: -0.025em;
  line-height: 1.18;
  margin: 0 0 12px;
}

.pe-sub {
  font-size: 1.02rem;
  font-weight: 400;
  color: #94A3B8;
  line-height: 1.6;
  max-width: 580px;
  margin: 0;
}

/* === SUBTLE VERTICAL DATE MARKER === */
.pe-marker-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 28px;
  margin-bottom: 12px;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s;
}
.pe-marker-wrap.is-in {
  opacity: 1;
  transform: translateY(0);
}

.pe-marker-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #818CF8;
  box-shadow: 0 0 8px rgba(129, 140, 248, 0.8);
  margin-left: -2.5px;
}

.pe-marker-line {
  width: 1px;
  height: 24px;
  background: linear-gradient(180deg, #818CF8, rgba(255, 255, 255, 0.1));
}

/* === CARDS LIST === */
.pe-cards-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.pe-card-row {
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(38px) scale(0.985);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}
.pe-card-row.is-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.pe-connector {
  position: relative;
  display: flex;
  align-items: center;
  height: 28px;
  margin-left: 44px;
}

.pe-connector-line {
  position: relative;
  width: 1px;
  height: 100%;
  background: linear-gradient(180deg, rgba(129, 140, 248, 0.45), rgba(255, 255, 255, 0.08));
  overflow: hidden;
}

.pe-connector-beam {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(180deg, transparent, #818CF8, transparent);
  animation: pe-stream-down 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes pe-stream-down {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(220%); }
}

/* === CARD SPOTLIGHT & CONTAINER === */
.pe-card-spotlight-wrapper {
  position: relative;
  border-radius: 18px;
  padding: 1px;
  background: rgba(255, 255, 255, 0.07);
  transition: background 0.3s ease, transform 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pe-card-spotlight-wrapper:hover {
  background: linear-gradient(135deg, rgba(129, 140, 248, 0.45) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(99, 102, 241, 0.35) 100%);
  transform: translateY(-4px);
}

.pe-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 26px 30px;
  border-radius: 17px;
  background-color: #080B14;
  background-image: radial-gradient(400px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(99, 102, 241, 0.12), transparent 70%);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
  transition: background-color 260ms ease, box-shadow 260ms ease;
}

.pe-card-spotlight-wrapper:hover .pe-card {
  background-color: #0B0F1C;
  box-shadow: 0 16px 36px -10px rgba(99, 102, 241, 0.15), 0 4px 14px rgba(0, 0, 0, 0.6);
}

/* === CARD TOP ROW === */
.pe-card-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px 20px;
}

.pe-company-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.pe-logo {
  width: 42px;
  height: 42px;
  border-radius: 11px;
  background-color: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(129, 140, 248, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 260ms ease;
}

.pe-card-spotlight-wrapper:hover .pe-logo {
  background-color: rgba(99, 102, 241, 0.22);
  border-color: rgba(129, 140, 248, 0.6);
  transform: scale(1.04);
}

.pe-logo span {
  font-size: 1.1rem;
  font-weight: 800;
  color: #818CF8;
  line-height: 1;
}

.pe-title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.pe-company-name-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}

.pe-company {
  font-size: 1.1rem;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.015em;
  line-height: 1.25;
}

.pe-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #818CF8;
  background-color: rgba(99, 102, 241, 0.12);
  padding: 3px 8px;
  border-radius: 99px;
  border: 1px solid rgba(129, 140, 248, 0.25);
  line-height: 1;
}

.pe-role {
  font-size: 0.88rem;
  font-weight: 500;
  color: #94A3B8;
  margin: 0;
  line-height: 1.35;
}

/* Meta: Date & Arrow */
.pe-meta-block {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.pe-date-wrap {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.pe-live-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34D399;
  box-shadow: 0 0 8px #34D399;
  animation: pe-radar 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pe-radar {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 12px #34D399; }
  100% { transform: scale(0.9); opacity: 0.8; }
}

.pe-date {
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748B;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
  white-space: nowrap;
}

.pe-arrow-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 260ms cubic-bezier(0.16, 1, 0.3, 1);
}

.pe-arrow-icon {
  width: 15px;
  height: 15px;
  color: #94A3B8;
  transition: transform 260ms cubic-bezier(0.16, 1, 0.3, 1), color 260ms ease;
}

.pe-card-spotlight-wrapper:hover .pe-arrow-btn {
  background-color: rgba(99, 102, 241, 0.25);
  border-color: rgba(129, 140, 248, 0.5);
}

.pe-card-spotlight-wrapper:hover .pe-arrow-icon {
  color: #818CF8;
  transform: translate(3px, -3px);
}

/* === CARD MIDDLE: DESCRIPTION === */
.pe-desc {
  font-size: 0.93rem;
  line-height: 1.65;
  color: #CBD5E1;
  margin: 0;
  max-width: 820px;
}

/* === CARD BOTTOM: TECHNOLOGY TAGS === */
.pe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 2px;
}

.pe-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 99px;
  background-color: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 0.74rem;
  font-weight: 500;
  color: #94A3B8;
  transition: all 0.2s ease;
}

.pe-card-spotlight-wrapper:hover .pe-tag {
  color: #E2E8F0;
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(129, 140, 248, 0.25);
}

/* === UNIQUE SIGNATURE DETAIL: AND BEYOND === */
.pe-beyond-wrap {
  display: flex;
  align-items: center;
  margin-top: 48px;
  padding-left: 28px;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s;
}
.pe-beyond-wrap.is-in {
  opacity: 1;
  transform: translateY(0);
}

.pe-beyond-line {
  position: relative;
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin-right: 28px;
  overflow: hidden;
}

.pe-beyond-beam {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, transparent, #818CF8, transparent);
  animation: pe-laser 3.5s ease-in-out infinite;
}

@keyframes pe-laser {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

.pe-beyond-content {
  text-align: right;
  flex-shrink: 0;
}

.pe-beyond-header {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.pe-beyond-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #818CF8;
  box-shadow: 0 0 10px #818CF8;
  animation: pe-dot-pulse 2s infinite;
}

@keyframes pe-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 14px #818CF8; }
}

.pe-beyond-title {
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: #FFFFFF;
  text-transform: uppercase;
}

.pe-beyond-sub {
  font-size: 0.84rem;
  color: #64748B;
  margin: 3px 0 0;
  line-height: 1.4;
}

/* === RESPONSIVE LAYOUT & ANIMATIONS === */
@media (max-width: 768px) {
  .pe-section {
    padding: 80px 16px 100px;
  }

  .pe-card {
    padding: 22px 20px;
    gap: 14px;
  }

  .pe-card-top {
    flex-direction: column;
    align-items: flex-start;
  }

  .pe-meta-block {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  .pe-connector {
    height: 32px;
    margin-left: 36px;
  }

  /* Entrance reveal animation for cards when scrolled into view */
  .pe-card-row {
    transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .pe-card-row.is-in {
    animation: pe-mobile-card-reveal 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes pe-mobile-card-reveal {
    0% {
      opacity: 0;
      transform: translateY(22px) scale(0.98);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Ambient border glow shimmer for revealed cards on mobile touchscreens */
  .pe-card-row.is-in .pe-card-spotlight-wrapper {
    background: linear-gradient(
      135deg,
      rgba(129, 140, 248, 0.4) 0%,
      rgba(255, 255, 255, 0.08) 50%,
      rgba(99, 102, 241, 0.35) 100%
    );
    background-size: 200% 200%;
    animation: pe-mobile-border-shift 5s ease-in-out infinite;
    box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.6), 0 0 16px -4px rgba(99, 102, 241, 0.22);
  }

  @keyframes pe-mobile-border-shift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  /* Top hairline glowing accent across revealed cards */
  .pe-card::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(129, 140, 248, 0.7), transparent);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .pe-card-row.is-in .pe-card::after {
    opacity: 1;
    animation: pe-mobile-hairline 3.2s ease-in-out infinite;
  }

  @keyframes pe-mobile-hairline {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.9; }
  }

  /* Logo Monogram subtle breathing pulse on mobile viewports */
  .pe-card-row.is-in .pe-logo {
    animation: pe-mobile-logo-float 3.5s ease-in-out infinite;
  }
  .pe-card-row:nth-child(2).is-in .pe-logo {
    animation-delay: 0.7s;
  }
  .pe-card-row:nth-child(3).is-in .pe-logo {
    animation-delay: 1.4s;
  }

  @keyframes pe-mobile-logo-float {
    0%, 100% {
      transform: translateY(0) scale(1);
      border-color: rgba(129, 140, 248, 0.3);
      box-shadow: 0 0 0 rgba(99, 102, 241, 0);
    }
    50% {
      transform: translateY(-2px) scale(1.03);
      border-color: rgba(129, 140, 248, 0.6);
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
    }
  }

  /* Staggered entrance pop for technology tags on mobile */
  .pe-card-row.is-in .pe-tag {
    animation: pe-mobile-tag-enter 0.42s cubic-bezier(0.16, 1, 0.3, 1) both;
  }
  .pe-card-row.is-in .pe-tag:nth-child(1) { animation-delay: 0.1s; }
  .pe-card-row.is-in .pe-tag:nth-child(2) { animation-delay: 0.17s; }
  .pe-card-row.is-in .pe-tag:nth-child(3) { animation-delay: 0.24s; }
  .pe-card-row.is-in .pe-tag:nth-child(4) { animation-delay: 0.31s; }

  @keyframes pe-mobile-tag-enter {
    0% {
      opacity: 0;
      transform: translateY(6px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Immediate tactile touch feedback when tapping cards on mobile */
  .pe-card-spotlight-wrapper:active {
    transform: scale(0.985);
    transition: transform 120ms ease;
  }

  .pe-card-spotlight-wrapper:active .pe-card {
    background-color: #0b1020;
    box-shadow: 0 6px 20px -2px rgba(99, 102, 241, 0.25);
  }

  .pe-card-spotlight-wrapper:active .pe-arrow-btn {
    background-color: rgba(99, 102, 241, 0.3);
    border-color: rgba(129, 140, 248, 0.6);
    transform: translate(2px, -2px);
  }

  .pe-card-spotlight-wrapper:active .pe-arrow-icon {
    color: #818CF8;
    transform: translate(2px, -2px);
  }

  .pe-beyond-wrap {
    padding-left: 0;
    margin-top: 36px;
  }

  .pe-beyond-line {
    margin-right: 16px;
  }
}
`;
