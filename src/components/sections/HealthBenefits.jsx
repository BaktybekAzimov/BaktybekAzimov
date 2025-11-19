import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HealthBenefits = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Benefit cards reveal with stagger - simplified to not hide content
      gsap.from('.benefit-card', {
        y: 50,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

      // Icon animation on scroll in view
      gsap.from('.benefit-icon', {
        scale: 0.8,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const benefits = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: 'Здоровье ЖКТ',
      description: 'Минеральная вода Жалал-Абад 27 эффективна при переедании, успешно лечит изжогу и стимулирует обмен веществ. Показана при заболеваниях желудочно-кишечного тракта, гастритах, язвенной болезни.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Минерализация 💪',
      description: 'Кальций помогает сохранять подвижность и тонус. Он ответственен за крепость костей и суставов, кровообращение и объем мышечной ткани. Более 30 незаменимых минеральных веществ в составе.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      title: 'Энергия ❤️',
      description: 'Магний участвует в регуляции артериального давления, сердечного ритма и уровня сахара в крови. Он помогает избавиться от бессонницы, сонливости и мышечных судорог.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      ),
      title: 'Натуральный состав',
      description: 'Природное происхождение воды гарантирует отсутствие вредных примесей и химических добавок. Вода обогащается минералами естественным путем, проходя через горные породы.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
      title: 'Водно-солевой баланс 💧',
      description: 'Натрий и калий регулируют водно-солевой баланс и уровень кислотности, помогают переносить питательные вещества в клетки организма и выводить из них продукты метаболизма.'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
      title: 'Снижение веса',
      description: 'Стимулирует обмен веществ, благодаря чему помогает терять лишние килограммы естественным путём. Прекрасно утоляет жажду и поддерживает водный баланс при активном образе жизни.'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-accent-ice relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-cyan/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-primary-blue/10 rounded-full blur-[80px]" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="section-badge">Лечебные свойства</span>
          </div>
          <h2 className="font-primary text-h1 text-dark-navy mb-6">
            Более 30 незаменимых минеральных веществ
          </h2>
          <p className="text-body-large text-text-secondary max-w-3xl mx-auto">
            В составе Жалал-Абад 27 более 30 незаменимых для организма минеральных веществ.
            Баланс этих веществ способствует правильной работе всех систем организма.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="benefit-card glass-card p-8 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="benefit-icon w-20 h-20 bg-gradient-to-br from-primary-blue to-primary-cyan rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <div className="text-white">
                  {benefit.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="font-primary text-h3 text-dark-navy text-center mb-4">
                {benefit.title}
              </h3>
              <p className="text-body text-text-secondary text-center leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-body-large text-primary-blue font-semibold mb-6">
            Вот почему полезно разнообразить свой дневной рацион водой Жалал-Абад 27!
          </p>
          <button className="btn-primary inline-flex items-center space-x-2 hover:scale-105 transition-transform">
            <span>Сертификаты и исследования</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HealthBenefits;
