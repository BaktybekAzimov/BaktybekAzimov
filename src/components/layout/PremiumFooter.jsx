import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const PremiumFooter = () => {
  const footerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

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
  }, []);

  return (
    <footer ref={footerRef} className="relative bg-dark-navy text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-blue rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative container-custom pt-20 pb-12">
        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: О компании */}
          <div className="footer-item">
            <h3 className="font-primary text-4xl mb-6 text-primary-cyan">KELECHEK</h3>
            <p className="font-secondary text-white/80 mb-4 leading-relaxed text-body">
              ЗАО «Келечек» — производитель премиальной минеральной воды и напитков с 1991 года.
            </p>
            <p className="font-secondary text-white/60 italic mb-6 text-small leading-relaxed">
              "Вода — это самая важная вещь на свете. Мы все состоим из воды, и вода — это жизнь."
            </p>

            {/* Social Links */}
            <div className="flex space-x-3">
              <a
                href="https://facebook.com/kelechek"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-primary-cyan hover:scale-110 transition-all duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://instagram.com/kelechek_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-primary-cyan hover:scale-110 transition-all duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://youtube.com/@kelechek"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-primary-cyan hover:scale-110 transition-all duration-300"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              <a
                href="https://wa.me/996555123456"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-primary-cyan hover:scale-110 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>

              <a
                href="https://t.me/kelechek_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-primary-cyan hover:scale-110 transition-all duration-300"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Продукция */}
          <div className="footer-item">
            <h4 className="font-primary text-2xl mb-6 text-white">ПРОДУКЦИЯ</h4>
            <div className="space-y-4 font-secondary text-body">
              {/* Минеральные воды */}
              <div>
                <h5 className="text-primary-cyan font-semibold mb-2">Минеральные воды</h5>
                <ul className="space-y-2 text-white/70 text-small">
                  <li><Link to="/brands/kelechek" className="hover:text-white transition-colors">Жалал-Абад 27 (KELECHEK)</Link></li>
                  <li><Link to="/brands/kelechek" className="hover:text-white transition-colors">Кара-Шоро</Link></li>
                </ul>
              </div>

              {/* Питьевая вода */}
              <div>
                <h5 className="text-primary-cyan font-semibold mb-2">Питьевая вода</h5>
                <ul className="space-y-2 text-white/70 text-small">
                  <li><Link to="/brands/gimalai" className="hover:text-white transition-colors">Гималай</Link></li>
                  <li><Link to="/brands/adygene" className="hover:text-white transition-colors">Адыгене (классический, лимон, мята)</Link></li>
                </ul>
              </div>

              {/* Лимонады */}
              <div>
                <h5 className="text-primary-cyan font-semibold mb-2">Лимонады и напитки</h5>
                <ul className="space-y-2 text-white/70 text-small">
                  <li><Link to="/brands/lemonads" className="hover:text-white transition-colors">Классический, Тархун, Груша</Link></li>
                  <li><Link to="/brands/lemonads" className="hover:text-white transition-colors">Гранат, Ситро, Буратино</Link></li>
                  <li><Link to="/brands/lemonads" className="hover:text-white transition-colors">К+ Витамины, Азия-Кола</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 3: Компания */}
          <div className="footer-item">
            <h4 className="font-primary text-2xl mb-6 text-white">КОМПАНИЯ</h4>
            <ul className="space-y-3 font-secondary text-white/70 text-body">
              <li><Link to="/about" className="hover:text-white transition-colors">О компании</Link></li>
              <li><Link to="/about#mission" className="hover:text-white transition-colors">Наша миссия</Link></li>
              <li><Link to="/about#values" className="hover:text-white transition-colors">Наши ценности</Link></li>
              <li><Link to="/about#production" className="hover:text-white transition-colors">Этапы производства</Link></li>
              <li><Link to="/about#benefits" className="hover:text-white transition-colors">Полезные свойства</Link></li>
              <li><Link to="/about#certificates" className="hover:text-white transition-colors">Сертификаты и качество</Link></li>
              <li><Link to="/about#export" className="hover:text-white transition-colors">География экспорта</Link></li>
              <li><Link to="/partners" className="hover:text-white transition-colors">Для бизнеса (оптовикам)</Link></li>
              <li><Link to="/contacts" className="hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Column 4: Контакты */}
          <div className="footer-item">
            <h4 className="font-primary text-2xl mb-6 text-white">КОНТАКТЫ</h4>
            <ul className="space-y-4 font-secondary text-white/80 text-body">
              {/* Адрес */}
              <li className="flex items-start">
                <span className="text-primary-cyan mr-2 mt-1">📍</span>
                <div className="text-small">
                  <strong className="text-white block mb-1">Адрес:</strong>
                  Кыргызская Республика<br />
                  Жалал-Абадская область<br />
                  г. Жалал-Абад<br />
                  ул. Промышленная 15
                </div>
              </li>

              {/* Телефоны */}
              <li className="flex items-start">
                <span className="text-primary-cyan mr-2 mt-1">📞</span>
                <div className="text-small">
                  <strong className="text-white block mb-1">Региональные номера:</strong>
                  <a href="tel:+996372251234" className="hover:text-white transition-colors block">
                    +996 (3722) 5-12-34 <span className="text-white/50">(Жалал-Абад)</span>
                  </a>
                  <a href="tel:+996312000000" className="hover:text-white transition-colors block">
                    +996 (312) XX-XX-XX <span className="text-white/50">(Бишкек)</span>
                  </a>
                  <a href="tel:+996322000000" className="hover:text-white transition-colors block">
                    +996 (322) XX-XX-XX <span className="text-white/50">(Ош)</span>
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start">
                <span className="text-primary-cyan mr-2 mt-1">📧</span>
                <div className="text-small">
                  <strong className="text-white block mb-1">Email:</strong>
                  <a href="mailto:info@kelechek.kg" className="hover:text-white transition-colors">
                    info@kelechek.kg
                  </a>
                </div>
              </li>

              {/* Время работы */}
              <li className="flex items-start">
                <span className="text-primary-cyan mr-2 mt-1">🕒</span>
                <div className="text-small">
                  <strong className="text-white block mb-1">Время работы:</strong>
                  Пн-Пт: 9:00-18:00<br />
                  Сб: 9:00-14:00<br />
                  Вс: Выходной
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-item pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 font-secondary text-white/50 text-small">
            <p>&copy; 2024 ЗАО "Келечек". Все права защищены.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Условия использования
              </Link>
              <Link to="/sitemap" className="hover:text-white transition-colors">
                Карта сайта
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary-cyan text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl z-50 hover:bg-primary-blue"
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
