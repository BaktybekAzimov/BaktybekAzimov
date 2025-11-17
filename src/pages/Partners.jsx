import Button from '../components/ui/Button';

const Partners = () => {
  const partners = [
    { name: 'Bishkek Park Mall', category: 'Розничные сети', country: 'Кыргызстан' },
    { name: 'Globus Hypermarket', category: 'Гипермаркеты', country: 'Кыргызстан' },
    { name: 'Dostuk Market', category: 'Супермаркеты', country: 'Кыргызстан' },
    { name: 'Magnum Kazakhstan', category: 'Розничные сети', country: 'Казахстан' },
    { name: 'Ramstore', category: 'Гипермаркеты', country: 'Узбекистан' },
    { name: 'Carrefour Russia', category: 'Международные сети', country: 'Россия' },
    { name: 'Metro Cash & Carry', category: 'Опт', country: 'Россия' },
    { name: 'Lenta', category: 'Гипермаркеты', country: 'Россия' },
    { name: 'Perekrestok', category: 'Супермаркеты', country: 'Россия' },
    { name: 'Pyaterochka', category: 'Магазины у дома', country: 'Россия' },
    { name: 'Vkusville', category: 'Супермаркеты', country: 'Россия' },
    { name: 'Turkish Airlines Catering', category: 'HoReCa', country: 'Турция' }
  ];

  return (
    <div className="pt-32 pb-20">
      <section className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white py-32 mb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-secondary mb-8">
            Наши партнёры
          </span>
          <h1 className="font-primary text-[clamp(50px,8vw,100px)] mb-6 leading-none">
            ПАРТНЁРЫ
          </h1>
          <p className="font-secondary text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
            Мы работаем с лучшими компаниями мира
          </p>
        </div>
      </section>

      <div className="container-custom">
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-primary text-5xl text-dark-navy mb-6">
              ГЕОГРАФИЯ СОТРУДНИЧЕСТВА
            </h2>
            <p className="font-secondary text-xl text-text-secondary max-w-3xl mx-auto">
              Наша продукция представлена в крупнейших торговых сетях 8 стран
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { country: 'Кыргызстан', stores: '150+', emoji: '🇰🇬' },
              { country: 'Казахстан', stores: '80+', emoji: '🇰🇿' },
              { country: 'Узбекистан', stores: '60+', emoji: '🇺🇿' },
              { country: 'Россия', stores: '200+', emoji: '🇷🇺' },
              { country: 'США', stores: '15+', emoji: '🇺🇸' },
              { country: 'Турция', stores: '25+', emoji: '🇹🇷' },
              { country: 'ОАЭ', stores: '10+', emoji: '🇦🇪' },
              { country: 'Китай', stores: '30+', emoji: '🇨🇳' }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 text-center border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:-translate-y-2">
                <div className="text-6xl mb-3">{item.emoji}</div>
                <h3 className="font-primary text-2xl text-dark-navy mb-2">{item.country}</h3>
                <p className="font-secondary text-purple-600 font-bold text-xl">{item.stores}</p>
                <p className="font-secondary text-gray-600 text-sm">точек продаж</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-primary text-5xl text-dark-navy mb-6">
              КЛЮЧЕВЫЕ ПАРТНЁРЫ
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-primary-cyan"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {partner.name.charAt(0)}
                </div>
                <h3 className="font-primary text-xl text-dark-navy mb-2">
                  {partner.name}
                </h3>
                <p className="font-secondary text-gray-600 mb-1 text-sm">
                  {partner.category}
                </p>
                <p className="font-secondary text-primary-blue text-sm font-semibold">
                  {partner.country}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-12 md:p-16">
          <div className="text-center mb-12">
            <h2 className="font-primary text-5xl text-dark-navy mb-6">
              УСЛОВИЯ СОТРУДНИЧЕСТВА
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🤝',
                title: 'B2B партнёрство',
                desc: 'Выгодные условия для розничных сетей и оптовиков'
              },
              {
                icon: '🚚',
                title: 'Логистика',
                desc: 'Собственная служба доставки и складская сеть'
              },
              {
                icon: '📊',
                title: 'Маркетинг',
                desc: 'Поддержка продаж и совместные маркетинговые программы'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="font-primary text-2xl text-dark-navy mb-4">
                  {item.title}
                </h3>
                <p className="font-secondary text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-3xl p-12 md:p-16">
          <h2 className="font-primary text-5xl mb-6">
            СТАНЬТЕ НАШИМ ПАРТНЁРОМ
          </h2>
          <p className="font-secondary text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Заинтересованы в сотрудничестве? Свяжитесь с нашим отделом B2B
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="large"
              variant="outline"
              onClick={() => window.location.href = '/contacts'}
            >
              Связаться с нами
            </Button>
            <Button
              size="large"
              variant="secondary"
              onClick={() => window.location.href = 'mailto:b2b@kelechek.kg'}
            >
              b2b@kelechek.kg
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Partners;
