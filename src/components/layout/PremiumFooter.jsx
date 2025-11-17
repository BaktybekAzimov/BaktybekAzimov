import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const PremiumFooter = () => {
  const footerRef = useRef(null);
  const waveRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const footer = footerRef.current;
    const wave = waveRef.current;
    const content = contentRef.current;

    if (!footer || !wave || !content) return;

    // Animate wave on scroll
    gsap.to(wave, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: footer,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });

    // Animate content reveal
    const elements = gsap.utils.toArray('.footer-item');
    gsap.from(elements, {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: content,
        start: 'top 80%'
      }
    });

    // Continuous wave animation
    gsap.to('.wave-path', {
      attr: {
        d: 'M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
      },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

  }, []);

  const products = [
    { name: 'KELECHEK №27', path: '/products/kelechek' },
    { name: 'ADYGENE', path: '/products/adygene' },
    { name: 'GIMALAI', path: '/products/gimalai' },
    { name: 'ЛИМОНАДЫ', path: '/products/lemonads' }
  ];

  const company = [
    { name: 'О компании', path: '/about' },
    { name: 'Партнёрам', path: '/partners' },
    { name: 'Где купить', path: '/where-to-buy' },
    { name: 'Контакты', path: '/contacts' }
  ];

  return (
    <footer ref={footerRef} className="relative bg-kelechek-dark text-white overflow-hidden">
      {/* Animated Wave */}
      <div ref={waveRef} className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            className="wave-path"
            fill="rgba(200, 16, 46, 0.3)"
            d="M0,64L48,69.3C96,75,192,85,288,90.7C384,96,480,96,576,90.7C672,85,768,75,864,80C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kelechek-primary rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative container-custom pt-32 pb-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="footer-item">
            <h3 className="font-primary text-4xl mb-6 text-kelechek-primary">KELECHEK</h3>
            <p className="font-secondary text-white/70 mb-6 leading-relaxed">
              С 1991 года производим премиальную минеральную воду высочайшего качества в сердце Кыргызстана.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'instagram', 'youtube'].map((social, index) => (
                <a
                  key={index}
                  href={`#${social}`}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-kelechek-primary hover:scale-110 transition-all duration-300"
                  aria-label={social}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="footer-item">
            <h4 className="font-primary text-2xl mb-6">ПРОДУКЦИЯ</h4>
            <ul className="space-y-3">
              {products.map((product, index) => (
                <li key={index}>
                  <Link
                    to={product.path}
                    className="font-secondary text-white/70 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer-item">
            <h4 className="font-primary text-2xl mb-6">КОМПАНИЯ</h4>
            <ul className="space-y-3">
              {company.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="font-secondary text-white/70 hover:text-white hover:translate-x-2 inline-block transition-all duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-item">
            <h4 className="font-primary text-2xl mb-6">КОНТАКТЫ</h4>
            <ul className="space-y-4 font-secondary text-white/70">
              <li className="flex items-start">
                <svg className="w-6 h-6 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Кыргызстан, г. Бишкек,<br />ул. Производственная, 1</span>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+996312123456" className="hover:text-white transition-colors">
                  +996 (312) 12-34-56
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@kelechek.kg" className="hover:text-white transition-colors">
                  info@kelechek.kg
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-item mb-16 max-w-2xl mx-auto text-center">
          <h4 className="font-primary text-3xl mb-4">ПОДПИШИТЕСЬ НА НОВОСТИ</h4>
          <p className="font-secondary text-white/70 mb-6">
            Получайте информацию о новинках и специальных предложениях
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Ваш email"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-kelechek-primary transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-full bg-kelechek-primary text-white font-semibold hover:bg-kelechek-primary/90 hover:scale-105 transition-all duration-300"
            >
              Подписаться
            </button>
          </form>
        </div>

        {/* Bottom Bar */}
        <div className="footer-item pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-secondary text-white/50 text-sm">
            <p>&copy; 2025 KELECHEK. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-white transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-kelechek-primary text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl z-50"
        aria-label="Scroll to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
};

export default PremiumFooter;
