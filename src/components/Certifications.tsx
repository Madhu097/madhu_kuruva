import { useState, useMemo, useEffect, useCallback } from 'react';
import { Award, Shield, Sparkles, Trophy, Star, ExternalLink, CheckCircle2, X } from 'lucide-react';
import CircularGallery from './CircularGallery';

interface CertificateData {
  id: number;
  title: string;
  issuer: string;
  date: string;
  icon: typeof Shield;
  color: string;
  secondaryColor: string;
  skills: string[];
  credId: string;
  description: string;
  url: string;
}

const rawCertificates: CertificateData[] = [
  {
    id: 1,
    title: 'Udemy Full Stack',
    issuer: 'Sara Academy',
    date: '2025',
    icon: Shield,
    color: '#06b6d4',
    secondaryColor: '#3b82f6',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Java', 'Full Stack'],
    credId: 'UC-FS-2025-01',
    description: 'Comprehensive Full Stack curriculum spanning responsive UI, JavaScript engines, Java backend architecture & system design.',
    url: 'https://drive.google.com/file/d/1Fgf7v1H0OTpPNv0EY95uBgCmvAVl07nU/view',
  },
  {
    id: 2,
    title: 'Python for Data Science',
    issuer: 'Cognitive Class (IBM)',
    date: '2024',
    icon: Award,
    color: '#a855f7',
    secondaryColor: '#ec4899',
    skills: ['Python', 'Pandas', 'NumPy', 'Data Analytics'],
    credId: 'IBM-CC-PY101',
    description: 'Foundations of computational data analysis, statistical modeling, data structures, and Python analytical libraries.',
    url: 'https://drive.google.com/file/d/1CiS4NMxk9M9EMco_3bWceTJBfYh4qZrC/view',
  },
  {
    id: 3,
    title: 'Web Dev Internship',
    issuer: 'Pantech e Learning',
    date: '2025',
    icon: Sparkles,
    color: '#3b82f6',
    secondaryColor: '#06b6d4',
    skills: ['React', 'Node.js', 'REST APIs', 'UI Engineering'],
    credId: 'PAN-INT-2025',
    description: 'Hands-on production internship building reactive web interfaces, API integrations, and scalable client-side features.',
    url: 'https://drive.google.com/file/d/1iD7fk8LdTAkDJhe6-rlbL2TFu6iEf-NE/view',
  },
  {
    id: 4,
    title: 'Java Mastery',
    issuer: 'Simplilearn',
    date: '2025',
    icon: Trophy,
    color: '#f43f5e',
    secondaryColor: '#fb923c',
    skills: ['Java', 'OOP', 'Data Structures', 'Algorithms'],
    credId: 'SL-JAVA-ADV',
    description: 'Deep dive into object-oriented principles, multithreading, collections framework, and clean architecture paradigms.',
    url: 'https://drive.google.com/file/d/1qYxtOBU0OxWaXqE1__R9UUFhmmYuO1Me/view',
  },
  {
    id: 5,
    title: 'MySQL Database Expert',
    issuer: 'Udemy',
    date: '2024',
    icon: Star,
    color: '#f59e0b',
    secondaryColor: '#ef4444',
    skills: ['SQL', 'MySQL', 'Schema Design', 'Query Optimization'],
    credId: 'UC-MYSQL-EXP',
    description: 'Relational database architecture, relational algebra, index tuning, transaction isolation, and query optimization.',
    url: 'https://drive.google.com/file/d/1n25Y3Y_placeholder/view',
  },
];

// Polyfill roundRect
function polyfillRoundRect(ctx: CanvasRenderingContext2D) {
  if (typeof (ctx as any).roundRect !== 'function') {
    (ctx as any).roundRect = function (x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    };
  }
}

