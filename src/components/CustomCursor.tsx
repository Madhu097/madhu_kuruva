import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch / small screens
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 1024) {
      document.body.style.cursor = 'auto';
      return;
    }

    document.body.style.cursor = 'none';

    const mouse  = { x: -200, y: -200 };
    const smooth = { x: -200, y: -200 };
    let   hovered  = false;
    let   rafId: number;

    // ── Direct DOM writes — zero React re-renders ─────────────────────────────
    const applyHover = (on: boolean) => {
      if (on === hovered) return;
      hovered = on;
      const outer = outerRef.current;
      if (!outer) return;
      if (on) {
        outer.style.width           = '56px';
        outer.style.height          = '56px';
        outer.style.marginLeft      = '-28px';
        outer.style.marginTop       = '-28px';
        outer.style.borderColor     = 'rgba(10,132,255,0.85)';
        outer.style.backgroundColor = 'rgba(10,132,255,0.08)';
      } else {
        outer.style.width           = '38px';
        outer.style.height          = '38px';
        outer.style.marginLeft      = '-19px';
        outer.style.marginTop       = '-19px';
        outer.style.borderColor     = 'rgba(10,132,255,0.40)';
        outer.style.backgroundColor = 'transparent';
      }
    };

    // ── rAF loop — smooth ring, instant dot ───────────────────────────────────
    const tick = () => {
      // Lerp the ring — fast enough to not feel sluggish
      smooth.x += (mouse.x - smooth.x) * 0.18;
      smooth.y += (mouse.y - smooth.y) * 0.18;

      outerRef.current!.style.transform = `translate3d(${smooth.x}px,${smooth.y}px,0)`;
      dotRef.current!.style.transform   = `translate3d(${mouse.x}px,${mouse.y}px,0)`;

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // ── Mouse events ──────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // Detect hover in the same handler — avoid expensive mouseover listener
      const el = e.target as HTMLElement;
      applyHover(!!el.closest('a, button, [role="button"], input, textarea, [data-magnetic]'));
    };

    window.addEventListener('mousemove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMove);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {/* Smooth-lagging ring */}
      <div
        ref={outerRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '38px', height: '38px',
          marginLeft: '-19px', marginTop: '-19px',
          borderRadius: '50%',
          border: '1px solid rgba(10,132,255,0.40)',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
        }}
      />
      {/* Instant dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '5px', height: '5px',
          marginLeft: '-2.5px', marginTop: '-2.5px',
          borderRadius: '50%',
          background: '#0A84FF',
          boxShadow: '0 0 6px rgba(10,132,255,0.9)',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
