import { useEffect, useRef, useState } from 'react';

// ─── Data ─────────────────────────────────────────────────────────────────────
const EXPERIENCES = [
  {
    id: 1,
    company: 'F1RSTLOOK DIGITAL',
    companyShort: 'F1',
    website: 'https://firstlook.digital/',
    domain: 'firstlook.digital',
    period: '2025 — Present',
    status: 'active',
    roles: [
      {
        title: 'Operations Head',
        type: 'Leadership',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
        ),
        color: '#38BDF8',
        desc: 'Digital Startup · Full-time',
      },
      {
        title: 'Web Developer',
        type: 'Engineering',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6"/>
            <polyline points="8 6 2 12 8 18"/>
          </svg>
        ),
        color: '#FB923C',
        desc: 'Designed & built firstlook.digital',
      },
    ],
    highlights: [
      { icon: '⚙', text: 'Led day-to-day digital operations and internal workflows' },
      { icon: '🌐', text: 'Designed & developed the official F1RSTLOOK website' },
      { icon: '⚡', text: 'Built responsive UI, integrated brand identity, optimized performance' },
      { icon: '🎯', text: 'Bridged brand strategy with execution via digital tools' },
      { icon: '🚀', text: 'Oversaw product launches, campaigns, and client deliverables' },
      { icon: '🤖', text: 'Drove growth systems, automation, and process optimization' },
    ],
    tags: ['Operations', 'React', 'Web Dev', 'UI/UX', 'Strategy', 'Digital Marketing', 'Leadership'],
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  // Section entrance
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Card reveal stagger
  useEffect(() => {
    if (!visible) return;
    EXPERIENCES.forEach((_, i) => {
      setTimeout(() => setRevealed(r => ({ ...r, [i]: true })), 200 + i * 150);
    });
  }, [visible]);

  return (
    <section ref={sectionRef} className="exp-section">
      <style>{CSS}</style>

      {/* Ambient */}
      <div className="exp-grid" aria-hidden="true" />
      <div className="exp-glow" aria-hidden="true" />

      <div className="exp-container">

        {/* Header */}
        <div className={`exp-header${visible ? ' exp-header--in' : ''}`}>
          <span className="exp-eyebrow">Work History</span>
          <h2 className="exp-title">Experience</h2>
          <p className="exp-subtitle">Building things that matter, end to end.</p>
        </div>

        {/* Timeline */}
        <div className="exp-timeline">
          {EXPERIENCES.map((exp, idx) => (
            <div
              key={exp.id}
              className={`exp-entry${revealed[idx] ? ' exp-entry--in' : ''}`}
              style={{ transitionDelay: `${idx * 120}ms` }}
            >
              {/* Timeline spine: dot + line */}
              <div className="exp-spine" aria-hidden="true">
                <div className="exp-spine-dot">
                  {exp.status === 'active' && <span className="exp-spine-ping" />}
                </div>
                {idx < EXPERIENCES.length - 1 && <div className="exp-spine-line" />}
              </div>

              {/* Card */}
              <div className="exp-card">

                {/* Card top */}
                <div className="exp-card-top">
                  {/* Company */}
                  <div className="exp-company-block">
                    <a
                      href={exp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exp-company-link"
                      aria-label={`Visit ${exp.company}`}
                    >
                      <div className="exp-logo">
                        <span className="exp-logo-text">{exp.companyShort}</span>
                      </div>
                      <div>
                        <span className="exp-company-name">{exp.company}</span>
                        <span className="exp-company-domain">{exp.domain} ↗</span>
                      </div>
                    </a>
                  </div>

                  {/* Period + status */}
                  <div className="exp-meta">
                    {exp.status === 'active' && (
                      <span className="exp-badge exp-badge--active">
                        <span className="exp-badge-dot" />
                        Active
                      </span>
                    )}
                    <span className="exp-period">{exp.period}</span>
                  </div>
                </div>

                {/* Divider */}
                <div className="exp-divider" />

                {/* Roles row */}
                <div className="exp-roles">
                  {exp.roles.map((role) => (
                    <div key={role.title} className="exp-role-pill" style={{ '--role-color': role.color } as React.CSSProperties}>
                      <span className="exp-role-icon" style={{ color: role.color }}>{role.icon}</span>
                      <div>
                        <p className="exp-role-title">{role.title}</p>
                        <p className="exp-role-desc">{role.desc}</p>
                      </div>
                      <span className="exp-role-type" style={{ color: role.color }}>{role.type}</span>
                    </div>
                  ))}
                </div>

                {/* Highlights */}
                <div className="exp-highlights">
                  <p className="exp-highlights-label">— Key Contributions</p>
                  <div className="exp-highlights-grid">
                    {exp.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="exp-hl"
                        style={{ animationDelay: revealed[idx] ? `${300 + i * 60}ms` : '0ms' }}
                      >
                        <span className="exp-hl-icon">{h.icon}</span>
                        <span className="exp-hl-text">{h.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="exp-tags">
                  {exp.tags.map(tag => (
                    <span key={tag} className="exp-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const CSS = `
/* === SECTION === */
.exp-section {
  position: relative;
  background: var(--color-background, #080810);
  padding: 100px 16px 120px;
  overflow: hidden;
}
.exp-grid {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}
.exp-glow {
  position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
  width: min(900px, 100vw); height: 500px; pointer-events: none;
  background: radial-gradient(ellipse at center, rgba(56,189,248,0.08) 0%, transparent 65%);
}
.exp-container {
  max-width: 900px; margin: 0 auto;
  position: relative; z-index: 1;
}

/* === HEADER === */
.exp-header {
  text-align: center;
  margin-bottom: 72px;
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.exp-header--in { opacity: 1; transform: translateY(0); }
.exp-eyebrow {
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: #38BDF8;
  margin-bottom: 12px;
}
.exp-title {
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800; color: #fff;
  letter-spacing: -0.02em; line-height: 1.1;
  margin: 0 0 12px;
}
.exp-subtitle {
  font-size: 0.95rem; color: #94A3B8;
  letter-spacing: 0.02em; margin: 0;
}

/* === TIMELINE === */
.exp-timeline { display: flex; flex-direction: column; gap: 0; }

.exp-entry {
  display: grid;
  grid-template-columns: 32px 1fr;
  gap: 0 24px;
  opacity: 0; transform: translateY(32px);
  transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1);
}
.exp-entry--in { opacity: 1; transform: translateY(0); }

/* === SPINE === */
.exp-spine {
  display: flex; flex-direction: column; align-items: center;
  padding-top: 6px;
}
.exp-spine-dot {
  position: relative;
  width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #38BDF8, #60A5FA);
  box-shadow: 0 0 14px rgba(56,189,248,0.8), 0 0 30px rgba(56,189,248,0.3);
  z-index: 1;
}
.exp-spine-ping {
  position: absolute; inset: -4px;
  border-radius: 50%;
  border: 1.5px solid rgba(56,189,248,0.6);
  animation: exp-ping 2s ease-out infinite;
}
@keyframes exp-ping {
  0%   { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}
.exp-spine-line {
  width: 1px; flex: 1; min-height: 24px; margin-top: 6px;
  background: linear-gradient(to bottom, rgba(56,189,248,0.4), transparent);
}

/* === CARD === */
.exp-card {
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 40px;
  backdrop-filter: blur(12px);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.exp-card:hover {
  border-color: rgba(56,189,248,0.4);
  box-shadow: 0 0 40px rgba(56,189,248,0.12), 0 8px 32px rgba(0,0,0,0.3);
}

/* === CARD TOP === */
.exp-card-top {
  display: flex; flex-wrap: wrap;
  align-items: flex-start; justify-content: space-between;
  gap: 16px; margin-bottom: 20px;
}
.exp-company-block { display: flex; flex-direction: column; gap: 0; }
.exp-company-link {
  display: inline-flex; align-items: center; gap: 12px;
  text-decoration: none;
  transition: opacity 0.2s;
}
.exp-company-link:hover { opacity: 0.85; }
.exp-logo {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(56,189,248,0.15);
  border: 1px solid rgba(56,189,248,0.4);
}
.exp-logo-text {
  font-size: 0.8rem; font-weight: 900; color: #38BDF8;
  letter-spacing: 0.05em;
}
.exp-company-name {
  display: block;
  font-size: 1.15rem; font-weight: 800; color: #FFFFFF;
  letter-spacing: 0.05em; line-height: 1.2;
}
.exp-company-domain {
  display: block;
  font-size: 0.75rem; color: #38BDF8;
  font-weight: 600;
  letter-spacing: 0.08em; margin-top: 3px;
  font-family: 'Courier New', monospace;
}
.exp-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.exp-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; border-radius: 20px;
  background: rgba(74,222,128,0.12);
  border: 1px solid rgba(74,222,128,0.4);
  font-size: 0.68rem; font-weight: 600;
  color: #4ADE80; letter-spacing: 0.15em; text-transform: uppercase;
}
.exp-badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #4ADE80;
  box-shadow: 0 0 8px rgba(74,222,128,0.9);
  animation: exp-ping 1.5s ease-out infinite;
}
.exp-period {
  font-family: 'Courier New', monospace;
  font-size: 0.75rem; color: #94A3B8; letter-spacing: 0.1em;
}

/* === DIVIDER === */
.exp-divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(56,189,248,0.3), rgba(255,255,255,0.1), rgba(251,146,60,0.2));
  margin-bottom: 20px;
}

/* === ROLES === */
.exp-roles {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px; margin-bottom: 24px;
}
.exp-role-pill {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: 14px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  transition: border-color 0.25s ease, background 0.25s ease;
}
.exp-role-pill:hover {
  background: rgba(255,255,255,0.07);
  border-color: color-mix(in srgb, var(--role-color) 50%, transparent);
}
.exp-role-icon {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: color-mix(in srgb, var(--role-color) 18%, transparent);
}
.exp-role-title {
  font-size: 0.95rem; font-weight: 700; color: #FFFFFF;
  margin: 0 0 2px;
}
.exp-role-desc {
  font-size: 0.72rem; color: #94A3B8;
  margin: 0; letter-spacing: 0.02em;
}
.exp-role-type {
  margin-left: auto; flex-shrink: 0;
  font-size: 0.6rem; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  font-family: 'Courier New', monospace;
}

/* === HIGHLIGHTS === */
.exp-highlights { margin-bottom: 22px; }
.exp-highlights-label {
  font-family: 'Courier New', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #38BDF8;
  margin: 0 0 12px;
}
.exp-highlights-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 8px;
}
.exp-hl {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 11px 13px; border-radius: 10px;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.08);
  opacity: 0; animation: exp-hlIn 0.4s ease both;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.exp-hl:hover {
  background: rgba(56,189,248,0.08);
  border-color: rgba(56,189,248,0.25);
}
@keyframes exp-hlIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.exp-hl-icon { font-size: 0.95rem; flex-shrink: 0; margin-top: 1px; line-height: 1; }
.exp-hl-text {
  font-size: 0.82rem; color: #E2E8F0; line-height: 1.5;
  letter-spacing: 0.01em;
}

/* === TAGS === */
.exp-tags {
  display: flex; flex-wrap: wrap; gap: 6px;
  padding-top: 18px;
  border-top: 1px solid rgba(255,255,255,0.08);
}
.exp-tag {
  padding: 4px 10px; border-radius: 20px;
  font-size: 0.68rem; font-weight: 500;
  color: #CBD5E1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  letter-spacing: 0.06em;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  cursor: default;
}
.exp-tag:hover {
  color: #38BDF8;
  background: rgba(56,189,248,0.12);
  border-color: rgba(56,189,248,0.4);
}

/* Responsive tweaks */
@media (max-width: 600px) {
  .exp-card { padding: 20px 16px; }
  .exp-card-top { flex-direction: column; }
  .exp-meta { align-items: flex-start; }
  .exp-entry { grid-template-columns: 24px 1fr; gap: 0 16px; }
}
`;
