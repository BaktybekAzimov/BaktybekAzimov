import { useRef, useState } from 'react';

const ProductCard3D = ({
  title,
  subtitle,
  price,
  image,
  bgColor = 'bg-white'
}) => {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${bgColor} rounded-2xl p-8 shadow-2xl cursor-pointer relative overflow-hidden`}
      style={{
        transform: transform,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Shine effect */}
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'shine 3s infinite'
        }}
      />

      {/* Content */}
      <div style={{ transform: 'translateZ(50px)' }}>
        {image && (
          <div className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <img src={image} alt={title} className="w-full h-full object-contain" />
          </div>
        )}

        <h3 className="font-primary text-3xl mb-2 text-kelechek-dark">
          {title}
        </h3>
        <p className="font-secondary text-gray-600 mb-4">
          {subtitle}
        </p>
        {price && (
          <div className="font-primary text-2xl text-kelechek-primary">
            {price}
          </div>
        )}
      </div>

      {/* Glowing border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: '0 0 30px rgba(200, 16, 46, 0.5), inset 0 0 20px rgba(200, 16, 46, 0.1)'
        }}
      />
    </div>
  );
};

export default ProductCard3D;
