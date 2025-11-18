import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from '../animations/SplitText';
// import Bottle3D from '../3d/Bottle3D';
import { GlitchText } from '../animations/TextMorph';

gsap.registerPlugin(ScrollTrigger);

const PremiumHero = () => {
  const heroRef = useRef(null);
  const bottleRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero timeline
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Initial animations
      tl.from(bottleRef.current, {
        scale: 0.5,
        y: 200,
        opacity: 0,
        duration: 1.5,
        ease: 'power4.out'
      }, 0.5);

      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 1.5
      }, 0);

      // Parallax scroll effect
      gsap.to(bottleRef.current, {
        y: 300,
        scale: 1.2,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Fade out on scroll
      gsap.to('.hero-content', {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1
        }
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Overlay fade in */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black z-50 pointer-events-none"
      />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-navy via-primary-blue to-primary-cyan opacity-70" />

      {/* Animated mesh gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-blue rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content */}
      <div className="hero-content relative z-10 h-full flex flex-col items-center justify-center text-white">
        <div className="text-center max-w-6xl mx-auto px-4">
          {/* Animated text */}
          <GlitchText className="font-primary text-[clamp(60px,8vw,180px)] leading-none mb-6 block">
            <SplitText
              animation="fadeUp"
              stagger={0.03}
              trigger={false}
              delay={0.8}
              className="inline-block"
            >
              KELECHEK
            </SplitText>
          </GlitchText>

          <SplitText
            animation="fadeUp"
            stagger={0.02}
            trigger={false}
            delay={1.2}
            className="font-primary text-[clamp(40px,6vw,120px)] leading-none mb-8 text-primary-cyan"
          >
            №27
          </SplitText>

          <div className="overflow-hidden">
            <p
              className="font-secondary text-xl md:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{
                animation: 'slideUp 1s ease-out 1.5s backwards'
              }}
            >
              Лечебно-столовая минеральная вода премиум класса
              <br />
              <span className="text-gray-400">
                Из источника в горах Кыргызстана с 1991 года
              </span>
            </p>
          </div>

          {/* Scroll indicator */}
          <div
            className="mt-16"
            style={{
              animation: 'fadeIn 1s ease-out 2s backwards'
            }}
          >
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-sm mb-2 text-gray-400">Прокрутите</span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Bottle placeholder - React Three Fiber has compatibility issues */}
      <div
        ref={bottleRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[400px] h-[600px] md:w-[500px] md:h-[700px]"
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="animate-pulse font-primary text-[200px] text-primary-cyan"
            style={{
              textShadow: '0 0 60px rgba(0, 168, 204, 0.8), 0 0 100px rgba(0, 168, 204, 0.6), 0 0 140px rgba(0, 168, 204, 0.4)',
              animation: 'pulse 2s ease-in-out infinite'
            }}
          >
            27
          </div>
        </div>
      </div>

      {/* Light rays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 w-1 bg-gradient-to-b from-white to-transparent"
            style={{
              height: '100%',
              transform: `translateX(-50%) rotate(${i * 36}deg)`,
              transformOrigin: 'top center',
              opacity: 0.1 - i * 0.01,
              animation: `pulse ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shine {
          0%, 100% {
            opacity: 0.3;
            transform: translateX(-100%);
          }
          50% {
            opacity: 0.6;
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
};

export default PremiumHero;
