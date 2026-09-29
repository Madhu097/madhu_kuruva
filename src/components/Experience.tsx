import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './Experience.css';

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
  const rafMapRef = useRef<Map<HTMLElement, number>>(new Map());

  // Individual scroll observers for each card and section element
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    // Header observer
    const headerEl = root.querySelector('.pe-header');
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          headerObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );
    if (headerEl) headerObserver.observe(headerEl);

    // Cards observer: each card reveals independently when scrolled into view
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const cardElements = root.querySelectorAll('.pe-card-row');
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setRevealedIds((prev) => {
                if (prev[id]) return prev;
                return { ...prev, [id]: true };
              });
              cardObserver.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: isMobile ? 0.08 : 0.15,
        rootMargin: isMobile ? '0px 0px -20px 0px' : '0px 0px -50px 0px',
      }
    );
    cardElements.forEach((el) => cardObserver.observe(el));

    // Beyond footer observer
    const beyondEl = root.querySelector('.pe-beyond-wrap');
    const beyondObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBeyondVisible(true);
          beyondObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (beyondEl) beyondObserver.observe(beyondEl);

    const activeRafs = rafMapRef.current;
    return () => {
      headerObserver.disconnect();
      cardObserver.disconnect();
      beyondObserver.disconnect();
      activeRafs.forEach((id) => cancelAnimationFrame(id));
      activeRafs.clear();
    };
  }, []);

  // Batched spotlight mouse tracker via requestAnimationFrame to eliminate layout thrashing
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafMapRef.current.has(card)) return;

    const id = requestAnimationFrame(() => {
      rafMapRef.current.delete(card);
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });

    rafMapRef.current.set(card, id);
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const id = rafMapRef.current.get(card);
    if (id !== undefined) {
      cancelAnimationFrame(id);
      rafMapRef.current.delete(card);
    }
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="pe-section">
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
                  onMouseLeave={handleMouseLeave}
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
