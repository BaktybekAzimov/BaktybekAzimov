import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Button from '../components/ui/Button';
import NumberCounter from '../components/common/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const horizontalRef = useRef(null);
  const panelsRef = useRef([]);

  useEffect(() => {
    // Horizontal scrolling timeline
    const panels = panelsRef.current;
    const horizontalSection = horizontalRef.current;

    if (panels.length > 0 && horizontalSection) {
      const totalWidth = panels.reduce((acc, panel) => acc + panel.offsetWidth, 0);

      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalSection,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          end: () => `+=${totalWidth}`
        }
      });
    }

    // Fade up animations
    gsap.utils.toArray('.fade-up').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 80,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Stats counter animation
    gsap.utils.toArray('.stat-number').forEach((stat) => {
      ScrollTrigger.create({
        trigger: stat,
        start: 'top 80%',
        onEnter: () => {
          const target = parseInt(stat.getAttribute('data-value'));
          gsap.to(stat, {
            innerText: target,
            duration: 2.5,
            ease: 'power2.out',
            snap: { innerText: 1 },
            onUpdate: function() {
              stat.innerText = Math.ceil(stat.innerText);
            }
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const timeline = [
    {
      year: 1991,
      title: 'НАЧАЛО ИСТОРИИ',
      description: 'Основание ЗАО "КЕЛЕЧЕК" в городе Жалал-Абад. Открытие уникального источника минеральной воды №27',
      color: 'from-blue-900 to-blue-700',
      icon: '🏔️'
    },
    {
      year: 1995,
      title: 'ПЕРВАЯ СЕРТИФИКАЦИЯ',
      description: 'Получение официального сертификата лечебно-столовой воды. Признание целебных свойств источника №27',
      color: 'from-cyan-900 to-cyan-700',
      icon: '📜'
    },
    {
      year: 2000,
      title: 'МОДЕРНИЗАЦИЯ',
      description: 'Масштабное расширение и модернизация производственных мощностей. Внедрение современных технологий',
      color: 'from-teal-900 to-teal-700',
      icon: '🏭'
    },
    {
      year: 2005,
      title: 'МЕЖДУНАРОДНЫЙ РЫНОК',
      description: 'Первый экспорт в Казахстан. Начало международной экспансии бренда KELECHEK',
      color: 'from-green-900 to-green-700',
      icon: '🌍'
    },
    {
      year: 2010,
      title: 'НОВЫЕ БРЕНДЫ',
      description: 'Запуск премиальных линеек ADYGENE (ледниковая вода) и GIMALAI (артезианская вода)',
      color: 'from-emerald-900 to-emerald-700',
      icon: '💧'
    },
    {
      year: 2015,
      title: 'ISO 9001',
      description: 'Сертификация международного стандарта качества. Признание мировых экспертов',
      color: 'from-indigo-900 to-indigo-700',
      icon: '⭐'
    },
    {
      year: 2020,
      title: 'ГЛОБАЛЬНАЯ ЭКСПАНСИЯ',
      description: 'Выход на рынки США, Китая и ОАЭ. Экспорт в 8 стран мира',
      color: 'from-purple-900 to-purple-700',
      icon: '🚀'
    },
    {
      year: 2024,
      title: 'ЛИДЕРСТВО',
      description: 'Ведущий производитель премиальной минеральной воды в Центральной Азии. 33 года качества',
      color: 'from-pink-900 to-pink-700',
      icon: '👑'
    }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-navy via-primary-blue to-primary-cyan text-white pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 100 + 20}px`,
                height: `${Math.random() * 100 + 20}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(40px)'
              }}
            />
          ))}
        </div>

        <div className="container-custom text-center relative z-10">
          <div className="animate-fade-in">
            <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-secondary mb-8">
              О компании
            </span>
            <h1 className="font-primary text-[clamp(50px,10vw,120px)] mb-6 leading-none drop-shadow-2xl">
              KELECHEK
            </h1>
            <p className="font-secondary text-2xl md:text-4xl max-w-4xl mx-auto leading-relaxed">
              <span className="font-bold">33 года</span> создаем продукты премиум-класса
              <br />
              <span className="text-primary-cyan text-3xl md:text-5xl font-bold mt-4 block">
                для здоровья миллионов людей
              </span>
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center animate-bounce">
          <span className="text-sm mb-2">Прокрутите вниз</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white fade-up">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: 33, suffix: '+', label: 'Лет на рынке', desc: 'С 1991 года', color: 'from-blue-500 to-cyan-500' },
              { value: 4, suffix: '', label: 'Страны экспорта', desc: 'По всему миру', color: 'from-cyan-500 to-teal-500' },
              { value: 150, suffix: '+', label: 'Сотрудников', desc: 'Команда профессионалов', color: 'from-teal-500 to-green-500' },
              { value: 4, suffix: '', label: 'Бренда', desc: 'В портфеле', color: 'from-green-500 to-emerald-500' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`text-center p-6 md:p-8 rounded-3xl bg-gradient-to-br ${stat.color}/5 border-2 border-transparent hover:border-current transition-all duration-500 group hover:shadow-2xl hover:-translate-y-3`}
              >
                <div className={`font-primary text-5xl md:text-7xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-500`}>
                  <span className="stat-number" data-value={stat.value}>0</span>
                  {stat.suffix}
                </div>
                <div className="font-secondary text-base md:text-lg text-dark-navy mb-2 font-semibold">{stat.label}</div>
                <div className="font-secondary text-xs md:text-sm text-text-secondary">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Timeline */}
      <section
        ref={horizontalRef}
        className="relative h-screen overflow-hidden bg-black"
      >
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-white text-center">
          <h2 className="font-primary text-5xl md:text-7xl mb-4">НАША ИСТОРИЯ</h2>
          <p className="font-secondary text-xl md:text-2xl text-gray-400">← Прокрутите, чтобы увидеть путь к успеху →</p>
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="flex">
            {timeline.map((item, index) => (
              <div
                key={index}
                ref={el => panelsRef.current[index] = el}
                className={`min-w-screen h-screen flex items-center justify-center bg-gradient-to-br ${item.color} relative`}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
                </div>

                {/* Content */}
                <div className="container-custom relative z-10 text-white">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="text-8xl md:text-9xl mb-8 opacity-50">{item.icon}</div>
                    <div className="font-primary text-9xl md:text-[180px] mb-8 leading-none">
                      {item.year}
                    </div>
                    <h3 className="font-primary text-4xl md:text-6xl mb-8 leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-secondary text-2xl md:text-3xl leading-relaxed text-white/90">
                      {item.description}
                    </p>
                    <div className="mt-12 flex items-center justify-center space-x-2">
                      {timeline.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === index ? 'w-12 bg-white' : 'w-2 bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 bg-gradient-to-br from-gray-50 to-white fade-up">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-cyan/10 text-primary-cyan rounded-full text-sm font-secondary mb-6">
                Наша миссия
              </span>
              <h2 className="font-primary text-5xl md:text-6xl text-dark-navy mb-8 leading-tight">
                КАЧЕСТВО, ПРОВЕРЕННОЕ ВРЕМЕНЕМ
              </h2>
              <p className="font-secondary text-xl text-gray-700 mb-6 leading-relaxed">
                ЗАО «КЕЛЕЧЕК» основано в 1991 году в городе Жалал-Абад, Кыргызстан.
                За более чем 30 лет работы мы стали крупнейшим производителем премиальной
                минеральной воды в регионе Центральной Азии.
              </p>
              <p className="font-secondary text-xl text-gray-700 mb-8 leading-relaxed">
                Наш флагманский продукт - лечебно-столовая минеральная вода из источника №27 -
                сертифицирована для лечения заболеваний ЖКТ и завоевала доверие миллионов потребителей.
              </p>
              <Button
                size="large"
                onClick={() => window.location.href = '/brands/kelechek'}
              >
                Узнать о продукции
              </Button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-dark-navy to-primary-blue text-white rounded-3xl p-10 hover:scale-105 transition-transform duration-500 shadow-2xl">
                <div className="font-primary text-9xl mb-4 drop-shadow-2xl">27</div>
                <div className="font-secondary text-3xl mb-3 font-bold">Источник №27</div>
                <div className="font-secondary text-lg text-gray-300 leading-relaxed">
                  Уникальный источник в Жалал-Абаде с подтвержденными целебными свойствами
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="font-primary text-6xl text-green-600 mb-3">ISO</div>
                  <div className="font-secondary text-sm text-gray-700 font-semibold">Международный<br/>стандарт</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="font-primary text-6xl text-blue-600 mb-3">24/7</div>
                  <div className="font-secondary text-sm text-gray-700 font-semibold">Контроль<br/>качества</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-white fade-up">
        <div className="container-custom">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-primary-blue/10 text-primary-blue rounded-full text-sm font-secondary mb-6">
              Наша команда
            </span>
            <h2 className="font-primary text-5xl md:text-6xl text-dark-navy mb-6">
              ПРОФЕССИОНАЛЫ СВОЕГО ДЕЛА
            </h2>
            <p className="font-secondary text-xl text-text-secondary max-w-3xl mx-auto">
              Более 150 специалистов работают ежедневно для создания продуктов высочайшего качества
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Производство', desc: 'Современное оборудование и технологии', icon: '🏭', color: 'from-blue-500 to-cyan-500' },
              { title: 'Контроль качества', desc: 'Многоступенчатая система проверки', icon: '🔬', color: 'from-cyan-500 to-teal-500' },
              { title: 'Логистика', desc: 'Доставка в 4 страны мира', icon: '🚛', color: 'from-teal-500 to-green-500' }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${item.color}/5 rounded-3xl p-10 border-2 border-transparent hover:border-current transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 group`}
              >
                <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h3 className={`font-primary text-3xl bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-4`}>
                  {item.title}
                </h3>
                <p className="font-secondary text-lg text-gray-700 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-blue to-primary-cyan text-white fade-up">
        <div className="container-custom text-center">
          <h2 className="font-primary text-5xl md:text-7xl mb-8">
            СТАНЬТЕ ЧАСТЬЮ ИСТОРИИ KELECHEK
          </h2>
          <p className="font-secondary text-2xl md:text-3xl mb-12 max-w-4xl mx-auto leading-relaxed opacity-90">
            Присоединяйтесь к миллионам людей, выбирающих качество и здоровье
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="large"
              variant="secondary"
              onClick={() => window.location.href = '/where-to-buy'}
            >
              Где купить
            </Button>
            <Button
              size="large"
              variant="outline"
              onClick={() => window.location.href = '/partners'}
            >
              Стать партнером
            </Button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default About;
