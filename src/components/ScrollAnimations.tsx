import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. High-Performance Scroll Reveal via IntersectionObserver (Zero layout thrashing) ──
    const hasRevealElements = document.querySelector('[data-scroll-reveal]') !== null;
    let revealObserver: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    if (hasRevealElements) {
      revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: '0px 0px -50px 0px',
          threshold: 0.1,
        }
      );

      const observeRevealElements = () => {
        document.querySelectorAll('[data-scroll-reveal]:not(.in-view)').forEach((el) => {
          revealObserver?.observe(el);
        });
      };

      observeRevealElements();

      // Re-check after lazy components load
      mutationObserver = new MutationObserver(() => {
        observeRevealElements();
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    // ── 2. Parallax Throttling via Passive rAF ──
    let rafId: number | null = null;
    let isTicking = false;

    const parallaxElements = Array.from(
      document.querySelectorAll('[data-parallax]')
    ) as HTMLElement[];

    const updateParallax = () => {
      if (prefersReducedMotion) {
        isTicking = false;
        return;
      }
      const scrollY = window.scrollY;
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-parallax') || '0.3');
        const yPos = -(scrollY * speed);
        element.style.transform = `translate3d(0, ${yPos.toFixed(1)}px, 0)`;
      });
      isTicking = false;
    };

    const onScroll = () => {
      if (!isTicking && parallaxElements.length > 0) {
        isTicking = true;
        rafId = requestAnimationFrame(updateParallax);
      }
    };

    if (parallaxElements.length > 0 && !prefersReducedMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // ── 3. Magnetic Hover Animation (Smooth & Lightweight) ──
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
      revealObserver?.disconnect();
      mutationObserver?.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      cleanupFns.forEach((fn) => fn());
    };
  }, []);

  return null;
}
