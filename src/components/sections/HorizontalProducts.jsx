import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizontalProducts = () => {
  const sectionRef = useRef(null);
  const sliderRef = useRef(null);

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
    const section = sectionRef.current;
    const slider = sliderRef.current;

    if (!section || !slider) return;

    const slides = gsap.utils.toArray('.product-slide');
    const slideWidth = slides[0].offsetWidth;
    const totalWidth = slideWidth * slides.length;

    gsap.to(slider, {
      x: -(totalWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    // Individual slide animations
    slides.forEach((slide, i) => {
      gsap.from(slide, {
        scale: 0.8,
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: () => `top+=${i * slideWidth * 0.5} top`,
          end: () => `top+=${(i + 1) * slideWidth * 0.5} top`,
          scrub: 1,
          containerAnimation: ScrollTrigger.getById(section)
        }
      });
    });

  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-black"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kelechek-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[150px]" />
      </div>

      <div ref={sliderRef} className="flex items-center h-full">
        {products.map((product, index) => (
          <div
            key={index}
            className="product-slide flex-shrink-0 w-screen h-screen flex items-center justify-center px-20"
          >
            <div className="relative group cursor-pointer">
              {/* Card */}
              <div
                className={`relative w-[500px] h-[700px] rounded-3xl bg-gradient-to-br ${product.gradient} p-12 flex flex-col justify-between overflow-hidden shadow-2xl`}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top content */}
                <div className="relative z-10">
                  <div className="text-white/60 text-sm mb-2">{product.size}</div>
                  <h3 className="font-primary text-6xl text-white mb-4 leading-none">
                    {product.name}
                  </h3>
                  <p className="font-secondary text-xl text-white/80">
                    {product.subtitle}
                  </p>
                  {product.special && (
                    <div className="mt-4 inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold">
                      ✨ Для мохито!
                    </div>
                  )}
                </div>

                {/* Center - Bottle visualization */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative w-32 h-64 bg-white/10 backdrop-blur-md rounded-[40%] group-hover:scale-110 transition-transform duration-500">
                    {/* Condensation drops */}
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-white/40 rounded-full blur-sm"
                        style={{
                          width: `${Math.random() * 15 + 5}px`,
                          height: `${Math.random() * 20 + 10}px`,
                          left: `${Math.random() * 70 + 15}%`,
                          top: `${Math.random() * 80 + 10}%`
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Bottom content */}
                <div className="relative z-10">
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-white/60 text-sm mb-1">Цена</div>
                      <div className="font-primary text-4xl text-white">
                        {product.price}
                      </div>
                    </div>
                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors">
                      Купить
                    </button>
                  </div>
                </div>

                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-32 h-32 border border-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${5 + Math.random() * 5}s ease-in-out infinite`,
                        animationDelay: `${Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Card number indicator */}
              <div className="absolute -top-10 left-0 font-primary text-8xl text-white/10">
                0{index + 1}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2">
          {products.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white/30 rounded-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalProducts;
