import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default function TextMorph({ children, className = '', type = 'words' }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    // Split text into characters/words
    const split = new SplitType(textRef.current, { types: type });
    const elements = type === 'chars' ? split.chars : split.words;

    if (!elements) return;

    // Create scroll-triggered animation
    gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 50,
        rotationX: -90,
        transformOrigin: 'top center',
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      }
    );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [children, type]);

  return (
    <div ref={textRef} className={className} style={{ perspective: '1000px' }}>
      {children}
    </div>
  );
}

// Glitch text effect
export function GlitchText({ children, className = '' }) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const glitchAnimation = () => {
      gsap.to(element, {
        textShadow: `
          ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00a8cc,
          ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #1a4d7d
        `,
        duration: 0.1,
        repeat: 3,
        yoyo: true,
        onComplete: () => {
          gsap.set(element, { textShadow: 'none' });
        }
      });
    };

    const interval = setInterval(glitchAnimation, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span ref={textRef} className={className} style={{ display: 'inline-block' }}>
      {children}
    </span>
  );
}

// Scramble text reveal
export function ScrambleText({ children, className = '' }) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    if (!element) return;

    const originalText = element.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let frame = 0;

    const scramble = () => {
      element.textContent = originalText
        .split('')
        .map((char, index) => {
          if (index < frame) {
            return originalText[index];
          }
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (frame >= originalText.length) {
        return;
      }

      frame += 1 / 3;
      requestAnimationFrame(scramble);
    };

    ScrollTrigger.create({
      trigger: element,
      start: 'top 80%',
      onEnter: () => {
        frame = 0;
        scramble();
      },
    });
  }, [children]);

  return (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );
}
