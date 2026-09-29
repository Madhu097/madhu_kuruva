import { useState, useEffect, useRef } from 'react';
import {
  Home,
  User,
  Briefcase,
  Cpu,
  FolderGit2,
  Award,
  Send,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: typeof Home;
  short: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home', icon: Home, short: '01' },
  { id: 'about', label: 'About', icon: User, short: '02' },
  { id: 'experience', label: 'Experience', icon: Briefcase, short: '03' },
  { id: 'skills', label: 'Skills', icon: Cpu, short: '04' },
  { id: 'portfolio', label: 'Projects', icon: FolderGit2, short: '05' },
  { id: 'certifications', label: 'Certificates', icon: Award, short: '06' },
  { id: 'contact', label: 'Contact', icon: Send, short: '07' },
];

export default function RightNavbar() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // References for sliding active indicator
  const desktopRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mobileRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [desktopPill, setDesktopPill] = useState({ top: 0, height: 0, opacity: 0 });
  const [mobilePill, setMobilePill] = useState({ left: 0, width: 0, opacity: 0 });

  // Show navbar only after cinematic intro is completed and hero section is reached
  useEffect(() => {
    let rafId: number | null = null;

    const updateNavbarState = () => {
      rafId = null;
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        const heroTop = heroEl.offsetTop;
        setIsVisible(window.scrollY >= heroTop - 100);
      } else {
        const fallbackThreshold = window.innerHeight * 3;
        setIsVisible(window.scrollY >= fallbackThreshold);
      }

      // Track active section based on viewport scroll position
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateNavbarState);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateNavbarState();
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Recalculate Desktop vertical sliding pill position
  useEffect(() => {
    const el = desktopRefs.current[activeSection];
    if (el) {
      setDesktopPill({
        top: el.offsetTop,
        height: el.offsetHeight,
        opacity: 1,
      });
    }
  }, [activeSection, isExpanded]);

  // Recalculate Mobile horizontal sliding pill position
  useEffect(() => {
    const el = mobileRefs.current[activeSection];
    if (el) {
      setMobilePill({
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeSection]);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }

    // Trigger immediate render of any lazy section matching this ID
    window.dispatchEvent(new CustomEvent('reveal-section', { detail: id }));

    if (id === 'hero') {
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        setTimeout(() => {
          const retryEl = document.getElementById(id);
          retryEl?.scrollIntoView({ behavior: 'smooth' });
        }, 30);
      }
    }
  };

  const activeItemObj = NAV_ITEMS.find((n) => n.id === activeSection) || NAV_ITEMS[0];

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE: TOP HORIZONTAL DYNAMIC ISLAND NAVBAR (< 768px)
         ══════════════════════════════════════════════════════════════════════ */}
      <div
        aria-label="Mobile Navigation Dynamic Island"
        className={`md:hidden fixed top-3 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none flex flex-col items-center gap-1.5 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12 pointer-events-none'
        }`}
      >
        {/* Dynamic Island Outer Container */}
        <div
          className="relative flex items-center p-1 rounded-full"
          style={{
            background: 'rgba(7, 10, 20, 0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(129, 140, 248, 0.28)',
            boxShadow:
              '0 12px 35px -5px rgba(0, 0, 0, 0.75), 0 0 20px -2px rgba(99, 102, 241, 0.3)',
          }}
        >
          {/* Animated GPU-Composited Sliding Pill for Mobile */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              top: 4,
              bottom: 4,
              left: 0,
              width: mobilePill.width,
              transform: `translate3d(${mobilePill.left}px, 0, 0)`,
              opacity: mobilePill.opacity,
              transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), width 300ms ease, opacity 200ms ease',
              willChange: 'transform',
              background:
                'linear-gradient(135deg, rgba(99, 102, 241, 0.40) 0%, rgba(129, 140, 248, 0.22) 100%)',
              border: '1px solid rgba(129, 140, 248, 0.55)',
              boxShadow:
                '0 0 16px rgba(99, 102, 241, 0.5), inset 0 0 8px rgba(129, 140, 248, 0.3)',
            }}
          />

          {/* Navigation Items (Horizontal row) */}
          <nav className="relative flex items-center gap-0.5 z-10">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    mobileRefs.current[item.id] = el;
                  }}
                  onClick={() => scrollTo(item.id)}
                  aria-label={item.label}
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 transition-all duration-300 ${
                      isActive
                        ? 'text-indigo-300 scale-110 drop-shadow-[0_0_6px_rgba(129,140,248,0.8)]'
                        : 'scale-95 hover:scale-105'
                    }`}
                  />

                  {/* Micro active dot */}
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_6px_#818CF8]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Island Active Section Badge Pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider transition-all duration-300"
          style={{
            background: 'rgba(8, 11, 22, 0.75)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(129, 140, 248, 0.20)',
            color: '#A5B4FC',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold uppercase">{activeItemObj.label}</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{activeItemObj.short}</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          DESKTOP: RIGHT-SIDE VERTICAL DRAWER NAVBAR (≥ 768px)
         ══════════════════════════════════════════════════════════════════════ */}
      <aside
        aria-label="Desktop Section Navigation"
        className={`hidden md:block fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'
        }`}
      >
        {/* Outer Glassmorphic Drawer Container */}
        <div
          className="relative flex items-center rounded-2xl p-1.5 transition-all duration-300"
          style={{
            background: 'rgba(8, 12, 24, 0.76)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(129, 140, 248, 0.25)',
            boxShadow:
              '0 8px 32px 0 rgba(0, 0, 0, 0.55), 0 0 20px -2px rgba(99, 102, 241, 0.18)',
          }}
        >
          {/* Toggle Drawer Button on left edge of navbar */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse navigation drawer' : 'Expand navigation drawer'}
            className="absolute -left-7 top-1/2 -translate-y-1/2 w-7 h-12 flex items-center justify-center rounded-l-lg transition-all duration-300 group"
            style={{
              background: 'rgba(8, 12, 24, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(129, 140, 248, 0.25)',
              borderRight: 'none',
            }}
          >
            {isExpanded ? (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
            )}
          </button>

          {/* Vertical Sliding GPU-Composited Capsule Pill for Desktop */}
          <div
            className="absolute left-1.5 right-1.5 rounded-xl pointer-events-none"
            style={{
              top: 0,
              height: desktopPill.height,
              transform: `translate3d(0, ${desktopPill.top}px, 0)`,
              opacity: desktopPill.opacity,
              transition: 'transform 350ms cubic-bezier(0.34,1.56,0.64,1), height 300ms ease, opacity 200ms ease',
              willChange: 'transform',
              background:
                'linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(129, 140, 248, 0.18) 100%)',
              border: '1px solid rgba(129, 140, 248, 0.45)',
              boxShadow:
                '0 0 16px -2px rgba(99, 102, 241, 0.4), inset 0 0 8px rgba(129, 140, 248, 0.2)',
            }}
          >
            {/* Sliding neon accent edge bar */}
            <span
              className="absolute -left-1.5 top-1.5 bottom-1.5 w-1 rounded-r-full"
              style={{
                background: '#818CF8',
                boxShadow: '0 0 10px #818CF8',
              }}
            />
          </div>

          {/* Navigation Items List */}
          <nav className="relative z-10 flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    desktopRefs.current[item.id] = el;
                  }}
                  onClick={() => scrollTo(item.id)}
                  className={`group relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-all duration-200 text-left ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {/* Icon */}
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <Icon
                      className={`w-4 h-4 transition-all duration-300 ${
                        isActive
                          ? 'text-indigo-300 scale-110 drop-shadow-[0_0_6px_rgba(129,140,248,0.7)]'
                          : 'group-hover:scale-110'
                      }`}
                    />
                  </div>

                  {/* Text Label: Visible when drawer is expanded */}
                  {isExpanded && (
                    <div className="flex items-center justify-between min-w-[90px] pr-1 animate-fadeIn">
                      <span className="text-xs font-medium tracking-wide">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 ml-2">
                        {item.short}
                      </span>
                    </div>
                  )}

                  {/* Hover Tooltip when collapsed */}
                  {!isExpanded && (
                    <div
                      className="absolute right-full mr-3.5 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wider whitespace-nowrap opacity-0 pointer-events-none -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      style={{
                        background: 'rgba(10, 14, 28, 0.92)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(129, 140, 248, 0.3)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
                        color: isActive ? '#A5B4FC' : '#E2E8F0',
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
