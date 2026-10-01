import { useState, useEffect, useRef, type FormEvent, type KeyboardEvent } from 'react';
import {
  Terminal,
  X,
  Minus,
  Maximize2,
  ZoomIn,
  ZoomOut,
  CornerDownLeft,
  Trash2,
  ExternalLink,
  FileText,
  Sparkles,
} from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'command' | 'response' | 'error' | 'system';
  content: React.ReactNode;
  timestamp: string;
}

const QUICK_COMMANDS = [
  'help',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'contact',
  'resume',
  'zoom',
  'clear',
];

const INITIAL_WELCOME: React.ReactNode = (
  <div className="space-y-1 text-[11px] font-mono">
    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span>MADHU CLI ASSISTANT (v2.5)</span>
    </div>
    <p className="text-slate-400 text-[10px] leading-relaxed">
      Type <span className="text-yellow-400 font-bold">'help'</span> or tap any quick chip below to explore.
    </p>
  </div>
);

export default function CliChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<'normal' | 'zoomed' | 'max'>('normal');
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isGreenTheme, setIsGreenTheme] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show chatbot launcher only after cinematic intro is completed
  useEffect(() => {
    let rafId: number | null = null;

    const updateVisibility = () => {
      rafId = null;
      const heroEl = document.getElementById('hero');
      if (heroEl) {
        setIsVisible(window.scrollY >= heroEl.offsetTop - 100);
      } else {
        setIsVisible(window.scrollY >= window.innerHeight * 3);
      }
    };

    const handleScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateVisibility);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateVisibility();
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Initialize initial welcome message
  useEffect(() => {
    setHistory([
      {
        id: 'init-1',
        type: 'system',
        content: INITIAL_WELCOME,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  // Auto-scroll to terminal bottom on new output
  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [history, isOpen, isMinimized, zoomLevel]);

  // Focus input when opening terminal
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen, isMinimized]);

  const getTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleZoom = () => {
    setZoomLevel((prev) => {
      if (prev === 'normal') return 'zoomed';
      if (prev === 'zoomed') return 'max';
      return 'normal';
    });
  };

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    const time = getTime();

    // Add to input command history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Add command echo to screen
    const echoItem: HistoryItem = {
      id: `cmd-${Date.now()}`,
      type: 'command',
      content: trimmed,
      timestamp: time,
    };

    const cmdLower = trimmed.toLowerCase();
    let responseItem: HistoryItem | null = null;

    if (cmdLower === 'clear' || cmdLower === 'cls') {
      setHistory([]);
      return;
    }

    if (cmdLower === 'help') {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1 text-[11px]">
            <p className="text-yellow-400 font-semibold mb-0.5">COMMANDS:</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 pl-1 text-[10px]">
              <div><span className="text-emerald-400 font-bold">about</span> : Bio summary</div>
              <div><span className="text-emerald-400 font-bold">skills</span> : Tech stack</div>
              <div><span className="text-emerald-400 font-bold">projects</span> : Live works</div>
              <div><span className="text-emerald-400 font-bold">experience</span> : Career history</div>
              <div><span className="text-emerald-400 font-bold">education</span> : Degrees</div>
              <div><span className="text-emerald-400 font-bold">contact</span> : Socials & email</div>
              <div><span className="text-emerald-400 font-bold">resume</span> : Download PDF</div>
              <div><span className="text-emerald-400 font-bold">zoom</span> : Toggle chat size</div>
              <div><span className="text-emerald-400 font-bold">theme</span> : Matrix tint</div>
              <div><span className="text-emerald-400 font-bold">clear</span> : Clear screen</div>
            </div>
          </div>
        ),
        timestamp: time,
      };
    } else if (
      cmdLower === 'about' ||
      cmdLower.includes('who is madhu') ||
      cmdLower.includes('about me') ||
      cmdLower.includes('who are you')
    ) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1 text-[11px]">
            <p className="text-indigo-300 font-semibold">Madhu Kuruva — Full-Stack Developer</p>
            <p className="text-slate-300 leading-relaxed text-[10px]">
              Computer Science graduate building responsive, high-performance web applications with React, Node.js, and cloud services.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-0.5 text-[9px]">
              <span className="px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">India</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/50">Available to Hire</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-700/50">B.Tech CSE (2026)</span>
            </div>
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower === 'skills' || cmdLower.includes('tech stack') || cmdLower.includes('technologies')) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1 text-[10px]">
            <p className="text-indigo-300 font-semibold text-[11px]">SKILLS INVENTORY:</p>
            <div className="space-y-1 pl-1">
              <div>
                <span className="text-sky-400 font-bold">[Frontend]: </span>
                <span className="text-slate-300">React, JavaScript, HTML5, CSS3, Tailwind</span>
              </div>
              <div>
                <span className="text-emerald-400 font-bold">[Backend]: </span>
                <span className="text-slate-300">Node.js, Express.js, Python, REST APIs</span>
              </div>
              <div>
                <span className="text-amber-400 font-bold">[DB & Cloud]: </span>
                <span className="text-slate-300">MongoDB, MySQL, PostgreSQL, Firebase, AWS</span>
              </div>
              <div>
                <span className="text-purple-400 font-bold">[Tools]: </span>
                <span className="text-slate-300">Git, GitHub, Vite, VS Code, Postman, Figma</span>
              </div>
            </div>
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower === 'projects' || cmdLower.includes('project') || cmdLower.includes('work') || cmdLower.includes('portfolio')) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1.5 text-[10px]">
            <p className="text-indigo-300 font-semibold text-[11px]">FEATURED PROJECTS:</p>
            <div className="space-y-1">
              <div className="p-1.5 rounded bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-yellow-400 font-bold">1. MartVibe</span>
                  <span className="text-slate-400 text-[9px] ml-1.5">(Grocery E-Com)</span>
                </div>
                <div className="flex gap-2 text-[10px]">
                  <a href="https://mart-vibe.vercel.app/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-0.5">
                    Live <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://github.com/Madhu097/martvibe" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                    Code
                  </a>
                </div>
              </div>

              <div className="p-1.5 rounded bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-yellow-400 font-bold">2. Food Remainder</span>
                  <span className="text-slate-400 text-[9px] ml-1.5">(Pantry Tracker)</span>
                </div>
                <div className="flex gap-2 text-[10px]">
                  <a href="https://foodremainder.vercel.app/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-0.5">
                    Live <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://github.com/Madhu097/foodremainder" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                    Code
                  </a>
                </div>
              </div>

              <div className="p-1.5 rounded bg-white/5 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-yellow-400 font-bold">3. HabitFlow</span>
                  <span className="text-slate-400 text-[9px] ml-1.5">(Habit Tracker)</span>
                </div>
                <div className="flex gap-2 text-[10px]">
                  <a href="https://habit-trackings.vercel.app/" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-0.5">
                    Live <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                  <a href="https://github.com/Madhu097/Habit-tracker" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                    Code
                  </a>
                </div>
              </div>
            </div>
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower === 'experience' || cmdLower.includes('experience') || cmdLower.includes('internship')) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1.5 text-[10px]">
            <p className="text-indigo-300 font-semibold text-[11px]">EXPERIENCE:</p>
            <div className="space-y-1 pl-1">
              <div className="border-l border-indigo-500 pl-2">
                <p className="text-white font-semibold">Pantech eLearning — Intern</p>
                <p className="text-slate-400 text-[9px]">Jun 2025 — Aug 2025 | React, HTML, CSS, JS</p>
              </div>
              <div className="border-l border-emerald-500 pl-2">
                <p className="text-white font-semibold">Freelance — Web Developer</p>
                <p className="text-slate-400 text-[9px]">2024 — Present | Client Websites, React</p>
              </div>
              <div className="border-l border-purple-500 pl-2">
                <p className="text-white font-semibold">F1RSTLOOK — Web Developer</p>
                <p className="text-slate-400 text-[9px]">2025 — Present | Modern Web Tech</p>
              </div>
            </div>
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower === 'education' || cmdLower.includes('college') || cmdLower.includes('degree')) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1 text-[10px]">
            <p className="text-indigo-300 font-semibold text-[11px]">EDUCATION:</p>
            <div className="space-y-0.5 pl-1">
              <div>
                <span className="text-emerald-400 font-bold">• 2026: </span>
                <span className="text-white">B.Tech CSE</span>
                <span className="text-slate-400 text-[9px] ml-1">(Malla Reddy Engg College)</span>
              </div>
              <div>
                <span className="text-sky-400 font-bold">• 2023: </span>
                <span className="text-white">Diploma ECE</span>
                <span className="text-slate-400 text-[9px] ml-1">(Anurag Engg College)</span>
              </div>
            </div>
          </div>
        ),
        timestamp: time,
      };
    } else if (
      cmdLower === 'contact' ||
      cmdLower.includes('email') ||
      cmdLower.includes('phone') ||
      cmdLower.includes('hire')
    ) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1 text-[10px]">
            <p className="text-indigo-300 font-semibold text-[11px]">CONTACT LINKS:</p>
            <div className="grid grid-cols-1 gap-1 pl-1">
              <div>
                <span className="text-slate-400">Email: </span>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=madhukuruva20@gmail.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
                  Madhukuruva20@gmail.com
                </a>
              </div>
              <div>
                <span className="text-slate-400">Phone: </span>
                <a href="tel:+916281198769" className="text-sky-400 hover:underline">
                  +91 6281198769
                </a>
              </div>
              <div>
                <span className="text-slate-400">LinkedIn: </span>
                <a href="https://www.linkedin.com/in/madhukuruva9/" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                  linkedin.com/in/madhukuruva9/
                </a>
              </div>
              <div>
                <span className="text-slate-400">GitHub: </span>
                <a href="https://github.com/Madhu097" target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline">
                  github.com/Madhu097
                </a>
              </div>
            </div>
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower === 'resume' || cmdLower.includes('cv') || cmdLower.includes('resume')) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="space-y-1 text-[10px]">
            <p className="text-indigo-300 font-semibold text-[11px]">RESUME (PDF):</p>
            <a
              href="/Madhu Resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors text-[10px]"
            >
              <FileText className="w-3 h-3" />
              <span>Download Madhu's Resume</span>
              <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
            </a>
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower === 'zoom' || cmdLower === 'zoom in' || cmdLower === 'zoomin' || cmdLower === 'zoom out') {
      const nextZoom = zoomLevel === 'normal' ? 'zoomed' : zoomLevel === 'zoomed' ? 'max' : 'normal';
      setZoomLevel(nextZoom);
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="text-[10px] text-emerald-400 font-mono">
            {`[OK] Chat window zoom set to ${nextZoom === 'normal' ? '1x (Compact)' : nextZoom === 'zoomed' ? '1.4x (Large)' : 'Max (Full)'}!`}
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower === 'theme' || cmdLower === 'matrix') {
      setIsGreenTheme((prev) => !prev);
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="text-[10px] text-emerald-400 font-mono">
            {`[OK] Theme toggled to ${!isGreenTheme ? 'Matrix Green Hacker' : 'Cyberpunk Indigo Glass'}!`}
          </div>
        ),
        timestamp: time,
      };
    } else if (cmdLower.includes('hi') || cmdLower.includes('hello') || cmdLower.includes('hey')) {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'response',
        content: (
          <div className="text-[10px] text-slate-300 space-y-0.5">
            <p>Hey there! Great to meet you 👋</p>
            <p className="text-slate-400">
              Type <span className="text-yellow-400 font-bold">'skills'</span> or{' '}
              <span className="text-yellow-400 font-bold">'projects'</span> to explore.
            </p>
          </div>
        ),
        timestamp: time,
      };
    } else {
      responseItem = {
        id: `res-${Date.now()}`,
        type: 'error',
        content: (
          <div className="text-[10px] font-mono text-rose-400">
            command not found: '{trimmed}'. Type <button onClick={() => executeCommand('help')} className="text-yellow-400 underline font-bold">help</button>
          </div>
        ),
        timestamp: time,
      };
    }

    setHistory((prev) => [...prev, echoItem, responseItem!]);
    setInputVal('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = QUICK_COMMANDS.find((cmd) => cmd.startsWith(inputVal.toLowerCase().trim()));
      if (match) {
        setInputVal(match);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    executeCommand(inputVal);
  };

  return (
    <>
      {/* ─── Compact Floating Launcher Button (Right Side) ─── */}
      <div
        className={`fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 select-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible || isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
      >
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          aria-label="Open CLI Terminal Assistant"
          className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(8, 11, 20, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(129, 140, 248, 0.30)',
            boxShadow: '0 6px 24px rgba(0, 0, 0, 0.6), 0 0 16px -2px rgba(99, 102, 241, 0.25)',
          }}
        >
          {/* Pulsing online status indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>

          <Terminal className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />

          <span className="text-[11px] font-mono font-medium text-slate-200 group-hover:text-white transition-colors">
            &gt;_ CLI
          </span>
        </button>
      </div>

      {/* ─── Terminal Window Modal with Zoom Support (Right Side) ─── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Interactive CLI Bot"
          className={`fixed z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${
            zoomLevel === 'max'
              ? 'inset-3 sm:inset-8 rounded-2xl'
              : zoomLevel === 'zoomed'
              ? 'bottom-14 sm:bottom-16 right-3 left-3 sm:left-auto sm:right-5 w-auto sm:w-[460px] md:w-[500px] h-[390px] sm:h-[450px] max-h-[68vh] rounded-2xl'
              : 'bottom-14 sm:bottom-16 right-3 left-3 sm:left-auto sm:right-5 w-auto sm:w-[350px] md:w-[370px] h-[310px] sm:h-[350px] max-h-[50vh] rounded-2xl'
          } ${isMinimized ? 'hidden' : 'flex'}`}
          style={{
            background: isGreenTheme ? 'rgba(5, 14, 8, 0.92)' : 'rgba(8, 11, 20, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: isGreenTheme
              ? '1px solid rgba(16, 185, 129, 0.30)'
              : '1px solid rgba(129, 140, 248, 0.30)',
            boxShadow: isGreenTheme
              ? '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 25px -5px rgba(16, 185, 129, 0.2)'
              : '0 16px 40px rgba(0, 0, 0, 0.75), 0 0 25px -5px rgba(99, 102, 241, 0.2)',
          }}
        >
          {/* Window Header Bar */}
          <div
            className="flex items-center justify-between px-3 py-2 border-b select-none rounded-t-2xl"
            style={{
              borderColor: isGreenTheme ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.02)',
            }}
          >
            {/* macOS traffic lights */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close terminal"
                className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 flex items-center justify-center transition-colors group"
              >
                <X className="w-1.5 h-1.5 text-rose-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                aria-label="Minimize terminal"
                className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center transition-colors group"
              >
                <Minus className="w-1.5 h-1.5 text-amber-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => setZoomLevel((prev) => (prev === 'max' ? 'normal' : 'max'))}
                aria-label="Toggle full screen"
                className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 flex items-center justify-center transition-colors group"
              >
                <Maximize2 className="w-1.5 h-1.5 text-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Window title */}
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <Terminal className="w-3 h-3 text-indigo-400" />
              <span>guest@portfolio:~</span>
            </div>

            {/* Right actions: Zoom Button, Clear, Close */}
            <div className="flex items-center gap-1.5 text-slate-400">
              {/* Zoom Button */}
              <button
                onClick={toggleZoom}
                title={`Zoom Chat Size (Current: ${zoomLevel === 'normal' ? '1x' : zoomLevel === 'zoomed' ? '1.4x' : 'Full'})`}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] font-mono text-indigo-300 hover:text-white transition-colors border border-white/10"
              >
                {zoomLevel === 'max' ? (
                  <ZoomOut className="w-3 h-3 text-cyan-400" />
                ) : (
                  <ZoomIn className="w-3 h-3 text-cyan-400" />
                )}
                <span>{zoomLevel === 'normal' ? 'Zoom' : zoomLevel === 'zoomed' ? '1.4x' : 'Max'}</span>
              </button>

              <button
                onClick={() => executeCommand('clear')}
                title="Clear screen (clear)"
                className="p-1 hover:text-slate-200 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1 hover:text-slate-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick command buttons pill bar */}
          <div
            className="flex items-center gap-1 px-2.5 py-1.5 border-b overflow-x-auto no-scrollbar select-none"
            style={{
              borderColor: isGreenTheme ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)',
              background: 'rgba(0, 0, 0, 0.25)',
            }}
          >
            <span className="text-[9px] font-mono text-slate-400 mr-1 flex-shrink-0 flex items-center gap-1">
              <Sparkles className="w-2 h-2 text-indigo-400" /> Quick:
            </span>
            {QUICK_COMMANDS.map((cmd) => (
              <button
                key={cmd}
                onClick={() => executeCommand(cmd)}
                className="flex-shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded transition-all duration-150 hover:scale-105 active:scale-95"
                style={{
                  background: isGreenTheme ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                  border: isGreenTheme ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(129, 140, 248, 0.22)',
                  color: isGreenTheme ? '#6EE7B7' : '#C7D2FE',
                }}
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Terminal Screen Body / History */}
          <div
            onClick={() => inputRef.current?.focus()}
            className={`flex-1 overflow-y-auto p-2.5 space-y-2 font-mono cursor-text ${
              zoomLevel === 'zoomed' ? 'text-xs' : zoomLevel === 'max' ? 'text-xs sm:text-sm' : 'text-[11px]'
            }`}
            style={{
              color: isGreenTheme ? '#6EE7B7' : '#E2E8F0',
            }}
          >
            {history.map((item) => (
              <div key={item.id} className="space-y-0.5">
                {item.type === 'command' && (
                  <div className="flex items-start gap-1 text-slate-300 text-[10px]">
                    <span className="text-emerald-400 select-none">guest</span>
                    <span className="text-slate-400 select-none">:</span>
                    <span className="text-indigo-400 select-none">~</span>
                    <span className="text-slate-400 select-none">$</span>
                    <span className="font-semibold text-white ml-0.5">{item.content}</span>
                    <span className="ml-auto text-[9px] text-slate-400 select-none">
                      {item.timestamp}
                    </span>
                  </div>
                )}

                {item.type === 'response' && (
                  <div className="pl-2 border-l border-indigo-500/40 py-0.5">
                    {item.content}
                  </div>
                )}

                {item.type === 'error' && (
                  <div className="pl-2 border-l border-rose-500/50 py-0.5">
                    {item.content}
                  </div>
                )}

                {item.type === 'system' && (
                  <div className="pb-0.5">{item.content}</div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Compact Input Prompt Footer */}
          <form
            onSubmit={handleFormSubmit}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border-t rounded-b-2xl"
            style={{
              borderColor: isGreenTheme ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              background: 'rgba(0, 0, 0, 0.35)',
            }}
          >
            <div className="flex items-center gap-0.5 text-[10px] font-mono select-none flex-shrink-0">
              <span className="text-emerald-400 font-medium">guest</span>
              <span className="text-slate-400">:</span>
              <span className="text-indigo-400">~</span>
              <span className="text-slate-400">$</span>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command or question..."
              className="flex-1 bg-transparent border-none outline-none font-mono text-[11px] text-white placeholder-slate-400 min-w-0"
              autoComplete="off"
              spellCheck="false"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              aria-label="Send command"
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors flex-shrink-0"
            >
              <CornerDownLeft className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
