import { useEffect } from 'react';

export default function ScrollAnimations() {
  useEffect(() => {
  let rafId: number;

    const handleScroll = () => {
  const scrollY = window.scrollY;

      const elements = document.querySelectorAll('[data-scroll-reveal]');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementMid = rect.top + rect.height / 2;
        const isInView = elementMid < windowHeight && elementMid > 0;

        if (isInView) {
          element.classList.add('in-view');
        }
      });

      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-parallax') || '0.5');
        const yPos = -(scrollY * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
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
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    magneticElements.forEach((element) => {
      const el = element as HTMLElement;

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const maxDistance = 20;
        const distance = Math.sqrt(x * x + y * y);
        const strength = Math.min(distance / 100, 1);

        const moveX = (x / rect.width) * maxDistance * strength;
        const moveY = (y / rect.height) * maxDistance * strength;

        el.style.transform = `translate(${moveX}px, ${moveY}px)`;
      };

      const handleMouseLeave = () => {
        el.style.transform = 'translate(0, 0)';
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return null;
}
