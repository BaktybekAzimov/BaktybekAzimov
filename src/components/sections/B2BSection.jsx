import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const B2BSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split reveal animation
      gsap.from('.b2b-left', {
        opacity: 0,
        x: -100,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });

      gsap.from('.b2b-right', {
        opacity: 0,
        x: 100,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      });

      // Benefits list stagger
      gsap.from('.benefit-item', {
        opacity: 0,
        x: -30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.benefits-list',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const benefits = [
    {
      icon: '💰',
      title: 'Конкурентные оптовые цены',
      description: 'Прямые поставки от производителя без посредников'
    },
    {
      icon: '🤝',
      title: 'Гибкие условия оплаты и поставки',
      description: 'Индивидуальный подход к каждому партнеру'
    },
    {
      icon: '📢',
      title: 'Маркетинговая поддержка',
      description: 'POS-материалы, рекламные акции, обучение персонала'
    },
    {
      icon: '🚚',
      title: 'Быстрая логистика',
      description: 'Своевременная доставка по всему Кыргызстану и СНГ'
    },
    {
      icon: '👨‍💼',
      title: 'Персональный менеджер',
      description: 'Постоянная поддержка и консультации'
    },
    {
      icon: '🎁',
      title: 'Регулярные промо-акции',
      description: 'Специальные предложения для дилеров'
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-off-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-primary-cyan/10 to-primary-blue/10 rounded-full blur-[120px]" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="b2b-left">
            <div className="inline-block mb-6">
              <span className="section-badge">Для бизнеса</span>
            </div>

            <h2 className="font-primary text-h1 text-dark-navy mb-6 leading-tight">
              Станьте нашим партнером
            </h2>

            <p className="text-body-large text-text-secondary mb-12 leading-relaxed">
              Предлагаем выгодное сотрудничество для оптовых покупателей, дистрибьюторов и ритейлеров.
              Работайте с лидером рынка минеральных вод Кыргызстана!
            </p>

            {/* Benefits List */}
            <div className="benefits-list space-y-4 mb-12">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="benefit-item flex items-start space-x-4 p-4 rounded-xl hover:bg-white transition-all duration-300 group"
                >
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-primary text-xl text-dark-navy mb-1 group-hover:text-primary-cyan transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-body text-text-secondary">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="btn-primary w-full md:w-auto text-lg px-12 py-4 group">
              <span className="flex items-center justify-center space-x-2">
                <span>Оставить заявку на сотрудничество</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>

          {/* Right Column - Contact Form / Visual */}
          <div className="b2b-right">
            <div className="glass-card p-8 md:p-12 shadow-2xl">
              <h3 className="font-primary text-h2 text-dark-navy mb-8 text-center">
                Форма обратной связи
              </h3>

              <form className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-body font-semibold text-dark-navy mb-2">
                    Ваше имя *
                  </label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    className="w-full px-6 py-4 rounded-full border-2 border-light-gray focus:border-primary-blue outline-none transition-colors bg-white"
                    required
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-body font-semibold text-dark-navy mb-2">
                    Компания
                  </label>
                  <input
                    type="text"
                    placeholder="ООО Торговый Дом"
                    className="w-full px-6 py-4 rounded-full border-2 border-light-gray focus:border-primary-blue outline-none transition-colors bg-white"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-body font-semibold text-dark-navy mb-2">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    placeholder="+996 XXX XXX XXX"
                    className="w-full px-6 py-4 rounded-full border-2 border-light-gray focus:border-primary-blue outline-none transition-colors bg-white"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-body font-semibold text-dark-navy mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-6 py-4 rounded-full border-2 border-light-gray focus:border-primary-blue outline-none transition-colors bg-white"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-body font-semibold text-dark-navy mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Расскажите о вашем бизнесе и интересах..."
                    className="w-full px-6 py-4 rounded-2xl border-2 border-light-gray focus:border-primary-blue outline-none transition-colors bg-white resize-none"
                    required
                  />
                </div>

                {/* Consent */}
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-2 border-light-gray text-primary-blue focus:ring-primary-blue"
                    required
                  />
                  <span className="text-small text-text-secondary">
                    Я согласен на обработку персональных данных и получение информационных рассылок
                  </span>
                </label>

                {/* Submit */}
                <button type="submit" className="btn-primary w-full text-lg py-4">
                  Отправить заявку
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default B2BSection;
