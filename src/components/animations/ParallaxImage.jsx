import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxImage = ({
  src,
  alt = '',
  speed = 0.5, // Parallax speed multiplier
  scale = 1.2, // Initial scale for smooth parallax
  className = '',
  containerClassName = '',
  overlay = false,
  overlayColor = 'rgba(0,0,0,0.3)',
  direction = 'vertical' // 'vertical', 'horizontal', 'both'
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;

    if (!container || !image) return;

    // Set initial scale
    gsap.set(image, {
      scale: scale
    });

    // Calculate movement based on direction
    const getAnimationProps = () => {
      const props = {};

      if (direction === 'vertical' || direction === 'both') {
        props.y = `${-100 * speed}%`;
      }

      if (direction === 'horizontal' || direction === 'both') {
        props.x = `${-50 * speed}%`;
      }

      return props;
    };

    // Create parallax animation
    gsap.to(image, {
      ...getAnimationProps(),
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });

    // Optional: Add reveal animation on first view
    gsap.from(container, {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === container) {
          trigger.kill();
        }
      });
    };
  }, [speed, scale, direction]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${containerClassName}`}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
      />
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: overlayColor }}
        />
      )}
    </div>
  );
};

ParallaxImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  speed: PropTypes.number,
  scale: PropTypes.number,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  overlay: PropTypes.bool,
  overlayColor: PropTypes.string,
  direction: PropTypes.oneOf(['vertical', 'horizontal', 'both'])
};

export default ParallaxImage;