// Wrap text to lines within maxWidth
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const w of words) {
    const test = current ? current + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Draw a certificate card at 1800×2520 (5:7 aspect ratio, portrait).
 * Ultra high-resolution so text is extremely crisp when rendered in WebGL.
 * Text is massively oversized so it reads clearly when the card is scaled down on screen.
 */
function generateCardImage(cert: CertificateData): string {
  const W = 1800, H = 2520;
  const PL = 120; // left padding
  const PR = 120; // right padding
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  polyfillRoundRect(ctx);

  // ── BACKGROUND ────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#131830'); // brighter top for contrast
  bg.addColorStop(1, '#070a14'); // darker bottom
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // ── LEFT ACCENT BAR ───────────────────────────────────────────────
  const bar = ctx.createLinearGradient(0, 0, 0, H);
  bar.addColorStop(0, cert.color + 'ff');
  bar.addColorStop(0.5, cert.secondaryColor + 'ff');
  bar.addColorStop(1, cert.color + '80');
  ctx.fillStyle = bar;
  ctx.fillRect(0, 0, 24, H);

  // ── HEADER ZONE ───────────────────────────────────────────────────
  // "VERIFIED" tag
  ctx.font = 'bold 64px "Courier New", monospace';
  ctx.fillStyle = cert.color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦  VERIFIED CERTIFICATION', PL, 120);

  // Date right
  ctx.font = 'bold 60px "Courier New", monospace';
  ctx.fillStyle = '#94a3b8'; // Brighter gray
  ctx.textAlign = 'right';
  ctx.fillText(`ISSUED  ${cert.date}`, W - PR, 120);

  // Header separator
  ctx.beginPath();
  ctx.moveTo(PL, 220);
  ctx.lineTo(W - PR, 220);
  ctx.strokeStyle = cert.color + '50';
  ctx.lineWidth = 4;
  ctx.stroke();

  // ── SEAL EMBLEM ───────────────────────────────────────────────────
  const sX = W - PR - 100, sY = 460;
  ctx.beginPath();
  ctx.arc(sX, sY, 140, 0, Math.PI * 2);
  ctx.strokeStyle = cert.color + '60';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sX, sY, 110, 0, Math.PI * 2);
  const sGrad = ctx.createRadialGradient(sX, sY, 0, sX, sY, 110);
  sGrad.addColorStop(0, cert.color + '40');
  sGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sGrad;
  ctx.fill();
  ctx.font = 'bold 90px sans-serif';
  ctx.fillStyle = cert.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', sX, sY);

  // ── TITLE ─────────────────────────────────────────────────────────
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  const maxTitleW = W - PL - 380;
  let titleSize = 160;
  ctx.font = `bold ${titleSize}px sans-serif`;

  let titleLines = wrapText(ctx, cert.title, maxTitleW);
  if (titleLines.length > 2) {
    titleSize = 130;
    ctx.font = `bold ${titleSize}px sans-serif`;
    titleLines = wrapText(ctx, cert.title, maxTitleW);
  }

  const titleGrad = ctx.createLinearGradient(PL, 0, maxTitleW, 0);
  titleGrad.addColorStop(0, '#ffffff');
  titleGrad.addColorStop(1, '#f1f5f9');
  ctx.fillStyle = titleGrad;

  titleLines.forEach((line, i) => {
    ctx.fillText(line, PL, 400 + (i * titleSize * 1.25));
  });

  const contentStartY = 400 + ((titleLines.length - 1) * titleSize * 1.25) + 160;

  // ── ISSUER ────────────────────────────────────────────────────────
  ctx.font = 'bold 84px sans-serif';
  const iGrad = ctx.createLinearGradient(PL, 0, 1200, 0);
  iGrad.addColorStop(0, cert.color);
  iGrad.addColorStop(1, cert.secondaryColor);
  ctx.fillStyle = iGrad;
  ctx.fillText(cert.issuer, PL, contentStartY);

  // ── CREDENTIAL ID ─────────────────────────────────────────────────
  ctx.font = 'bold 64px "Courier New", monospace';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`Credential ID:  ${cert.credId}`, PL, contentStartY + 100);

  // ── DIVIDER ───────────────────────────────────────────────────────
  ctx.beginPath();
  ctx.moveTo(PL, contentStartY + 180);
  ctx.lineTo(W - PR, contentStartY + 180);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 4;
  ctx.stroke();

  // ── DESCRIPTION ───────────────────────────────────────────────────
  ctx.font = '84px sans-serif';
  ctx.fillStyle = '#e2e8f0'; // Almost white for extreme clarity
  const descLines = wrapText(ctx, cert.description, W - PL - PR - 20);
  descLines.slice(0, 5).forEach((line, i) => {
    ctx.fillText(line, PL, contentStartY + 300 + i * 110);
  });

  // ── SKILLS LABEL ──────────────────────────────────────────────────
  const skillsStartY = contentStartY + 300 + (Math.min(descLines.length, 5) * 110) + 120;
  ctx.font = 'bold 56px "Courier New", monospace';
  ctx.fillStyle = cert.color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('SKILLS & EXPERTISE', PL, skillsStartY);

  // ── SKILLS PILLS ──────────────────────────────────────────────────
  let pillX = PL;
  let pillY = skillsStartY + 40;
  ctx.font = 'bold 60px sans-serif';

  for (const skill of cert.skills) {
    const tw = ctx.measureText(skill).width;
    const pw = tw + 120;
    const ph = 110;
    if (pillX + pw > W - PR) { pillX = PL; pillY += 150; }

    ctx.fillStyle = '#1e293b';
    (ctx as any).roundRect(pillX, pillY, pw, ph, 55);
    ctx.fill();

    ctx.strokeStyle = cert.color;
    ctx.lineWidth = 4;
    (ctx as any).roundRect(pillX, pillY, pw, ph, 55);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pillX + 46, pillY + ph / 2, 14, 0, Math.PI * 2);
    ctx.fillStyle = cert.color;
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(skill, pillX + 80, pillY + ph / 2 + 6);
    pillX += pw + 32;
  }

  // ── FOOTER ZONE ───────────────────────────────────────────────────
  const footerY = H - 280;

  ctx.beginPath();
  ctx.moveTo(PL, footerY);
  ctx.lineTo(W - PR, footerY);
  ctx.strokeStyle = cert.color + '60';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Verified badge left
  ctx.font = 'bold 64px sans-serif';
  ctx.fillStyle = '#4ade80'; // Very bright green
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('✔  Verified Credential', PL, footerY + 120);

  // CTA right
  ctx.font = 'bold 60px "Courier New", monospace';
  ctx.fillStyle = cert.color;
  ctx.textAlign = 'right';
  ctx.fillText('TAP TO VIEW  →', W - PR, footerY + 120);

  // Card border
  ctx.strokeStyle = cert.color + '60';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, W - 6, H - 6);

  return canvas.toDataURL('image/png');
}

