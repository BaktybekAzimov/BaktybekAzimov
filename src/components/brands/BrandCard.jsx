import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const BrandCard = ({
  title,
  subtitle,
  to,
  bgClass,
  image
}) => {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const img = imageRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.05,
        duration: 0.6,
        ease: 'power2.out'
      });

      if (img) {
        gsap.to(img, {
          scale: 1.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      });

      if (img) {
        gsap.to(img, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link
      to={to}
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl h-80 flex flex-col justify-end text-white cursor-pointer shadow-lg transform-gpu ${bgClass}`}
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 z-10" />

      {/* Image */}
      {image && (
        <div className="absolute inset-0 z-0">
          <img
            ref={imageRef}
            src={image}
            alt={title}
            className="w-full h-full object-cover transform-gpu"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 p-6 transform-gpu group-hover:-translate-y-2 transition-transform duration-300">
        <h3 className="font-primary text-4xl mb-2">
          {title}
        </h3>
        <p className="font-secondary text-sm opacity-90">
          {subtitle}
        </p>
      </div>

      {/* Hover overlay with CTA */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
        <div className="bg-white text-kelechek-primary px-6 py-3 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          Узнать больше →
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;
