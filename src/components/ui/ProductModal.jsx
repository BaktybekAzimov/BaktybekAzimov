import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';

const ProductModal = ({ isOpen, onClose, product }) => {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      document.body.style.overflow = 'hidden';

      // Animate in
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(contentRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.5)'
      }, '-=0.2');
    } else {
      // Unlock body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    // Animate out
    const tl = gsap.timeline({
      onComplete: onClose
    });
    tl.to(contentRef.current, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.in'
    })
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    }, '-=0.1');
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      handleClose();
    }
  };

  if (!isOpen || !product) return null;

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0"
        onClick={handleOverlayClick}
      />

      {/* Modal Content */}
      <div
        ref={contentRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl opacity-0"
        style={{ transform: 'translateY(50px) scale(0.9)' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 transition-colors group"
          aria-label="Закрыть"
        >
          <svg
            className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors"
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

        {/* Hero Image */}
        <div className="relative h-80 bg-gradient-to-br from-primary-blue via-primary-cyan to-dark-navy overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="font-primary text-[120px] opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                27
              </div>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="relative z-10 max-h-64 object-contain drop-shadow-2xl"
                />
              ) : (
                <div className="relative z-10 w-32 h-64 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                  <span className="font-primary text-6xl text-white">
                    {product.volume}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Title */}
          <div className="mb-8">
            <h2 className="font-primary text-5xl text-dark-navy mb-3">
              {product.name}
            </h2>
            {product.subtitle && (
              <p className="font-secondary text-xl text-text-secondary">
                {product.subtitle}
              </p>
            )}
          </div>

          {/* Main Info Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Volume */}
            <div className="bg-gradient-to-br from-primary-blue/10 to-primary-cyan/10 rounded-2xl p-6">
              <div className="text-sm font-secondary text-text-secondary mb-2">
                Объём
              </div>
              <div className="font-primary text-4xl text-primary-blue">
                {product.volume}
              </div>
            </div>

            {/* Type */}
            <div className="bg-gradient-to-br from-primary-cyan/10 to-primary-blue/10 rounded-2xl p-6">
              <div className="text-sm font-secondary text-text-secondary mb-2">
                Тип
              </div>
              <div className="font-secondary text-2xl text-dark-navy">
                {product.type || 'Минеральная вода'}
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mb-10">
              <h3 className="font-primary text-2xl text-dark-navy mb-4">
                Описание
              </h3>
              <p className="font-secondary text-lg text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Characteristics */}
          {product.characteristics && product.characteristics.length > 0 && (
            <div className="mb-10">
              <h3 className="font-primary text-2xl text-dark-navy mb-6">
                Характеристики
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {product.characteristics.map((char, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-primary-cyan rounded-full mt-2 flex-shrink-0" />
                    <span className="font-secondary text-gray-700">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {product.benefits && product.benefits.length > 0 && (
            <div className="mb-10">
              <h3 className="font-primary text-2xl text-dark-navy mb-6">
                Польза
              </h3>
              <div className="space-y-3">
                {product.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <svg
                      className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-secondary text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                handleClose();
                // Navigate to where to buy
                window.location.href = '/where-to-buy';
              }}
              className="flex-1 bg-gradient-to-r from-primary-blue to-primary-cyan text-white font-secondary text-lg py-4 px-8 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Где купить
            </button>
            <button
              onClick={() => {
                handleClose();
                // Navigate to contacts
                window.location.href = '/contacts';
              }}
              className="flex-1 bg-white border-2 border-primary-blue text-primary-blue font-secondary text-lg py-4 px-8 rounded-xl hover:bg-primary-blue hover:text-white transition-all duration-300"
            >
              Связаться с нами
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
