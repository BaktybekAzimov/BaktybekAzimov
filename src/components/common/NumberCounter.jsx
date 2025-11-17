import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NumberCounter = ({
  end,
  suffix = '',
  prefix = '',
  label,
  duration = 2,
  className = ''
}) => {
  const numberRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = numberRef.current;
    const obj = { value: 0 };

    const animation = gsap.to(obj, {
      value: end,
      duration: duration,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => {
        setCount(Math.round(obj.value));
      },
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    return () => {
      animation.kill();
    };
  }, [end, duration]);

  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div
      ref={numberRef}
      className={`text-center ${className}`}
    >
      <div className="font-primary text-6xl text-kelechek-primary mb-2">
        {prefix}{formatNumber(count)}{suffix}
      </div>
      {label && (
        <div className="font-secondary text-lg text-gray-600">
          {label}
        </div>
      )}
    </div>
  );
};

export default NumberCounter;
