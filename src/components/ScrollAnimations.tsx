import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    let rafId: number;
    const revealElements = Array.from(document.querySelectorAll('[data-scroll-reveal]'));
    const parallaxElements = Array.from(
      document.querySelectorAll('[data-parallax]')
    ) as HTMLElement[];

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      const scrollY = window.scrollY;

      revealElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementMid = rect.top + rect.height / 2;
        const isInView = elementMid < windowHeight && elementMid > 0;

        if (isInView) {
          element.classList.add('in-view');
        }
      });

      if (prefersReducedMotion) {
        return;
      }

      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-parallax') || '0.5');
        const yPos = -(scrollY * speed);
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return;
    }

    const magneticElements = Array.from(
      document.querySelectorAll('[data-magnetic]')
    ) as HTMLElement[];

    const cleanupFns = magneticElements.map((el) => {
      let rafId: number | null = null;
      let targetX = 0;
      let targetY = 0;

      const updatePosition = () => {
        rafId = null;
        el.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const maxDistance = 18;
        const distance = Math.sqrt(x * x + y * y);
        const strength = Math.min(distance / 100, 1);

        targetX = (x / rect.width) * maxDistance * strength;
        targetY = (y / rect.height) * maxDistance * strength;

        if (rafId == null) {
          rafId = requestAnimationFrame(updatePosition);
        }
      };

      const handleMouseLeave = () => {
        targetX = 0;
        targetY = 0;
        if (rafId == null) {
          el.style.transform = 'translate3d(0, 0, 0)';
        } else {
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(updatePosition);
        }
      };

      el.style.willChange = 'transform';
      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (rafId != null) {
          cancelAnimationFrame(rafId);
        }
        el.style.willChange = '';
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.style.transform = 'translate3d(0, 0, 0)';
      };
    });

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
