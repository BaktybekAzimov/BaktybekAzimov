import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import NumberCounter from '../common/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

const ExportMap = () => {
  const [activeCountry, setActiveCountry] = useState(null);
  const sectionRef = useRef(null);

  const countries = [
    { id: 'russia', name: 'Россия', outlets: 450, color: '#1a4d7d' },
    { id: 'kazakhstan', name: 'Казахстан', outlets: 280, color: '#00a8cc' },
    { id: 'uzbekistan', name: 'Узбекистан', outlets: 150, color: '#1a4d7d' },
    { id: 'tajikistan', name: 'Таджикистан', outlets: 90, color: '#00a8cc' },
    { id: 'turkmenistan', name: 'Туркменистан', outlets: 40, color: '#1a4d7d' },
    { id: 'azerbaijan', name: 'Азербайджан', outlets: 35, color: '#00a8cc' },
    { id: 'uae', name: 'ОАЭ', outlets: 25, color: '#1a4d7d' },
    { id: 'qatar', name: 'Катар', outlets: 15, color: '#00a8cc' },
    { id: 'turkey', name: 'Турция', outlets: 12, color: '#1a4d7d' },
    { id: 'georgia', name: 'Грузия', outlets: 10, color: '#00a8cc' },
    { id: 'armenia', name: 'Армения', outlets: 8, color: '#1a4d7d' },
    { id: 'mongolia', name: 'Монголия', outlets: 5, color: '#00a8cc' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Countries appear one by one
      gsap.from('.country-item', {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });

      // Stats reveal
      gsap.from('.stat-counter', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.stats-bar',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-cyan rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="section-badge">Международное присутствие</span>
          </div>
          <h2 className="font-primary text-h1 text-dark-navy mb-6">
            Келечек экспортируется в 12 стран
          </h2>
          <p className="text-body-large text-text-secondary max-w-3xl mx-auto">
            Наша продукция завоевала доверие потребителей по всему миру.
            География поставок постоянно расширяется.
          </p>
        </div>

        {/* Countries Grid (simplified map representation) */}
        <div className="mb-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {countries.map((country, index) => (
              <div
                key={country.id}
                className="country-item glass-card p-6 cursor-pointer hover:shadow-xl transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.05}s` }}
                onMouseEnter={() => setActiveCountry(country)}
                onMouseLeave={() => setActiveCountry(null)}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Country flag placeholder (можно заменить на реальные флаги) */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center font-primary text-2xl text-white shadow-lg group-hover:scale-110 transition-transform"
                    style={{ background: country.color }}
                  >
                    {country.name.charAt(0)}
                  </div>

                  {/* Country name */}
                  <h3 className="font-primary text-xl text-dark-navy group-hover:text-primary-cyan transition-colors">
                    {country.name}
                  </h3>

                  {/* Outlets count */}
                  <div className="text-body text-text-secondary">
                    <span className="font-semibold text-primary-blue">{country.outlets}+</span>
                    <br />
                    <span className="text-small">точек продаж</span>
                  </div>

                  {/* Animated indicator */}
                  <div className="w-2 h-2 rounded-full bg-primary-cyan group-hover:scale-150 transition-transform animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Active country tooltip */}
          {activeCountry && (
            <div className="mt-8 p-6 bg-gradient-primary text-white rounded-xl text-center shadow-2xl animate-scale-in">
              <h4 className="font-primary text-3xl mb-2">{activeCountry.name}</h4>
              <p className="text-body-large">
                <strong className="text-5xl font-bold">{activeCountry.outlets}+</strong>
                <br />
                точек продаж
              </p>
            </div>
          )}
        </div>

        {/* Stats Bar */}
        <div className="stats-bar grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="stat-counter text-center p-8 bg-gradient-ice rounded-2xl shadow-lg">
            <div className="font-primary text-5xl text-primary-blue mb-3">
              <NumberCounter end={12} suffix="" />
            </div>
            <div className="text-body text-text-secondary font-semibold">
              Стран мира
            </div>
          </div>

          <div className="stat-counter text-center p-8 bg-gradient-ice rounded-2xl shadow-lg">
            <div className="font-primary text-5xl text-primary-cyan mb-3">
              <NumberCounter end={1000} suffix="+" />
            </div>
            <div className="text-body text-text-secondary font-semibold">
              Точек продаж
            </div>
          </div>

          <div className="stat-counter text-center p-8 bg-gradient-ice rounded-2xl shadow-lg">
            <div className="font-primary text-5xl text-primary-blue mb-3">
              <NumberCounter end={25} suffix="%" />
            </div>
            <div className="text-body text-text-secondary font-semibold">
              Рост экспорта ежегодно
            </div>
          </div>
        </div>

        {/* Interactive world map SVG placeholder */}
        <div className="mt-16 text-center opacity-30">
          <svg viewBox="0 0 800 400" className="w-full max-w-4xl mx-auto">
            {/* Simplified world map outline */}
            <text x="400" y="200" textAnchor="middle" className="font-primary text-6xl fill-primary-blue/20">
              [WORLD MAP]
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ExportMap;
