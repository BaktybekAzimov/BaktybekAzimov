import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FloatingElements = ({ count = 15, color = 'rgba(0, 168, 204, 0.1)' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('.floating-element');

    elements.forEach((el, index) => {
      // Random initial position
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;

      gsap.set(el, {
        left: `${startX}%`,
        top: `${startY}%`
      });

      // Continuous floating animation
      gsap.to(el, {
        y: `${-100 - Math.random() * 100}`,
        x: `${Math.random() * 100 - 50}`,
        rotation: Math.random() * 360,
        duration: 10 + Math.random() * 20,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.5
      });

      // Parallax on scroll
      gsap.to(el, {
        y: `-${50 + index * 10}%`,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1 + (index % 3) * 0.5
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [count]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(count)].map((_, i) => {
        const size = 20 + Math.random() * 100;
        const opacity = 0.05 + Math.random() * 0.15;
        const blur = Math.random() * 40 + 20;

        return (
          <div
            key={i}
            className="floating-element absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              opacity,
              filter: `blur(${blur}px)`,
              willChange: 'transform'
            }}
          />
        );
      })}
    </div>
  );
};

export default FloatingElements;
