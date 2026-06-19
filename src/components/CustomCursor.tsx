import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  
  const mouse = useRef({ x: -100, y: -100 });
  const pos = useRef({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device is touch or mobile-sized to disable cursor
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 1024;
    if (isTouchDevice || isSmallScreen) {
      setIsTouch(true);
      document.body.style.cursor = 'auto';
      return;
    }

    const mouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isSelectable = target.closest('a, button, [role="button"], input, textarea, [data-magnetic]');
      setIsHovered(!!isSelectable);
    };

    const updateCursor = () => {
      // Smooth following effect (Lerp)
      const speed = 0.15;
      pos.current.x += (mouse.current.x - pos.current.x) * speed;
      pos.current.y += (mouse.current.y - pos.current.y) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      
      // The inner dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }

      requestAnimationFrame(updateCursor);
    };

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleHover);
    const animationFrame = requestAnimationFrame(updateCursor);

    // Hide original cursor
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleHover);
      cancelAnimationFrame(animationFrame);
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (isTouch || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999]">
      {/* Lagging outer ring */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-10 h-10 -ml-5 -mt-5 rounded-full border border-accent/50 transition-[width,height,margin,border-color] duration-300 pointer-events-none"
        style={{ 
          width: isHovered ? '60px' : '40px',
          height: isHovered ? '60px' : '40px',
          marginLeft: isHovered ? '-30px' : '-20px',
          marginTop: isHovered ? '-30px' : '-20px',
          borderColor: isHovered ? 'rgba(10,132,255,0.8)' : 'rgba(10,132,255,0.4)',
          backgroundColor: isHovered ? 'rgba(10,132,255,0.1)' : 'transparent',
        }}
      />
      
      {/* Instant inner dot */}
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] bg-accent rounded-full z-10 pointer-events-none"
        style={{ 
          filter: 'drop-shadow(0 0 5px rgba(10,132,255,0.8))'
        }}
      >
        {/* Shimmer inside for extra premium feel */}
        {isHovered && <span className="absolute inset-0 bg-white rounded-full animate-ping opacity-50" />}
      </div>
    </div>
  );
}
