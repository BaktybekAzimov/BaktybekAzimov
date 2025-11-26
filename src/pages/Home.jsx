import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import BrandCard from '../components/brands/BrandCard';
import NumberCounter from '../components/common/NumberCounter';
import Button from '../components/ui/Button';
import WaterDrops from '../components/effects/WaterDrops';
import ProductGallery from '../components/products/ProductGallery';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import PremiumHero from '../components/hero/PremiumHero';
import HorizontalProducts from '../components/sections/HorizontalProducts';
import RevealMask from '../components/animations/RevealMask';
import SplitText from '../components/animations/SplitText';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const heroRef = useRef(null);
  const number27Ref = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    // Hero animation with stagger
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      opacity: 0,
      y: 100,
      duration: 1.2,
      ease: 'power4.out'
    })
    .from('.hero-subtitle', {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-description', {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    .from('.hero-buttons > *', {
      opacity: 0,
      y: 30,
      stagger: 0.2,
      duration: 0.6,
      ease: 'back.out(1.7)'
    }, '-=0.4');

    // Floating number 27 with glow
    gsap.to(number27Ref.current, {
      textShadow: '0 0 60px rgba(200, 16, 46, 1), 0 0 100px rgba(200, 16, 46, 0.8)',
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // Parallax effect for number 27
    gsap.to(number27Ref.current, {
      y: 100,
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Scroll indicator bounce
    gsap.to(scrollIndicatorRef.current, {
      y: 10,
      duration: 0.8,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true
    });

    // Brands section with advanced animation
    const brandCards = gsap.utils.toArray('.brand-card');
    brandCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        y: 150,
        rotationX: -30,
        scale: 0.8,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        },
        delay: index * 0.15
      });
    });

    // Features section parallax
    gsap.utils.toArray('.feature-item').forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        x: index % 2 === 0 ? -100 : 100,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Stats counters entrance
    gsap.from('.stats-section', {
      opacity: 0,
      y: 100,
      duration: 1,
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 80%'
      }
    });

  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Water drops effect */}
      <WaterDrops count={30} />

      {/* Premium Hero Section - Awwwards Level */}
      <PremiumHero />

      {/* Features Section with Premium Animations */}
      <section className="py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kelechek-bg/30 to-transparent pointer-events-none" />

        <div className="container-custom relative z-10">
          <SplitText
            text="ПОЧЕМУ KELECHEK?"
            variant="fadeUp"
            className="font-primary text-5xl md:text-6xl text-center text-kelechek-dark mb-20"
          />

          <div className="grid md:grid-cols-3 gap-12">
            <RevealMask direction="up" delay={0}>
              <div className="feature-item text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-kelechek-primary to-red-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-primary text-3xl text-kelechek-dark mb-4">КАЧЕСТВО</h3>
                <p className="font-secondary text-lg text-gray-600 leading-relaxed">
                  Строжайший контроль на каждом этапе производства. Международные сертификаты ISO, HACCP, Halal.
                </p>
              </div>
            </RevealMask>

            <RevealMask direction="up" delay={0.2}>
              <div className="feature-item text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-primary text-3xl text-kelechek-dark mb-4">ПРИРОДА</h3>
                <p className="font-secondary text-lg text-gray-600 leading-relaxed">
                  Чистейшая вода из природных источников Кыргызстана. ADYGENE с высоты 4,216 метров!
                </p>
              </div>
            </RevealMask>

            <RevealMask direction="up" delay={0.4}>
              <div className="feature-item text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-primary text-3xl text-kelechek-dark mb-4">ИННОВАЦИИ</h3>
                <p className="font-secondary text-lg text-gray-600 leading-relaxed">
                  Современное оборудование и технологии. 30 лет опыта и непрерывное развитие.
                </p>
              </div>
            </RevealMask>
          </div>
        </div>
      </section>

      {/* Brands Showcase Section */}
      <section className="brands-section py-24 bg-gradient-to-b from-white to-kelechek-bg relative">
        <div className="container-custom">
          <h2 className="font-primary text-5xl md:text-6xl text-center text-kelechek-dark mb-6">
            СЕМЬЯ БРЕНДОВ KELECHEK
          </h2>
          <p className="font-secondary text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            От премиальной лечебно-столовой воды до освежающих лимонадов -
            мы создаем продукты мирового класса
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="brand-card">
              <BrandCard
                title="KELECHEK №27"
                subtitle="Premium Mineral Water"
                to="/brands/kelechek"
                bgClass="bg-kelechek-hero"
              />
            </div>

            <div className="brand-card">
              <BrandCard
                title="ADYGENE"
                subtitle="Glacier Water 4,216m"
                to="/brands/adygene"
                bgClass="bg-adygene-ice"
              />
            </div>

            <div className="brand-card">
              <BrandCard
                title="GIMALAI"
                subtitle="Living Water"
                to="/brands/gimalai"
                bgClass="bg-gimalai-water"
              />
            </div>

            <div className="brand-card">
              <BrandCard
                title="ЛИМОНАДЫ"
                subtitle="Яркие вкусы"
                to="/brands/lemonads"
                bgClass="bg-gradient-to-br from-yellow-300 via-green-400 to-orange-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <ProductGallery />

      {/* Horizontal Products Scroll - Awwwards Style */}
      <HorizontalProducts />

      {/* Key Numbers Section */}
      <section className="stats-section py-32 bg-gradient-to-br from-kelechek-dark via-kelechek-primary to-red-900 text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
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

        <div className="container-custom relative z-10">
          <h2 className="font-primary text-5xl md:text-6xl text-center mb-20">
            KELECHEK В ЦИФРАХ
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            <NumberCounter
              end={30}
              suffix=" ЛЕТ"
              label="На рынке"
              className="text-white"
            />
            <NumberCounter
              end={4216}
              suffix=" М"
              label="Высота Adygene"
              className="text-white"
            />
            <NumberCounter
              end={4}
              suffix=" СТРАНЫ"
              label="Экспорт"
              className="text-white"
            />
            <NumberCounter
              end={30}
              suffix="+"
              label="Продуктов"
              className="text-white"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-40 bg-gradient-to-br from-kelechek-dark via-gray-900 to-black text-white text-center relative overflow-hidden">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-50"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10">
          <h2 className="font-primary text-5xl md:text-7xl mb-8">
            ГОТОВЫ НАЧАТЬ СОТРУДНИЧЕСТВО?
          </h2>
          <p className="font-secondary text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">
            Присоединяйтесь к нашей сети партнеров и предлагайте
            вашим клиентам продукцию премиум-класса
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="large" variant="primary" className="text-xl px-12 py-6">
              📞 Связаться с нами
            </Button>
            <Button size="large" variant="outline" className="text-xl px-12 py-6">
              📄 Скачать каталог
            </Button>
          </div>
        </div>
      </section>

      {/* Add twinkle animation to globals.css */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes shine {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
};

export default Home;
