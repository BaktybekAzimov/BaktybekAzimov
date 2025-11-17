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
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100'
    },
    {
      title: 'KELECHEK №27',
      subtitle: '1.5л Семейная',
      price: '80 сом',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100'
    },
    {
      title: 'ADYGENE',
      subtitle: '0.5л Ледниковая',
      price: '60 сом',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100'
    },
    {
      title: 'ADYGENE Лимон',
      subtitle: '0.5л С лимоном',
      price: '65 сом',
      bgColor: 'bg-gradient-to-br from-yellow-50 to-blue-100'
    },
    {
      title: 'GIMALAI',
      subtitle: '1л Питьевая',
      price: '40 сом',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100'
    },
    {
      title: 'GIMALAI',
      subtitle: '5л Семейная',
      price: '150 сом',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100'
    },
    {
      title: 'К+ Витамины',
      subtitle: '0.5л Для мохито!',
      price: '55 сом',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-200'
    },
    {
      title: 'Тархун',
      subtitle: '0.5л Классика',
      price: '45 сом',
      bgColor: 'bg-gradient-to-br from-green-100 to-green-200'
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current;

    gsap.fromTo(
      cards,
      {
        opacity: 0,
        y: 100,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
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
