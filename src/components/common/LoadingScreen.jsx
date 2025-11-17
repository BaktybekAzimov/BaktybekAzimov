import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const bottleRef = useRef(null);
  const waterRef = useRef(null);
  const textRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // When loading complete, animate out
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      tl.to(waterRef.current, {
        height: '100%',
        duration: 0.5,
        ease: 'power2.inOut'
      })
      .to(textRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.3
      }, '-=0.2')
      .to(bottleRef.current, {
        scale: 1.2,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
      }, '-=0.2')
      .to(screenRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, '-=0.3');
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={screenRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-gradient-to-br from-dark-navy via-primary-blue to-primary-cyan"
      style={{ pointerEvents: progress >= 100 ? 'none' : 'auto' }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Bottle container */}
        <div
          ref={bottleRef}
          className="relative w-32 h-64 mb-8"
        >
          {/* Bottle outline */}
          <svg
            viewBox="0 0 100 200"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 0 20px rgba(0, 168, 204, 0.5))' }}
          >
            {/* Bottle body */}
            <path
              d="M 30 50 L 30 170 Q 30 180 35 185 L 65 185 Q 70 180 70 170 L 70 50 Q 70 45 65 40 L 35 40 Q 30 45 30 50"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.8"
            />
            {/* Bottle neck */}
            <path
              d="M 40 40 L 40 20 Q 40 10 45 10 L 55 10 Q 60 10 60 20 L 60 40"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.8"
            />
            {/* Cap */}
            <rect
              x="42"
              y="5"
              width="16"
              height="5"
              rx="2"
              fill="white"
              opacity="0.9"
            />
          </svg>

          {/* Water fill */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 overflow-hidden">
            <div
              ref={waterRef}
              className="w-full bg-gradient-to-t from-primary-cyan to-primary-blue relative"
              style={{
                height: `${progress}%`,
                transition: 'height 0.2s ease-out'
              }}
            >
              {/* Wave effect on top of water */}
              <div className="absolute top-0 left-0 right-0 h-4">
                <svg
                  viewBox="0 0 100 10"
                  className="w-full h-full"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M 0 5 Q 25 0 50 5 T 100 5 L 100 10 L 0 10 Z"
                    fill="rgba(255, 255, 255, 0.3)"
                  >
                    <animate
                      attributeName="d"
                      values="M 0 5 Q 25 0 50 5 T 100 5 L 100 10 L 0 10 Z;
                              M 0 5 Q 25 10 50 5 T 100 5 L 100 10 L 0 10 Z;
                              M 0 5 Q 25 0 50 5 T 100 5 L 100 10 L 0 10 Z"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>
              </div>

              {/* Bubbles inside water */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/50 rounded-full animate-ping"
                  style={{
                    left: `${20 + i * 15}%`,
                    bottom: `${i * 10}%`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '2s'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Number 27 label */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-primary text-5xl text-white opacity-30 pointer-events-none">
            27
          </div>
        </div>

        {/* Loading text and progress */}
        <div ref={textRef} className="text-center">
          <h2 className="font-primary text-4xl text-white mb-4 tracking-wider">
            KELECHEK
          </h2>
          <div className="font-secondary text-xl text-white/80 mb-6">
            Загрузка...
          </div>
          <div className="text-5xl font-bold text-white">
            {Math.round(progress)}%
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-white/20 rounded-full mt-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-cyan to-white transition-all duration-200 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-primary-cyan/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
