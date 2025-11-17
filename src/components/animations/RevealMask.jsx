import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RevealMask = ({
  children,
  direction = 'up', // 'up', 'down', 'left', 'right', 'center'
  duration = 1.2,
  delay = 0,
  className = '',
  stagger = false,
  staggerAmount = 0.1
}) => {
  const containerRef = useRef(null);
  const maskRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const mask = maskRef.current;

    if (!container || !mask) return;

    // Set initial mask position based on direction
    const getInitialClipPath = () => {
      switch (direction) {
        case 'up':
          return 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';
        case 'down':
          return 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
        case 'left':
          return 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)';
        case 'right':
          return 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)';
        case 'center':
          return 'circle(0% at 50% 50%)';
        default:
          return 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)';
      }
    };

    const getFinalClipPath = () => {
      switch (direction) {
        case 'center':
          return 'circle(150% at 50% 50%)';
        default:
          return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
      }
    };

    gsap.set(mask, {
      clipPath: getInitialClipPath()
    });

    // Create animation
    const elements = stagger ? gsap.utils.toArray(mask.children) : [mask];

    elements.forEach((element, index) => {
      gsap.to(element, {
        clipPath: getFinalClipPath(),
        duration: duration,
        delay: delay + (stagger ? index * staggerAmount : 0),
        ease: 'power4.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [direction, duration, delay, stagger, staggerAmount]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={maskRef} className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default RevealMask;