// ── Full-Screen Certificate Modal ─────────────────────────────────────────────
function FullScreenModal({ cert, onClose }: { cert: CertificateData; onClose: () => void }) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  const Icon = cert.icon;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(20px)', animation: 'fsIn 0.2s ease both' }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fsIn { from { opacity:0; } to { opacity:1; } }
        @keyframes fsCardIn { from { opacity:0; transform:scale(0.96) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      <div
        className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl"
        style={{
          background: 'linear-gradient(140deg, #0d0f1a 0%, #080a12 100%)',
          border: `1.5px solid ${cert.color}40`,
          boxShadow: `0 0 80px ${cert.color}20, 0 32px 100px rgba(0,0,0,0.9)`,
          animation: 'fsCardIn 0.28s cubic-bezier(0.16,1,0.3,1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Color accent top bar */}
        <div
          className="h-1.5 w-full rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, ${cert.color}, ${cert.secondaryColor}, ${cert.color})` }}
        />

        <div className="p-6 sm:p-8 space-y-5">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors hover:bg-white/8"
          >
            <X size={18} />
          </button>

          {/* Header row */}
          <div className="flex items-start gap-4 pr-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border"
              style={{ background: `${cert.color}18`, borderColor: `${cert.color}45` }}
            >
              <Icon className="w-7 h-7" style={{ color: cert.color }} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">{cert.title}</h2>
              <p className="text-sm font-semibold mt-0.5" style={{ color: cert.color }}>{cert.issuer}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Issued {cert.date} · ID: {cert.credId}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, ${cert.color}40, transparent)` }} />

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{cert.description}</p>

          {/* Skills */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: cert.color }}>
              Skills & Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {cert.skills.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={{ background: `${cert.color}12`, borderColor: `${cert.color}40`, color: '#e2e8f0' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-green-400 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Credential</span>
            </div>
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${cert.color}, ${cert.secondaryColor})` }}
            >
              View Certificate
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function Certifications() {
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);

  const galleryItems = useMemo(() => rawCertificates.map(cert => ({
    image: generateCardImage(cert),
    text: cert.title,
    url: cert.url,
  })), []);

  const handleCardClick = (item: { text: string }) => {
    const matched = rawCertificates.find(c => c.title === item.text);
    if (matched) setSelectedCert(matched);
  };

  return (
    <section id="certifications" className="py-16 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: 'rgba(6,182,212,0.06)' }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{ background: 'rgba(99,102,241,0.05)' }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-3 mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-mono text-xs tracking-widest uppercase"
          style={{ background: 'rgba(10,132,255,0.08)', borderColor: 'rgba(10,132,255,0.2)', color: '#0A84FF' }}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Certifications</span>
        </div>
        <h2 className="font-syne text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Credentials &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
            Achievements
          </span>
        </h2>
        <p className="text-slate-500 text-xs max-w-sm mx-auto font-mono">
          Drag · Scroll · Tap any card to view credential
        </p>
      </div>

      {/*
        Gallery frame: fixed height so OGL can size cards at 78% of this height.
        Cards maintain 1400:900 aspect ratio — adjacent card edges peek from both sides.
      */}
      <div
        className="relative w-full"
        style={{ height: 'clamp(320px, 40vw, 560px)' }}
      >
        <CircularGallery
          items={galleryItems}
          bend={1.2}
          textColor="rgba(0,0,0,0)"
          borderRadius={0.04}
          font="bold 1px sans-serif"
          scrollSpeed={2.5}
          scrollEase={0.07}
          onItemClick={handleCardClick}
        />
      </div>

      {/* Full-Screen Modal */}
      {selectedCert && (
        <FullScreenModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
      )}
    </section>
  );
}

