import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

const ProductModal = ({ isOpen, onClose, product }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const heroRef = useRef(null);
  const particlesRef = useRef([]);

  // Get modal color from product
  const getModalColors = () => {
    if (product?.modalColor) {
      return product.modalColor;
    }
    if (product?.color) {
      return product.color;
    }
    // Default gradient
    return 'from-primary-blue via-primary-cyan to-dark-navy';
  };

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // WOW Animation Sequence
      const tl = gsap.timeline();

      // 1. Overlay fade in with blur
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out'
      });

      // 2. Content dramatic entrance
      tl.from(contentRef.current, {
        opacity: 0,
        scale: 0.6,
        rotationX: -45,
        y: 100,
        duration: 0.8,
        ease: 'elastic.out(1, 0.6)',
        transformPerspective: 1000
      }, '-=0.2');

      // 3. Hero section zoom
      tl.from(heroRef.current, {
        scale: 1.3,
        duration: 1,
        ease: 'power3.out'
      }, '-=0.7');

      // 4. Particles explosion
      if (particlesRef.current.length > 0) {
        tl.from(particlesRef.current, {
          scale: 0,
          opacity: 0,
          stagger: {
            each: 0.02,
            from: 'center'
          },
          duration: 0.6,
          ease: 'back.out(2)'
        }, '-=0.8');
      }

      // 5. Content sections stagger
      tl.from('.modal-section', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.5');

    } else {
      // Unlock body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    // Dramatic exit animation
    const tl = gsap.timeline({
      onComplete: onClose
    });

    tl.to('.modal-section', {
      opacity: 0,
      y: -20,
      stagger: 0.05,
      duration: 0.2,
      ease: 'power2.in'
    });

    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.8,
      rotationX: 45,
      y: -50,
      duration: 0.4,
      ease: 'back.in(1.5)',
      transformPerspective: 1000
    }, '-=0.1');

    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.2');
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!isOpen || !product) return null;

  const modalColors = getModalColors();

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ perspective: '1200px' }}
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/85 backdrop-blur-md opacity-0"
        onClick={handleOverlayClick}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:scale-110 transition-all duration-300 group"
          aria-label="Закрыть"
        >
          <svg
            className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Hero Image with Dynamic Color */}
        <div
          ref={heroRef}
          className={`relative h-96 bg-gradient-to-br ${modalColors} overflow-hidden`}
        >
          {/* Animated particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                ref={el => particlesRef.current[i] = el}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Light rays */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-white to-transparent origin-top"
                style={{
                  transform: `translateX(-50%) rotate(${i * 45}deg)`,
                  opacity: 0.1 - i * 0.01,
                  animation: `rotate ${10 + i}s linear infinite`
                }}
              />
            ))}
          </div>

          {/* Product Display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center relative">
              {/* Background number */}
              <div className="font-primary text-[180px] opacity-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  textShadow: '0 0 60px rgba(255,255,255,0.3)',
                  animation: 'pulse 3s ease-in-out infinite'
                }}
              >
                27
              </div>

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="relative z-10 max-h-72 object-contain drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))',
                    animation: 'floatProduct 4s ease-in-out infinite'
                  }}
                />
              ) : (
                <div className="relative z-10 w-40 h-72 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30"
                  style={{ animation: 'floatProduct 4s ease-in-out infinite' }}
                >
                  <span className="font-primary text-7xl text-white drop-shadow-2xl">
                    {product.volume}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Title */}
          <div className="mb-8 modal-section">
            <h2 className="font-primary text-5xl text-dark-navy mb-3 bg-clip-text text-transparent bg-gradient-to-r from-dark-navy to-primary-blue">
              {product.name}
            </h2>
            {product.subtitle && (
              <p className="font-secondary text-2xl text-text-secondary">
                {product.subtitle}
              </p>
            )}
          </div>

          {/* Main Info Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-10 modal-section">
            {/* Volume */}
            <div className={`bg-gradient-to-br ${modalColors.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}/10 rounded-2xl p-6 border-2 border-transparent hover:border-current transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
              <div className="text-sm font-secondary text-text-secondary mb-2 uppercase tracking-wider">
                Объём
              </div>
              <div className={`font-primary text-5xl bg-clip-text text-transparent bg-gradient-to-r ${modalColors}`}>
                {product.volume}
              </div>
            </div>

            {/* Type */}
            <div className={`bg-gradient-to-br ${modalColors}/5 rounded-2xl p-6 border-2 border-transparent hover:border-current transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
              <div className="text-sm font-secondary text-text-secondary mb-2 uppercase tracking-wider">
                Тип
              </div>
              <div className="font-secondary text-xl text-dark-navy font-semibold">
                {product.type || 'Минеральная вода'}
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-10 modal-section">
              <h3 className="font-primary text-3xl text-dark-navy mb-4">
                Описание
              </h3>
              <p className="font-secondary text-lg text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Characteristics */}
          {product.characteristics && product.characteristics.length > 0 && (
            <div className="mb-10 modal-section">
              <h3 className="font-primary text-3xl text-dark-navy mb-6">
                Характеристики
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.characteristics.map((char, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gradient-to-br hover:from-gray-100 hover:to-gray-50 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-gray-100"
                  >
                    <div className={`w-3 h-3 bg-gradient-to-br ${modalColors} rounded-full mt-1.5 flex-shrink-0 shadow-lg`} />
                    <span className="font-secondary text-gray-700">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-10 modal-section">
              <h3 className="font-primary text-3xl text-dark-navy mb-6">
                Польза
              </h3>
              <div className="space-y-3">
                {product.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 p-5 rounded-xl bg-green-50 hover:bg-green-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-green-200"
                  >
                    <svg
                      className="w-7 h-7 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-secondary text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-gray-100 modal-section">
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => {
                  window.location.href = '/where-to-buy';
                }, 400);
              }}
              className={`flex-1 bg-gradient-to-r ${modalColors} text-white font-secondary text-lg py-5 px-8 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold`}
            >
              Где купить
            </button>
            <button
              onClick={() => {
                handleClose();
                setTimeout(() => {
                  window.location.href = '/contacts';
                }, 400);
              }}
              className={`flex-1 bg-white border-2 bg-gradient-to-r ${modalColors} bg-clip-text text-transparent font-secondary text-lg py-5 px-8 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold`}
              style={{
                borderImage: `linear-gradient(to right, var(--tw-gradient-stops)) 1`
              }}
            >
              Связаться с нами
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.6;
          }
        }

        @keyframes floatProduct {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(2deg);
          }
        }

        @keyframes rotate {
          from {
            transform: translateX(-50%) rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.15;
            transform: translate(-50%, -50%) scale(1.05);
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default ProductModal;
