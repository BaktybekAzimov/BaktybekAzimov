import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function AdvancedCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Hide default cursor
    const style = document.createElement('style');
    style.innerHTML = '* { cursor: none !important; }';
    document.head.appendChild(style);

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    const mousePosition = { x: 0, y: 0 };
    const cursorPosition = { x: 0, y: 0 };
    const cursorSpeed = 0.15; // Lower = more delay

    // Update mouse position
    const handleMouseMove = (e) => {
      mousePosition.x = e.clientX;
      mousePosition.y = e.clientY;
    };

    // Animate cursor to follow mouse with delay
    const animate = () => {
      // Smooth cursor movement
      cursorPosition.x += (mousePosition.x - cursorPosition.x) * cursorSpeed;
      cursorPosition.y += (mousePosition.y - cursorPosition.y) * cursorSpeed;

      if (cursor) {
        cursor.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`;
      }

      if (cursorDot) {
        cursorDot.style.transform = `translate(${mousePosition.x}px, ${mousePosition.y}px)`;
      }

      requestAnimationFrame(animate);
    };

    // Detect hovering over links/buttons
    const handleMouseEnter = () => {
      setIsHoveringLink(true);
      gsap.to(cursor, {
        scale: 2,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      setIsHoveringLink(false);
      gsap.to(cursor, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    // Detect clicks
    const handleMouseDown = () => {
      setIsClicking(true);
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: 'power2.out'
      });
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      gsap.to(cursor, {
        scale: isHoveringLink ? 2 : 1,
        duration: 0.2,
        ease: 'power2.out'
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Add hover listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Start animation loop
    animate();

    return () => {
      // Remove style
      document.head.removeChild(style);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isHoveringLink]);

  return (
    <>
      {/* Main cursor circle */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      >
        <div
          className={`w-full h-full rounded-full border-2 transition-colors duration-300 ${
            isHoveringLink ? 'border-primary-cyan bg-primary-cyan/20' : 'border-white'
          }`}
          style={{
            boxShadow: isHoveringLink ? '0 0 20px rgba(0, 168, 204, 0.5)' : 'none'
          }}
        />
      </div>

      {/* Cursor dot (center) */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }}
      >
        <div
          className={`w-full h-full rounded-full transition-all duration-150 ${
            isClicking ? 'bg-primary-cyan scale-150' : 'bg-white'
          }`}
        />
      </div>
    </>
  );
}
