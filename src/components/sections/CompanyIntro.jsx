import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import NumberCounter from '../common/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

const CompanyIntro = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section reveal animation
      gsap.from('.intro-content', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      // Stats reveal with stagger
      gsap.from('.stat-item', {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: '.stats-grid',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });

      // Image parallax effect
      gsap.to(imageRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-off-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-ice rounded-full blur-[100px] opacity-30" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-cyan/10 rounded-full blur-[100px] opacity-20" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="intro-content">
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="section-badge">С 1991 года</span>
            </div>

            {/* Heading */}
            <h2 className="font-primary text-h1 text-dark-navy mb-8 leading-tight">
              30+ лет природной чистоты
            </h2>

            {/* Body Text */}
            <div className="space-y-6 text-text-secondary text-body-large mb-12">
              <p>
                <strong className="text-primary-blue">ЗАО «Келечек»</strong> — ведущий производитель
                премиальной минеральной воды в Кыргызстане. С 1991 года мы добываем воду из уникального
                месторождения №27 в высокогорье Жалал-Абада.
              </p>

              <p>
                Вода — это самая важная вещь на свете. Мы все состоим из воды, и вода — это жизнь.
              </p>

              <div className="pl-6 border-l-4 border-primary-cyan">
                <h3 className="font-primary text-h3 text-primary-blue mb-3">🏔️ НАША МИССИЯ</h3>
                <p className="text-body">
                  Мы стремимся предоставлять нашим клиентам продукт высочайшего качества, который
                  способствует их здоровью и благополучию. Наша миссия заключается в том, чтобы сделать
                  доступной для каждого чистую и полезную минеральную воду, заботясь о сохранении экологии
                  и природных ресурсов для будущих поколений.
                </p>
              </div>

              <div className="pl-6 border-l-4 border-primary-cyan">
                <h3 className="font-primary text-h3 text-primary-blue mb-3">💎 НАШИ ЦЕННОСТИ</h3>
                <ul className="space-y-3 text-body">
                  <li className="flex items-start">
                    <span className="text-primary-cyan mr-3 mt-1">•</span>
                    <span><strong>Качество</strong> – мы гарантируем, что каждый продукт соответствует самым строгим стандартам качества.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-cyan mr-3 mt-1">•</span>
                    <span><strong>Забота о клиентах</strong> – мы всегда учитываем потребности наших клиентов и стремимся обеспечить им максимальный комфорт.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-cyan mr-3 mt-1">•</span>
                    <span><strong>Ответственность</strong> – мы заботимся о нашем окружении и активно участвуем в инициативах по защите природы.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-cyan mr-3 mt-1">•</span>
                    <span><strong>Инновации</strong> – мы всегда находим новые пути улучшения наших продуктов и сервисов.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid grid grid-cols-2 gap-6">
              <div className="stat-item glass-card-dark p-6 rounded-xl">
                <NumberCounter
                  end={30}
                  suffix="+ лет"
                  label="На рынке"
                  className="text-primary-blue"
                />
              </div>
              <div className="stat-item glass-card-dark p-6 rounded-xl">
                <NumberCounter
                  end={12}
                  suffix=" стран"
                  label="Экспорта"
                  className="text-primary-cyan"
                />
              </div>
              <div className="stat-item glass-card-dark p-6 rounded-xl">
                <NumberCounter
                  end={15}
                  suffix="+"
                  label="Продуктов"
                  className="text-primary-blue"
                />
              </div>
              <div className="stat-item glass-card-dark p-6 rounded-xl">
                <div className="font-primary text-4xl text-primary-cyan mb-2">№27</div>
                <div className="text-small text-text-secondary">Месторождение</div>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-2xl">
            <div
              ref={imageRef}
              className="absolute inset-0 bg-gradient-to-br from-primary-blue via-primary-cyan to-accent-ice"
              style={{ height: '120%', top: '-10%' }}
            >
              {/* Mountain and factory illustration with emojis */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                {/* Mountains */}
                <div className="text-9xl mb-4 animate-pulse">🏔️</div>
                <div className="text-7xl -mt-12 ml-20">⛰️</div>
                <div className="text-6xl -mt-8 -ml-16">🏔️</div>

                {/* Factory below mountains */}
                <div className="text-8xl mt-8">🏭</div>

                {/* Water drops */}
                <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>💧</div>
                <div className="absolute top-1/3 right-1/3 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>💧</div>
                <div className="absolute bottom-1/3 left-1/3 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>💧</div>
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-overlay opacity-40" />

              {/* Decorative elements */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h4 className="font-primary text-2xl text-white mb-2">🏔️ Жалал-Абад</h4>
                <p className="text-white/80 text-small">
                  Источник чистейшей минеральной воды в сердце Кыргызстана
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyIntro;
