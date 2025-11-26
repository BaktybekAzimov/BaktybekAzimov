import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import SplitType from 'split-type';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SplitText = ({
  children,
  className = '',
  animation = 'fadeUp',
  stagger = 0.02,
  trigger = true,
  delay = 0
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: 'lines,words,chars',
      tagName: 'span'
    });

    // Wrap lines for better animation
    if (split.lines) {
      split.lines.forEach(line => {
        const wrapper = document.createElement('div');
        wrapper.style.overflow = 'hidden';
        line.parentNode.insertBefore(wrapper, line);
        wrapper.appendChild(line);
      });
    }

    const animationVariants = {
      fadeUp: {
        from: { opacity: 0, y: 100, rotationX: -90 },
        to: { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: 'power4.out' }
      },
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1, duration: 0.8, ease: 'power2.out' }
      },
      slideUp: {
        from: { y: '100%' },
        to: { y: '0%', duration: 1, ease: 'power4.out' }
      },
      reveal: {
        from: { yPercent: 100, opacity: 0 },
        to: { yPercent: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      }
    };

    const { from, to } = animationVariants[animation] || animationVariants.fadeUp;

    if (trigger) {
      gsap.from(split.chars || split.words, {
        ...from,
        stagger: stagger,
        delay: delay,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    } else {
      gsap.from(split.chars || split.words, {
        ...from,
        ...to,
        stagger: stagger,
        delay: delay
      });
    }

    return () => {
      split.revert();
    };
  }, [animation, stagger, trigger, delay]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
};

SplitText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  animation: PropTypes.oneOf(['fadeUp', 'fadeIn', 'slideUp', 'reveal']),
  stagger: PropTypes.number,
  trigger: PropTypes.bool,
  delay: PropTypes.number
};

export default SplitText;
