import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const testimonials = [
    {
      name: 'Айгуль М.',
      position: 'Владелец ресторана',
      text: 'KELECHEK №27 - идеальное дополнение к нашему меню. Гости отмечают отличное качество!',
      rating: 5
    },
    {
      name: 'Тимур К.',
      position: 'Менеджер отеля',
      text: 'Сотрудничаем с KELECHEK уже 5 лет. Всегда стабильное качество и своевременные поставки.',
      rating: 5
    },
    {
      name: 'Марина С.',
      position: 'Покупатель',
      text: 'Покупаю ADYGENE для всей семьи. Вода действительно вкусная и чистая!',
      rating: 5
    }
  ];

  const certificates = [
    { title: 'ISO 9001:2015', subtitle: 'Система менеджмента качества' },
    { title: 'HACCP', subtitle: 'Безопасность пищевых продуктов' },
    { title: 'HALAL', subtitle: 'Сертификат Halal' },
    { title: 'ЕЭС', subtitle: 'Таможенный союз' }
  ];

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%'
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-white to-kelechek-bg">
      <div className="container-custom">
        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="font-primary text-h2 text-center text-kelechek-dark mb-4">
            ОТЗЫВЫ ПАРТНЕРОВ
          </h2>
          <p className="font-secondary text-lg text-center text-gray-600 mb-12">
            Что говорят о нас наши клиенты
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-secondary text-gray-700 mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-kelechek-dark">{testimonial.name}</div>
                  <div className="font-secondary text-sm text-gray-500">{testimonial.position}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates */}
        <div>
          <h2 className="font-primary text-h2 text-center text-kelechek-dark mb-4">
            СЕРТИФИКАТЫ И НАГРАДЫ
          </h2>
          <p className="font-secondary text-lg text-center text-gray-600 mb-12">
            Подтверждение качества международными стандартами
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certificates.map((cert, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[testimonials.length + index] = el}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-kelechek-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="font-primary text-xl text-kelechek-dark mb-2">
                  {cert.title}
                </div>
                <div className="font-secondary text-sm text-gray-600">
                  {cert.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
