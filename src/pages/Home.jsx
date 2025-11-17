import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import BrandCard from '../components/brands/BrandCard';
import NumberCounter from '../components/common/NumberCounter';
import Button from '../components/ui/Button';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const number27Ref = useRef(null);

  useEffect(() => {
    // Hero animation
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    })
    .from('.hero-subtitle', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    .from('.hero-buttons', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5');

    // Number 27 glow animation
    gsap.to(number27Ref.current, {
      textShadow: '0 0 40px rgba(200, 16, 46, 0.8), 0 0 80px rgba(200, 16, 46, 0.5)',
      duration: 2,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true
    });

    // Brands section animation
    gsap.from('.brand-card', {
      opacity: 0,
      y: 100,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.brands-section',
        start: 'top 80%',
      }
    });
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="min-h-screen bg-kelechek-hero flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-kelechek-primary rounded-full opacity-10 animate-float" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-kelechek-primary rounded-full opacity-5 animate-float" style={{animationDelay: '1s'}} />
        </div>

        {/* Content */}
        <div className="container-custom text-center text-white z-10 relative">
          <h1 className="hero-title font-primary text-hero mb-4">
            30 ЛЕТ
          </h1>
          <h2 className="hero-subtitle font-primary text-display mb-8">
            СОВЕРШЕНСТВА
          </h2>
          <p className="hero-subtitle font-secondary text-xl mb-12 max-w-2xl mx-auto">
            Premium Mineral Water from the mountains of Kyrgyzstan since 1991
          </p>

          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="large" variant="primary">
              Наша продукция
            </Button>
            <Button size="large" variant="outline">
              Где купить
            </Button>
          </div>
        </div>

        {/* Number 27 with glow */}
        <div
          ref={number27Ref}
          className="absolute bottom-10 right-10 font-primary text-9xl text-kelechek-primary opacity-20 pointer-events-none"
        >
          27
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Brands Showcase Section */}
      <section className="brands-section py-24 bg-white">
        <div className="container-custom">
          <h2 className="font-primary text-h1 text-center text-kelechek-dark mb-4">
            СЕМЬЯ БРЕНДОВ KELECHEK
          </h2>
          <p className="font-secondary text-lg text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            От премиальной лечебно-столовой воды до освежающих лимонадов -
            мы создаем продукты мирового класса
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BrandCard
              title="KELECHEK №27"
              subtitle="Premium Mineral Water"
              to="/brands/kelechek"
              bgClass="bg-kelechek-hero"
              className="brand-card"
            />

            <BrandCard
              title="ADYGENE"
              subtitle="Glacier Water 4,216m"
              to="/brands/adygene"
              bgClass="bg-adygene-ice"
              className="brand-card"
            />

            <BrandCard
              title="GIMALAI"
              subtitle="Living Water"
              to="/brands/gimalai"
              bgClass="bg-gimalai-water"
              className="brand-card"
            />

            <BrandCard
              title="ЛИМОНАДЫ"
              subtitle="Яркие вкусы"
              to="/brands/lemonads"
              bgClass="bg-gradient-to-br from-yellow-300 via-green-400 to-orange-400"
              className="brand-card"
            />
          </div>
        </div>
      </section>

      {/* Key Numbers Section */}
      <section className="py-24 bg-kelechek-subtle">
        <div className="container-custom">
          <h2 className="font-primary text-h2 text-center text-kelechek-dark mb-16">
            KELECHEK В ЦИФРАХ
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <NumberCounter
              end={30}
              suffix=" ЛЕТ"
              label="На рынке"
            />
            <NumberCounter
              end={4216}
              suffix=" М"
              label="Высота Adygene"
            />
            <NumberCounter
              end={4}
              suffix=" СТРАНЫ"
              label="Экспорт"
            />
            <NumberCounter
              end={30}
              suffix="+"
              label="Продуктов"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-kelechek-hero text-white text-center">
        <div className="container-custom">
          <h2 className="font-primary text-h1 mb-6">
            ГОТОВЫ НАЧАТЬ СОТРУДНИЧЕСТВО?
          </h2>
          <p className="font-secondary text-xl mb-12 max-w-2xl mx-auto">
            Присоединяйтесь к нашей сети партнеров и предлагайте
            вашим клиентам продукцию премиум-класса
          </p>
          <Button size="large" variant="outline">
            Стать партнером →
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
