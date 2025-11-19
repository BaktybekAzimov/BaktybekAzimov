import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ProductCard3D from './ProductCard3D';

gsap.registerPlugin(ScrollTrigger);

const ProductGallery = () => {
  const galleryRef = useRef(null);
  const cardsRef = useRef([]);

  const products = [
    {
      title: 'KELECHEK №27',
      subtitle: '0.5л Премиум',
      price: '50 сом',
      bgColor: 'bg-gradient-to-br from-red-400 to-red-600',
      icon: '🏔️'
    },
    {
      title: 'KELECHEK №27',
      subtitle: '1.5л Семейная',
      price: '80 сом',
      bgColor: 'bg-gradient-to-br from-red-500 to-orange-600',
      icon: '💧'
    },
    {
      title: 'ADYGENE',
      subtitle: '0.5л Ледниковая',
      price: '60 сом',
      bgColor: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      icon: '❄️'
    },
    {
      title: 'ADYGENE Лимон',
      subtitle: '0.5л С лимоном',
      price: '65 сом',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-blue-500',
      icon: '🍋'
    },
    {
      title: 'GIMALAI',
      subtitle: '1л Питьевая',
      price: '40 сом',
      bgColor: 'bg-gradient-to-br from-cyan-400 to-blue-500',
      icon: '⛰️'
    },
    {
      title: 'GIMALAI',
      subtitle: '5л Семейная',
      price: '150 сом',
      bgColor: 'bg-gradient-to-br from-cyan-500 to-teal-600',
      icon: '💦'
    },
    {
      title: 'К+ Витамины',
      subtitle: '0.5л Для мохито!',
      price: '55 сом',
      bgColor: 'bg-gradient-to-br from-green-400 to-lime-500',
      icon: '🍹'
    },
    {
      title: 'Тархун',
      subtitle: '0.5л Классика',
      price: '45 сом',
      bgColor: 'bg-gradient-to-br from-green-500 to-emerald-600',
      icon: '🌿'
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current;

    gsap.from(
      cards,
      {
        y: 60,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );
  }, []);

  return (
    <section ref={galleryRef} className="py-20 overflow-hidden">
      <div className="container-custom">
        <h2 className="font-primary text-h1 text-center text-kelechek-dark mb-4">
          НАША ПРОДУКЦИЯ
        </h2>
        <p className="font-secondary text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Полная линейка премиальных напитков для всей семьи
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
            >
              <ProductCard3D {...product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;
