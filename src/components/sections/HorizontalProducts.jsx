import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalProducts = () => {
  const sectionRef = useRef(null);

  const products = [
    {
      name: 'KELECHEK №27',
      subtitle: 'Премиум лечебно-столовая',
      price: '50 сом',
      size: '0.5л',
      gradient: 'from-red-900 via-red-700 to-red-500'
    },
    {
      name: 'KELECHEK №27',
      subtitle: 'Семейная упаковка',
      price: '80 сом',
      size: '1.5л',
      gradient: 'from-red-800 via-red-600 to-orange-500'
    },
    {
      name: 'ADYGENE',
      subtitle: 'Ледниковая с высоты 4,216м',
      price: '60 сом',
      size: '0.5л',
      gradient: 'from-blue-900 via-blue-600 to-cyan-400'
    },
    {
      name: 'ADYGENE Лимон',
      subtitle: 'С натуральным лимоном',
      price: '65 сом',
      size: '0.5л',
      gradient: 'from-yellow-600 via-blue-500 to-cyan-400'
    },
    {
      name: 'GIMALAI',
      subtitle: 'Питьевая для всей семьи',
      price: '40 сом',
      size: '1л',
      gradient: 'from-cyan-700 via-cyan-500 to-blue-400'
    },
    {
      name: 'GIMALAI',
      subtitle: 'Большая упаковка',
      price: '150 сом',
      size: '5л',
      gradient: 'from-cyan-800 via-blue-600 to-cyan-500'
    },
    {
      name: 'К+ Витамины',
      subtitle: 'Идеально для мохито!',
      price: '55 сом',
      size: '0.5л',
      gradient: 'from-green-600 via-lime-500 to-emerald-400',
      special: true
    },
    {
      name: 'Тархун',
      subtitle: 'Классический вкус',
      price: '45 сом',
      size: '0.5л',
      gradient: 'from-green-700 via-green-500 to-lime-400'
    }
  ];

  useEffect(() => {
    // Cards stagger animation - simplified to not hide content
    gsap.from('.product-card', {
      y: 50,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.08,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-blue/10 rounded-full blur-[120px]" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="section-badge">Полная линейка</span>
          </div>
          <h2 className="font-primary text-h1 text-dark-navy mb-6">
            Наша продукция
          </h2>
          <p className="text-body-large text-text-secondary max-w-3xl mx-auto">
            Премиальные напитки для всей семьи с доставкой по всему Кыргызстану
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="product-card group cursor-pointer"
            >
              {/* Card */}
              <div
                className={`relative rounded-2xl bg-gradient-to-br ${product.gradient} p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-[420px]`}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top content */}
                <div className="relative z-10">
                  <div className="text-white/80 text-xs mb-1 font-semibold">{product.size}</div>
                  <h3 className="font-primary text-3xl text-white mb-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-secondary text-sm text-white/90">
                    {product.subtitle}
                  </p>
                  {product.special && (
                    <div className="mt-3 inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                      ✨ Для мохито!
                    </div>
                  )}
                </div>

                {/* Center - Bottle emoji */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-20 group-hover:scale-110 transition-transform duration-300">
                  💧
                </div>

                {/* Bottom content */}
                <div className="relative z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-white/80 text-xs mb-1">Цена</div>
                      <div className="font-primary text-3xl text-white">
                        {product.price}
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-colors hover:scale-105">
                      Купить
                    </button>
                  </div>
                </div>

                {/* Background circles */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-20 h-20 border-2 border-white rounded-full animate-pulse" />
                  <div className="absolute bottom-4 left-4 w-16 h-16 border-2 border-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <button className="btn-primary inline-flex items-center space-x-2 hover:scale-105 transition-transform">
            <span>Смотреть все продукты</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HorizontalProducts;
