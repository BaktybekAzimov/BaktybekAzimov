import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OriginStory = () => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background effect
      gsap.to(bgRef.current, {
        y: 200,
        scale: 1.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Content fade in
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Animated path drawing
      const path = document.querySelector('.water-path');
      if (path) {
        const pathLength = path.getTotalLength();

        gsap.set(path, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        });

        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.path-container',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen min-h-[600px] overflow-hidden flex items-center">
      {/* Parallax Background */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-gradient-to-br from-dark-navy via-primary-blue to-primary-cyan"
        style={{ height: '120%', top: '-10%' }}
      >
        {/* Animated mountain scene */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {/* Mountain ranges */}
          <div className="absolute bottom-0 left-0 right-0 h-2/3 flex items-end justify-around text-white/20">
            <div className="text-[200px] leading-none translate-y-20">🏔️</div>
            <div className="text-[250px] leading-none translate-y-16">⛰️</div>
            <div className="text-[180px] leading-none translate-y-24">🏔️</div>
            <div className="text-[220px] leading-none translate-y-20">⛰️</div>
          </div>

          {/* Snow/ice effect */}
          <div className="absolute top-1/4 left-1/4 text-8xl animate-pulse opacity-30">❄️</div>
          <div className="absolute top-1/3 right-1/4 text-7xl animate-pulse opacity-20" style={{ animationDelay: '1s' }}>❄️</div>
          <div className="absolute bottom-1/3 left-1/3 text-6xl animate-pulse opacity-25" style={{ animationDelay: '0.5s' }}>❄️</div>

          {/* Water drops flowing */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-6xl animate-bounce">💧</div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-overlay" />

      {/* Animated mesh */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div ref={contentRef} className="container-custom relative z-10 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-primary text-h1 mb-8 text-shadow-lg">
            Путь из высокогорья Тянь-Шаня
          </h2>

          <div className="space-y-6 text-body-large leading-relaxed">
            <p>
              Каждая капля воды <strong className="text-primary-cyan">«Келечек»</strong> начинает свой путь
              высоко в горах Тянь-Шаня. Талая вода ледников просачивается сквозь многометровые слои горных
              пород, проходя естественную фильтрацию в течение десятилетий.
            </p>

            <p className="text-accent-ice">
              На глубине более <strong>100 метров</strong> вода обогащается уникальным комплексом минералов —
              результатом тысячелетий геологических процессов. Месторождение №27, из которого мы добываем воду,
              известно своими целебными свойствами с древних времен.
            </p>

            <p>
              Мы бережно извлекаем эту природную воду, сохраняя все ее полезные свойства.
              От источника до вашего стола — под строгим контролем качества на каждом этапе.
            </p>
          </div>

          {/* Interactive Path Visualization */}
          <div className="path-container mt-16 relative">
            <svg
              viewBox="0 0 800 300"
              className="w-full h-auto max-w-3xl mx-auto"
              style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}
            >
              {/* Animated water path */}
              <path
                className="water-path"
                d="M 50,50 Q 200,20 350,80 T 650,100 L 750,250"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#e8f4f8', stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: '#00a8cc', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1a4d7d', stopOpacity: 1 }} />
                </linearGradient>
              </defs>

              {/* Key points */}
              <circle cx="50" cy="50" r="8" fill="#e8f4f8" className="animate-pulse">
                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x="50" y="30" fill="white" fontSize="14" textAnchor="middle" className="font-secondary">
                Ледник
              </text>

              <circle cx="350" cy="80" r="8" fill="#00a8cc" className="animate-pulse">
                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <text x="350" y="60" fill="white" fontSize="14" textAnchor="middle" className="font-secondary">
                Фильтрация
              </text>

              <circle cx="650" cy="100" r="8" fill="#1a4d7d" className="animate-pulse">
                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" begin="1s" />
              </circle>
              <text x="650" y="80" fill="white" fontSize="14" textAnchor="middle" className="font-secondary">
                Месторождение №27
              </text>

              <circle cx="750" cy="250" r="8" fill="#00a8cc" className="animate-pulse">
                <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" begin="1.5s" />
              </circle>
              <text x="750" y="280" fill="white" fontSize="14" textAnchor="middle" className="font-secondary">
                Розлив
              </text>
            </svg>

            <p className="text-small text-accent-ice mt-6 italic">
              Путь воды от ледников Тянь-Шаня до вашего дома
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default OriginStory;
