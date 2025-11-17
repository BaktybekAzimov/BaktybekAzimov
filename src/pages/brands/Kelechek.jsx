import { useState } from 'react';
import Button from '../../components/ui/Button';
import ProductModal from '../../components/ui/ProductModal';

const Kelechek = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    {
      id: 1,
      name: 'KELECHEK №27',
      subtitle: 'Классическая',
      volume: '0.5л',
      type: 'Лечебно-столовая минеральная вода',
      description: 'Премиальная лечебно-столовая минеральная вода из уникального источника №27. Идеальна для индивидуального использования - удобный формат для работы, прогулок и путешествий.',
      characteristics: [
        'Источник №27, Жалал-Абад, Кыргызстан',
        'Сертифицирована для лечения ЖКТ',
        'Минерализация: 2.5-3.5 г/л',
        'pH уровень: 7.2-7.8',
        'Газированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Улучшает пищеварение',
        'Нормализует кислотность желудка',
        'Способствует выведению токсинов',
        'Восполняет баланс минералов',
        'Рекомендована при гастрите и язве'
      ],
      image: null
    },
    {
      id: 2,
      name: 'KELECHEK №27',
      subtitle: 'Семейная',
      volume: '1л',
      type: 'Лечебно-столовая минеральная вода',
      description: 'Семейный формат премиальной воды KELECHEK №27. Оптимальный объём для домашнего использования и семейных ужинов.',
      characteristics: [
        'Источник №27, Жалал-Абад, Кыргызстан',
        'Сертифицирована для лечения ЖКТ',
        'Минерализация: 2.5-3.5 г/л',
        'pH уровень: 7.2-7.8',
        'Газированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Улучшает пищеварение',
        'Нормализует кислотность желудка',
        'Способствует выведению токсинов',
        'Восполняет баланс минералов',
        'Рекомендована при гастрите и язве'
      ],
      image: null
    },
    {
      id: 3,
      name: 'KELECHEK №27',
      subtitle: 'Стандартная',
      volume: '1.5л',
      type: 'Лечебно-столовая минеральная вода',
      description: 'Самый популярный формат KELECHEK №27. Идеален для ежедневного использования дома и в офисе.',
      characteristics: [
        'Источник №27, Жалал-Абад, Кыргызстан',
        'Сертифицирована для лечения ЖКТ',
        'Минерализация: 2.5-3.5 г/л',
        'pH уровень: 7.2-7.8',
        'Газированная и негазированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Улучшает пищеварение',
        'Нормализует кислотность желудка',
        'Способствует выведению токсинов',
        'Восполняет баланс минералов',
        'Рекомендована при гастрите и язве'
      ],
      image: null
    },
    {
      id: 4,
      name: 'KELECHEK №27',
      subtitle: 'Офисная',
      volume: '19л',
      type: 'Лечебно-столовая минеральная вода',
      description: 'Большой формат для офисов и коммерческих помещений. Подходит для кулеров и диспенсеров.',
      characteristics: [
        'Источник №27, Жалал-Абад, Кыргызстан',
        'Сертифицирована для лечения ЖКТ',
        'Минерализация: 2.5-3.5 г/л',
        'pH уровень: 7.2-7.8',
        'Негазированная',
        'Срок годности: 6 месяцев',
        'Многоразовая тара'
      ],
      benefits: [
        'Экономичное решение для офиса',
        'Улучшает продуктивность сотрудников',
        'Способствует здоровому образу жизни',
        'Удобная доставка и сервис',
        'Экологичная многоразовая упаковка'
      ],
      image: null
    }
  ];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-dark-navy via-primary-blue to-primary-cyan text-white py-32 mb-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[120px]" />
        </div>

        {/* Number 27 watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <span className="font-primary text-[400px] leading-none">27</span>
        </div>

        <div className="container-custom text-center relative z-10">
          <h1 className="font-primary text-[clamp(60px,8vw,120px)] mb-6 leading-none">
            KELECHEK №27
          </h1>
          <p className="font-secondary text-2xl md:text-4xl mb-12 max-w-4xl mx-auto leading-relaxed">
            Премиальная лечебно-столовая минеральная вода из источника №27
            <br />
            <span className="text-primary-cyan">
              Жалал-Абад, Кыргызстан с 1991 года
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
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary-cyan/10 text-primary-cyan rounded-full text-sm font-secondary mb-6">
                Флагманский продукт
              </span>
              <h2 className="font-primary text-5xl text-dark-navy mb-6">
                ЛЕГЕНДА КЫРГЫЗСТАНА
              </h2>
              <p className="font-secondary text-xl text-gray-700 mb-6 leading-relaxed">
                KELECHEK №27 - это премиальная лечебно-столовая минеральная вода из уникального
                источника №27 в Жалал-Абаде, Кыргызстан. Более 30 лет наша вода помогает людям
                заботиться о своем здоровье.
              </p>
              <p className="font-secondary text-xl text-gray-700 mb-6 leading-relaxed">
                Сертифицирована для лечения заболеваний желудочно-кишечного тракта.
                Идеальный баланс минералов для ежедневного употребления.
              </p>
              <p className="font-secondary text-xl text-gray-700 leading-relaxed">
                Экспортируется в Казахстан, Узбекистан, Россию и США. Доверие миллионов людей по всему миру.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-blue/5 to-primary-cyan/5 rounded-3xl p-10 border-2 border-primary-cyan/20">
              <h3 className="font-primary text-3xl text-dark-navy mb-8">КЛЮЧЕВЫЕ ХАРАКТЕРИСТИКИ</h3>
              <ul className="space-y-5">
                {[
                  'Лечебно-столовая минеральная вода',
                  'Источник №27, Жалал-Абад, Кыргызстан',
                  'Сертифицирована для лечения ЖКТ',
                  'Минерализация 2.5-3.5 г/л',
                  'pH уровень 7.2-7.8',
                  'Премиум качество с 1991 года'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center group">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-blue to-primary-cyan rounded-full mr-4 group-hover:scale-125 transition-transform" />
                    <span className="font-secondary text-lg text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-blue/10 text-primary-blue rounded-full text-sm font-secondary mb-6">
              Наша линейка
            </span>
            <h2 className="font-primary text-6xl text-dark-navy mb-6">
              ФОРМАТЫ
            </h2>
            <p className="font-secondary text-xl text-text-secondary max-w-3xl mx-auto">
              Выберите удобный формат для любой ситуации - от индивидуального использования до офисных решений
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="group cursor-pointer bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-transparent hover:border-primary-cyan relative overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/0 to-primary-cyan/0 group-hover:from-primary-blue/5 group-hover:to-primary-cyan/10 transition-all duration-500 rounded-2xl" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Volume */}
                  <div className="font-primary text-7xl text-primary-blue mb-4 group-hover:scale-110 transition-transform duration-300">
                    {product.volume}
                  </div>

                  {/* Name */}
                  <div className="font-secondary text-gray-600 mb-6 text-lg">
                    {product.subtitle}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-primary-cyan" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Источник №27</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-primary-cyan" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Лечебная</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-primary-blue font-secondary text-sm group-hover:text-primary-cyan transition-colors flex items-center">
                    Подробнее
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Corner badge */}
                <div className="absolute top-4 right-4 w-12 h-12 bg-primary-cyan/10 rounded-full flex items-center justify-center group-hover:bg-primary-cyan group-hover:text-white transition-all duration-300">
                  <span className="font-primary text-sm">27</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-24 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-12 md:p-16">
          <div className="text-center mb-12">
            <h2 className="font-primary text-5xl text-dark-navy mb-6">
              ПОЛЬЗА ДЛЯ ЗДОРОВЬЯ
            </h2>
            <p className="font-secondary text-xl text-text-secondary max-w-3xl mx-auto">
              Целебные свойства воды KELECHEK №27 подтверждены клиническими исследованиями
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💚',
                title: 'Пищеварительная система',
                desc: 'Нормализует работу ЖКТ, помогает при гастрите и язве'
              },
              {
                icon: '🔬',
                title: 'Баланс минералов',
                desc: 'Восполняет дефицит важных микроэлементов'
              },
              {
                icon: '⚡',
                title: 'Детоксикация',
                desc: 'Способствует выведению токсинов из организма'
              }
            ].map((benefit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="font-primary text-2xl text-dark-navy mb-4">
                  {benefit.title}
                </h3>
                <p className="font-secondary text-gray-600 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quality Section */}
        <section className="mb-24">
          <div className="bg-dark-navy text-white rounded-3xl p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 font-primary text-[200px]">27</div>
            <div className="relative z-10">
              <h2 className="font-primary text-5xl mb-8">
                КОНТРОЛЬ КАЧЕСТВА
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <p className="font-secondary text-xl mb-6 leading-relaxed text-gray-300">
                    Каждая бутылка KELECHEK №27 проходит строгий многоступенчатый контроль качества.
                    Мы используем современное европейское оборудование и международные стандарты производства.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Сертификация ISO 9001',
                      'Микробиологический контроль',
                      'Проверка минерального состава',
                      'Контроль герметичности упаковки'
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center text-lg">
                        <svg className="w-6 h-6 mr-3 text-primary-cyan flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-primary text-8xl text-primary-cyan mb-4">30+</div>
                    <div className="font-secondary text-2xl text-gray-300">Лет доверия</div>
                  </div>
                </div>
              </div>
            </div>
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

export default Kelechek;
