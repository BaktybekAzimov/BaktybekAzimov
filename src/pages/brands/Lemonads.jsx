import { useState } from 'react';
import Button from '../../components/ui/Button';
import ProductModal from '../../components/ui/ProductModal';
import WaterDrops from '../../components/effects/WaterDrops';

const Lemonads = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const lemonads = [
    {
      id: 1,
      name: 'Классический Лимонад',
      subtitle: 'Традиционный вкус',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-yellow-300 to-yellow-500',
      modalColor: 'from-yellow-400 via-yellow-500 to-yellow-600',
      textColor: 'text-yellow-900',
      description: 'Классический лимонад с натуральным вкусом лимона. Освежающий напиток для жаркого дня.',
      characteristics: [
        'Натуральный лимонный вкус',
        'Газированный',
        'Объём: 0.5л, 1л, 1.5л',
        'Без искусственных красителей',
        'Содержит сахар',
        'Срок годности: 6 месяцев'
      ],
      benefits: [
        'Освежающий вкус',
        'Быстро утоляет жажду',
        'Идеален для пикников',
        'Отличное дополнение к еде'
      ]
    },
    {
      id: 2,
      name: 'Буратино',
      subtitle: 'Апельсиновый',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-orange-400 to-orange-600',
      modalColor: 'from-orange-500 via-orange-600 to-orange-700',
      textColor: 'text-orange-900',
      description: 'Яркий апельсиновый напиток с насыщенным цитрусовым вкусом. Любимец детей и взрослых!',
      characteristics: [
        'Апельсиновый вкус',
        'Газированный',
        'Объём: 0.5л, 1л, 1.5л, 2л',
        'Яркий оранжевый цвет',
        'Содержит сахар',
        'Срок годности: 6 месяцев'
      ],
      benefits: [
        'Насыщенный цитрусовый вкус',
        'Заряжает энергией',
        'Популярен у детей',
        'Отличный микс для коктейлей'
      ]
    },
    {
      id: 3,
      name: 'Тархун',
      subtitle: 'Эстрагон',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      modalColor: 'from-green-500 via-green-600 to-green-700',
      textColor: 'text-green-900',
      description: 'Легендарный зелёный напиток с экстрактом эстрагона. Уникальный травянистый вкус!',
      characteristics: [
        'Экстракт эстрагона',
        'Газированный',
        'Объём: 0.5л, 1л, 1.5л, 2л',
        'Натуральный зелёный цвет',
        'Содержит сахар',
        'Срок годности: 6 месяцев'
      ],
      benefits: [
        'Уникальный вкус эстрагона',
        'Освежает в жару',
        'Традиционный напиток СССР',
        'Подходит к мясным блюдам'
      ]
    },
    {
      id: 4,
      name: 'Дюшес',
      subtitle: 'Грушевый',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-amber-300 to-amber-500',
      modalColor: 'from-amber-400 via-amber-500 to-amber-600',
      textColor: 'text-amber-900',
      description: 'Нежный грушевый напиток с натуральным фруктовым вкусом. Любимая классика!',
      characteristics: [
        'Грушевый вкус',
        'Газированный',
        'Объём: 0.5л, 1л, 1.5л',
        'Натуральный аромат',
        'Содержит сахар',
        'Срок годности: 6 месяцев'
      ],
      benefits: [
        'Мягкий грушевый вкус',
        'Нравится всем возрастам',
        'Идеален для семейных праздников',
        'Отличное сочетание с десертами'
      ]
    },
    {
      id: 5,
      name: 'K+ Витамины',
      subtitle: 'Лайм-Лимон',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-lime-400 to-lime-600',
      modalColor: 'from-lime-500 via-lime-600 to-green-600',
      textColor: 'text-lime-900',
      description: 'Энергетический напиток с витаминами и вкусом лайма-лимона. Идеален для мохито!',
      characteristics: [
        'Витамины группы B',
        'Лайм-лимон вкус',
        'Газированный',
        'Объём: 0.5л, 1л',
        'Содержит кофеин',
        'Срок годности: 9 месяцев'
      ],
      benefits: [
        'Заряжает энергией',
        'Витамины группы B',
        'Идеален для мохито',
        'Повышает тонус',
        'Улучшает концентрацию'
      ]
    },
    {
      id: 6,
      name: 'Asia-Cola',
      subtitle: 'Кола',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-gray-800 to-gray-900',
      modalColor: 'from-gray-800 via-gray-900 to-black',
      textColor: 'text-white',
      description: 'Классический вкус колы от Азии! Насыщенный темный напиток с характерным вкусом.',
      characteristics: [
        'Классический вкус колы',
        'Сильногазированный',
        'Объём: 0.5л, 1л, 1.5л, 2л',
        'Содержит кофеин',
        'Содержит сахар',
        'Срок годности: 9 месяцев'
      ],
      benefits: [
        'Бодрит и тонизирует',
        'Классический вкус колы',
        'Отлично сочетается с едой',
        'Популярен во всём мире'
      ]
    },
    {
      id: 7,
      name: 'Гранат',
      subtitle: 'Насыщенный',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-red-600 to-red-800',
      modalColor: 'from-red-600 via-red-700 to-red-900',
      textColor: 'text-red-100',
      description: 'Насыщенный гранатовый напиток с богатым фруктовым вкусом и ярким цветом.',
      characteristics: [
        'Гранатовый вкус',
        'Газированный',
        'Объём: 0.5л, 1л, 1.5л',
        'Натуральный красный цвет',
        'Содержит сахар',
        'Срок годности: 6 месяцев'
      ],
      benefits: [
        'Насыщенный фруктовый вкус',
        'Богатый витаминами',
        'Красивый рубиновый цвет',
        'Экзотический вкус'
      ]
    },
    {
      id: 8,
      name: 'Ситро',
      subtitle: 'Цитрусовый',
      volume: '0.5л',
      type: 'Газированный напиток',
      color: 'bg-gradient-to-br from-yellow-400 to-orange-400',
      modalColor: 'from-yellow-500 via-orange-500 to-orange-600',
      textColor: 'text-yellow-900',
      description: 'Освежающий цитрусовый напиток с нотками лимона и апельсина. Летний хит!',
      characteristics: [
        'Цитрусовый микс',
        'Газированный',
        'Объём: 0.5л, 1л, 1.5л',
        'Натуральный аромат',
        'Содержит сахар',
        'Срок годности: 6 месяцев'
      ],
      benefits: [
        'Освежает в жару',
        'Микс цитрусовых вкусов',
        'Идеален для лета',
        'Витамин C'
      ]
    }
  ];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-32 pb-20 relative">
      {/* Water drops effect */}
      <WaterDrops count={35} color="rgba(255, 200, 0, 0.4)" />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-yellow-300 via-green-400 to-orange-400 text-white py-32 mb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <h1 className="font-primary text-[clamp(60px,8vw,120px)] mb-6 drop-shadow-2xl leading-none">
            ЛИМОНАДЫ
          </h1>
          <p className="font-secondary text-2xl md:text-4xl mb-12 max-w-3xl mx-auto drop-shadow-lg">
            Яркие вкусы для яркой жизни
            <br />
            <span className="text-yellow-100">
              8 вкусов на любой вкус!
            </span>
          </p>
          <Button size="large" variant="outline">
            Где купить
          </Button>
        </div>
      </section>

      <div className="container-custom">
        {/* Description */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-yellow-400/20 text-yellow-700 rounded-full text-sm font-secondary mb-6">
              Газированные напитки
            </span>
            <h2 className="font-primary text-5xl text-dark-navy mb-6">
              ДЛЯ КАЖДОГО МОМЕНТА
            </h2>
            <p className="font-secondary text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Линейка ярких газированных напитков с традиционными и современными вкусами.
              От классического лимонада до K+ Витамины - идеально для мохито!
              Asia-Cola - наш ответ мировым брендам!
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lemonads.map((drink) => (
              <div
                key={drink.id}
                onClick={() => handleProductClick(drink)}
                className={`${drink.color} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative overflow-hidden`}
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <h3 className={`font-primary text-3xl ${drink.textColor} mb-2`}>
                    {drink.name}
                  </h3>
                  <p className={`font-secondary text-lg ${drink.textColor} opacity-90 mb-6`}>
                    {drink.subtitle}
                  </p>

                  <div className={`text-sm ${drink.textColor} opacity-75 mb-4`}>
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      <span>Газированный</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>0.5л, 1л, 1.5л</span>
                    </div>
                  </div>

                  <div className={`${drink.textColor} font-secondary text-sm group-hover:text-white transition-colors flex items-center mt-4`}>
                    Подробнее
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Corner badge */}
                <div className={`absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ${drink.textColor} font-bold text-sm`}>
                  0.5л
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-24 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-12 md:p-16">
          <div className="text-center mb-12">
            <h2 className="font-primary text-5xl text-dark-navy mb-6">
              ПОЧЕМУ НАШИ ЛИМОНАДЫ?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🍋',
                title: 'Натуральные вкусы',
                desc: 'Используем только качественные ароматизаторы и натуральные экстракты'
              },
              {
                icon: '✨',
                title: '8 вкусов',
                desc: 'Широкая линейка от классики до современных энергетиков'
              },
              {
                icon: '💰',
                title: 'Доступная цена',
                desc: 'Отличное качество по справедливой цене'
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
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Lemonads;
