import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function MagneticButton({
  children,
  className = '',
  onClick,
  strength = 0.5, // магнитная сила (0-1)
  ...props
}) {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = button.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Calculate distance from cursor to button center
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Magnetic effect radius
      const magneticRadius = 150;

      if (distance < magneticRadius) {
        const power = (magneticRadius - distance) / magneticRadius;
        const moveX = deltaX * power * strength;
        const moveY = deltaY * power * strength;

        gsap.to(button, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      className={`relative overflow-hidden ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Ripple effect on hover */}
      <span className="absolute inset-0 overflow-hidden">
        <span
          className={`absolute inset-0 bg-white/20 rounded-full transition-transform duration-700 ${
            isHovered ? 'scale-150' : 'scale-0'
          }`}
          style={{
            transformOrigin: 'center',
          }}
        />
      </span>

      {/* Content */}
      <span className="relative z-10">{children}</span>

      {/* Shine effect */}
      <span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
          transition: 'transform 0.6s ease'
        }}
      />
    </button>
  );
}
