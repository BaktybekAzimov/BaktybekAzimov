import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ContactCTA = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Slide up reveal
      gsap.from('.cta-content', {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      // Buttons stagger
      gsap.from('.cta-button', {
        opacity: 0,
        y: 30,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.buttons-row',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-32 h-32 border-2 border-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10 cta-content text-center text-white">
        {/* Heading */}
        <h2 className="font-primary text-h1 mb-6 drop-shadow-lg">
          Готовы начать сотрудничество?
        </h2>

        {/* Subtitle */}
        <p className="text-body-large mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
          Свяжитесь с нами любым удобным способом — мы всегда на связи и готовы ответить на ваши вопросы.
          Наши менеджеры помогут подобрать оптимальные условия сотрудничества.
        </p>

        {/* Buttons Row */}
        <div className="buttons-row flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* WhatsApp */}
          <a
            href="https://wa.me/996555123456"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button bg-white text-primary-blue px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            <span>WhatsApp</span>
          </a>

          {/* Telegram */}
          <a
            href="https://t.me/kelechek_official"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button bg-white text-primary-blue px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            <span>Telegram</span>
          </a>

          {/* Phone */}
          <a
            href="tel:+996372251234"
            className="cta-button bg-white text-primary-blue px-8 py-4 rounded-full font-semibold text-lg flex items-center space-x-3 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
          >
            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>Позвонить</span>
          </a>
        </div>

        {/* Additional info */}
        <p className="mt-12 text-body text-white/80">
          📞 +996 (3722) 5-12-34 | 📧 info@kelechek.kg
          <br />
          <span className="text-small">
            Пн-Пт: 9:00-18:00 | Сб: 9:00-14:00
          </span>
        </p>
      </div>
    </section>
  );
};

export default ContactCTA;
