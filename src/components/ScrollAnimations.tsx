import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Magnetic Hover Animation (Smooth & Lightweight) ──
    const magneticElements = Array.from(
      document.querySelectorAll('[data-magnetic]')
    ) as HTMLElement[];

    const cleanupFns = magneticElements.map((el) => {
      let mRafId: number | null = null;
      let targetX = 0;
      let targetY = 0;

      const updatePosition = () => {
        mRafId = null;
        el.style.transform = `translate3d(${targetX.toFixed(1)}px, ${targetY.toFixed(1)}px, 0)`;
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (prefersReducedMotion) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const maxDistance = 16;
        const distance = Math.sqrt(x * x + y * y);
        const strength = Math.min(distance / 100, 1);

        targetX = (x / rect.width) * maxDistance * strength;
        targetY = (y / rect.height) * maxDistance * strength;

        if (mRafId === null) {
          mRafId = requestAnimationFrame(updatePosition);
        }
      };

      const handleMouseLeave = () => {
        targetX = 0;
        targetY = 0;
        if (mRafId === null) {
          el.style.transform = 'translate3d(0, 0, 0)';
        } else {
          cancelAnimationFrame(mRafId);
          mRafId = requestAnimationFrame(updatePosition);
        }
      };

      el.addEventListener('mousemove', handleMouseMove, { passive: true });
      el.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      return () => {
        if (mRafId !== null) cancelAnimationFrame(mRafId);
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}
