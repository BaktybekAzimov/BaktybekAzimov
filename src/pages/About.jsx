import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Button from '../components/ui/Button';
import NumberCounter from '../components/common/NumberCounter';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const timelineRef = useRef(null);

  useEffect(() => {
    // Animate sections on scroll
    gsap.utils.toArray('.fade-up').forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 60,
        duration: 1,
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }, []);

  const timeline = [
    { year: 1991, event: 'Основание компании KELECHEK', desc: 'Начало производства минеральной воды №27' },
    { year: 1995, event: 'Первая сертификация', desc: 'Получение сертификата лечебно-столовой воды' },
    { year: 2000, event: 'Расширение производства', desc: 'Модернизация завода и увеличение мощностей' },
    { year: 2005, event: 'Экспорт в Казахстан', desc: 'Выход на международный рынок' },
    { year: 2010, event: 'Новые бренды', desc: 'Запуск линеек ADYGENE и GIMALAI' },
    { year: 2015, event: 'ISO 9001', desc: 'Сертификация международного стандарта качества' },
    { year: 2020, event: 'Экспорт в США', desc: 'Выход на рынок Северной Америки' },
    { year: 2024, event: 'Современность', desc: 'Лидер рынка минеральных вод Центральной Азии' }
  ];

  return (
    <div className="pt-32 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-navy via-primary-blue to-primary-cyan text-white py-32 mb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-secondary mb-8">
            О компании
          </span>
          <h1 className="font-primary text-[clamp(50px,8vw,100px)] mb-6 leading-none">
            KELECHEK
          </h1>
          <p className="font-secondary text-2xl md:text-4xl max-w-4xl mx-auto leading-relaxed">
            30 лет создаем продукты премиум-класса
            <br />
            <span className="text-primary-cyan">
              для здоровья и удовольствия миллионов людей
            </span>
          </p>
        </div>
      </section>

      <div className="container-custom">
        {/* Stats Section */}
        <section className="mb-32 fade-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 33, suffix: '+', label: 'Лет на рынке', desc: 'С 1991 года' },
              { value: 8, suffix: '', label: 'Стран экспорта', desc: 'По всему миру' },
              { value: 150, suffix: '+', label: 'Сотрудников', desc: 'Профессиональная команда' },
              { value: 4, suffix: '', label: 'Бренда', desc: 'В портфеле продуктов' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary-blue/5 to-primary-cyan/5 border-2 border-primary-cyan/20 hover:border-primary-cyan/40 transition-all duration-300 group"
              >
                <div className="font-primary text-6xl text-primary-blue mb-2 group-hover:scale-110 transition-transform">
                  <NumberCounter end={stat.value} duration={2000} />
                  {stat.suffix}
                </div>
                <div className="font-secondary text-lg text-dark-navy mb-2">{stat.label}</div>
                <div className="font-secondary text-sm text-text-secondary">{stat.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="mb-32 fade-up">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-cyan/10 text-primary-cyan rounded-full text-sm font-secondary mb-6">
                История успеха
              </span>
              <h2 className="font-primary text-6xl text-dark-navy mb-8">
                ОТ ИСТОЧНИКА К ЛИДЕРСТВУ
              </h2>
              <p className="font-secondary text-xl text-gray-700 mb-6 leading-relaxed">
                ЗАО «КЕЛЕЧЕК» основано в 1991 году в городе Жалал-Абад, Кыргызстан.
                За более чем 30 лет работы мы стали крупнейшим производителем премиальной
                минеральной воды в регионе Центральной Азии.
              </p>
              <p className="font-secondary text-xl text-gray-700 mb-6 leading-relaxed">
                Наш флагманский продукт - лечебно-столовая минеральная вода из источника №27 -
                сертифицирована для лечения заболеваний желудочно-кишечного тракта и завоевала
                доверие миллионов потребителей.
              </p>
              <p className="font-secondary text-xl text-gray-700 leading-relaxed">
                Сегодня продукция KELECHEK экспортируется в Казахстан, Узбекистан, Россию,
                США, Китай, ОАЭ, Турцию и Южную Корею.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-dark-navy to-primary-blue text-white rounded-3xl p-10">
                <div className="font-primary text-8xl mb-4">27</div>
                <div className="font-secondary text-2xl mb-2">Источник №27</div>
                <div className="font-secondary text-gray-300">
                  Уникальный источник в Жалал-Абаде с целебными свойствами
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                  <div className="font-primary text-5xl text-green-600 mb-2">ISO</div>
                  <div className="font-secondary text-sm text-gray-700">Международный стандарт</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="font-primary text-5xl text-blue-600 mb-2">24/7</div>
                  <div className="font-secondary text-sm text-gray-700">Контроль качества</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-32 fade-up">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-blue/10 text-primary-blue rounded-full text-sm font-secondary mb-6">
              Наша история
            </span>
            <h2 className="font-primary text-6xl text-dark-navy mb-6">
              ПУТЬ К УСПЕХУ
            </h2>
            <p className="font-secondary text-xl text-text-secondary max-w-3xl mx-auto">
              Основные вехи развития компании KELECHEK
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-blue via-primary-cyan to-primary-blue hidden md:block" />

            <div className="space-y-12">
              {timeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`relative grid md:grid-cols-2 gap-8 items-center ${
                    idx % 2 === 0 ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Left/Right content */}
                  <div className={idx % 2 === 0 ? 'md:text-right' : 'md:col-start-2'}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-primary-cyan/20 hover:border-primary-cyan">
                      <div className="font-primary text-5xl text-primary-blue mb-3">
                        {item.year}
                      </div>
                      <h3 className="font-primary text-2xl text-dark-navy mb-3">
                        {item.event}
                      </h3>
                      <p className="font-secondary text-gray-600">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <div className="w-6 h-6 bg-primary-cyan rounded-full border-4 border-white shadow-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-32 fade-up">
          <div className="bg-gradient-to-br from-primary-blue/5 via-primary-cyan/5 to-primary-blue/5 rounded-3xl p-12 md:p-16">
            <div className="text-center mb-16">
              <h2 className="font-primary text-6xl text-dark-navy mb-6">
                НАШИ ЦЕННОСТИ
              </h2>
              <p className="font-secondary text-xl text-text-secondary max-w-3xl mx-auto">
                Принципы, которыми мы руководствуемся в работе
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'КАЧЕСТВО',
                  desc: 'Строгий многоступенчатый контроль на каждом этапе производства. Используем только современное европейское оборудование.'
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'ПРИРОДА',
                  desc: 'Чистая вода из природных источников горного Кыргызстана. Бережное отношение к экологии и устойчивое развитие.'
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                  title: 'ЛЮДИ',
                  desc: 'Забота о здоровье потребителей и благополучии сотрудников. Социальная ответственность и развитие сообщества.'
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: 'ИННОВАЦИИ',
                  desc: 'Постоянное совершенствование технологий и процессов. Инвестиции в развитие и модернизацию производства.'
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  ),
                  title: 'МЕЖДУНАРОДНОСТЬ',
                  desc: 'Соответствие международным стандартам качества. Экспорт продукции в 8 стран мира.'
                },
                {
                  icon: (
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'ДОСТУПНОСТЬ',
                  desc: 'Премиум качество по справедливым ценам. Продукция доступна во всех регионах присутствия.'
                }
              ].map((value, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-blue to-primary-cyan rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="font-primary text-2xl text-dark-navy mb-4 text-center">
                    {value.title}
                  </h3>
                  <p className="font-secondary text-gray-600 leading-relaxed text-center">
                    {value.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Production */}
        <section className="mb-32 fade-up">
          <div className="bg-dark-navy text-white rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-5 font-primary text-[300px] leading-none">27</div>

            <div className="relative z-10">
              <h2 className="font-primary text-6xl mb-8">
                ПРОИЗВОДСТВО
              </h2>

              <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div>
                  <p className="font-secondary text-xl mb-6 leading-relaxed text-gray-300">
                    Наш производственный комплекс оснащен современным европейским оборудованием
                    и соответствует международным стандартам качества ISO 9001.
                  </p>
                  <p className="font-secondary text-xl leading-relaxed text-gray-300">
                    Полный производственный цикл - от добычи воды из источника до упаковки
                    готовой продукции - находится под строгим контролем качества.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    'Автоматизированные линии розлива',
                    'Лаборатория контроля качества',
                    'Система фильтрации и очистки',
                    'Современный складской комплекс',
                    'Логистический центр',
                    'Экологическая безопасность'
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center text-lg">
                      <div className="w-2 h-2 bg-primary-cyan rounded-full mr-4" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '50K', label: 'Бутылок в день' },
                  { value: '100%', label: 'Автоматизация' },
                  { value: '24/7', label: 'Контроль качества' },
                  { value: '3', label: 'Производственные линии' }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
                    <div className="font-primary text-4xl text-primary-cyan mb-2">{item.value}</div>
                    <div className="font-secondary text-sm text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center fade-up">
          <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-3xl p-12 md:p-16 border-2 border-primary-cyan/20">
            <h2 className="font-primary text-5xl md:text-6xl text-dark-navy mb-6">
              ХОТИТЕ УЗНАТЬ БОЛЬШЕ?
            </h2>
            <p className="font-secondary text-xl text-text-secondary mb-10 max-w-3xl mx-auto leading-relaxed">
              Свяжитесь с нами для получения дополнительной информации о компании,
              продукции или возможностях сотрудничества
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                variant="primary"
                onClick={() => window.location.href = '/contacts'}
              >
                Связаться с нами
              </Button>
              <Button
                size="large"
                variant="secondary"
                onClick={() => window.location.href = '/'}
              >
                Наша продукция
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
