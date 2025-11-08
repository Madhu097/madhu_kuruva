import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const latestPosition = useRef({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      frameRef.current = null;
      const { x, y } = latestPosition.current;
      const baseTransform = `translate3d(${x}px, ${y}px, 0)`;

      if (outerRef.current) {
        outerRef.current.style.transform = `${baseTransform} translate3d(-50%, -50%, 0)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform = `${baseTransform} translate3d(-50%, -50%, 0)`;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      latestPosition.current = { x: event.clientX, y: event.clientY };
      if (!isVisible) {
        setIsVisible(true);
      }

      if (frameRef.current == null) {
        frameRef.current = requestAnimationFrame(updatePosition);
      }
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('a, button, [data-magnetic]')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches('a, button, [data-magnetic]')) {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div
        ref={outerRef}
        className={`fixed pointer-events-none z-[9999] mix-blend-difference transition-transform duration-150 ease-out ${
          isHovering ? 'scale-125' : 'scale-100'
        }`}
        style={{ willChange: 'transform' }}
      >
        <div className="w-8 h-8 border-2 border-cyan-400 rounded-full" />
      </div>
      <div
        ref={innerRef}
        className="fixed pointer-events-none z-[9998] transition-transform duration-100 ease-out"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`w-2 h-2 bg-cyan-400 rounded-full transition-transform duration-150 ${
            isHovering ? 'scale-150' : 'scale-100'
          }`}
        />
      </div>
    </>
  );
}
