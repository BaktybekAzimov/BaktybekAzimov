import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Grid staggered reveal
      gsap.from('.cert-card', {
        opacity: 0,
        y: 60,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const certificates = [
    {
      id: 1,
      title: 'ISO 9001:2015',
      subtitle: 'Система менеджмента качества',
      description: 'Международный стандарт системы управления качеством',
      icon: '🏆'
    },
    {
      id: 2,
      title: 'ISO 22000:2018',
      subtitle: 'Безопасность пищевых продуктов',
      description: 'Стандарт управления безопасностью пищевой продукции',
      icon: '✅'
    },
    {
      id: 3,
      title: 'HACCP',
      subtitle: 'Анализ рисков',
      description: 'Критические контрольные точки производства',
      icon: '🔬'
    },
    {
      id: 4,
      title: 'Минздрав КР',
      subtitle: 'Лечебные свойства',
      description: 'Подтверждение целебных свойств воды',
      icon: '⚕️'
    },
    {
      id: 5,
      title: 'Halal',
      subtitle: 'Халяльная сертификация',
      description: 'Соответствие исламским стандартам',
      icon: '☪️'
    },
    {
      id: 6,
      title: 'Best Producer',
      subtitle: 'Лучший производитель 2023',
      description: 'Национальная премия качества Кыргызстана',
      icon: '🥇'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="section-badge">Качество подтверждено</span>
          </div>
          <h2 className="font-primary text-h1 text-dark-navy mb-6">
            Сертификаты и награды
          </h2>
          <p className="text-body-large text-text-secondary max-w-3xl mx-auto">
            Наша продукция соответствует самым строгим международным стандартам качества и безопасности.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="cert-card bg-white border-2 border-light-gray rounded-2xl p-8 hover:border-primary-cyan hover:shadow-xl transition-all duration-300 group cursor-pointer"
            >
              {/* Icon */}
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                {cert.icon}
              </div>

              {/* Title */}
              <h3 className="font-primary text-h3 text-dark-navy mb-2 group-hover:text-primary-cyan transition-colors">
                {cert.title}
              </h3>

              {/* Subtitle */}
              <p className="text-body font-semibold text-primary-blue mb-3">
                {cert.subtitle}
              </p>

              {/* Description */}
              <p className="text-body text-text-secondary leading-relaxed">
                {cert.description}
              </p>

              {/* View button */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-small text-primary-cyan font-semibold flex items-center space-x-2">
                  <span>Посмотреть сертификат</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center">
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Все наши сертификаты проходят регулярную проверку и обновление.
            Документы доступны по запросу.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
