import { useState } from 'react';
import Button from '../../components/ui/Button';
import ProductModal from '../../components/ui/ProductModal';
import WaterDrops from '../../components/effects/WaterDrops';

const Gimalai = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    {
      id: 1,
      name: 'GIMALAI',
      subtitle: 'Живая вода',
      volume: '0.5л',
      type: 'Артезианская вода первой категории',
      description: 'GIMALAI - живая артезианская вода из глубоких подземных источников Гималайского региона. Насыщена природными минералами.',
      characteristics: [
        'Артезианская скважина',
        'Глубина: 180 метров',
        'Категория: Первая',
        'Минерализация: 0.3-0.5 г/л',
        'pH уровень: 7.2-7.8',
        'Негазированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Насыщена минералами',
        'Идеальна для активного образа жизни',
        'Природный баланс',
        'Артезианская чистота',
        'Мягкий приятный вкус'
      ]
    },
    {
      id: 2,
      name: 'GIMALAI',
      subtitle: 'Семейная',
      volume: '1.5л',
      type: 'Артезианская вода первой категории',
      description: 'Семейный формат живой воды GIMALAI для ежедневного использования всей семьёй.',
      characteristics: [
        'Артезианская скважина',
        'Глубина: 180 метров',
        'Категория: Первая',
        'Минерализация: 0.3-0.5 г/л',
        'pH уровень: 7.2-7.8',
        'Негазированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Экономичный формат',
        'Для всей семьи',
        'Природные минералы',
        'Универсальное использование',
        'Доступная цена'
      ]
    },
    {
      id: 3,
      name: 'GIMALAI',
      subtitle: 'Офисная',
      volume: '5л',
      type: 'Артезианская вода первой категории',
      description: 'Большой формат живой воды GIMALAI для офисов и коммерческого использования.',
      characteristics: [
        'Артезианская скважина',
        'Глубина: 180 метров',
        'Категория: Первая',
        'Минерализация: 0.3-0.5 г/л',
        'pH уровень: 7.2-7.8',
        'Негазированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Офисное решение',
        'Максимально выгодно',
        'Удобная упаковка',
        'Для больших объёмов',
        'Природный вкус'
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
      <WaterDrops count={40} color="rgba(100, 220, 150, 0.4)" />

      <section className="relative bg-gradient-to-br from-green-300 via-emerald-400 to-teal-400 text-white py-32 mb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <span className="inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-secondary mb-8">
            Артезианская вода
          </span>
          <h1 className="font-primary text-[clamp(60px,8vw,120px)] mb-6 leading-none drop-shadow-2xl">
            GIMALAI
          </h1>
          <p className="font-secondary text-2xl md:text-4xl mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
            Живая артезианская вода
            <br />
            <span className="text-green-100 font-bold text-3xl md:text-5xl">
              Из глубины 180 метров
            </span>
          </p>
          <Button size="large" variant="outline">
            Где купить
          </Button>
        </div>
      </section>

      <div className="container-custom">
        <section className="mb-24">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-secondary mb-6">
              Первая категория
            </span>
            <h2 className="font-primary text-6xl text-dark-navy mb-6">
              ЖИВАЯ ВОДА
            </h2>
            <p className="font-secondary text-xl text-text-secondary max-w-3xl mx-auto">
              Насыщена природными минералами из артезианских источников
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="group cursor-pointer bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-green-200 hover:border-emerald-400"
              >
                <div className="font-primary text-7xl text-green-600 mb-4">{product.volume}</div>
                <div className="font-secondary text-gray-600 mb-6 text-lg">{product.subtitle}</div>
                <div className="text-green-600 font-secondary text-sm flex items-center">
                  Подробнее
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-24 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 md:p-16">
          <div className="text-center mb-12">
            <h2 className="font-primary text-5xl text-dark-navy mb-6">
              ПОЧЕМУ GIMALAI?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💧',
                title: 'Артезианская',
                desc: 'Из глубоких подземных источников на 180 метрах'
              },
              {
                icon: '🌿',
                title: 'Живая вода',
                desc: 'Насыщена природными минералами и микроэлементами'
              },
              {
                icon: '⚡',
                title: 'Для активных',
                desc: 'Идеальна для спорта и активного образа жизни'
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

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Gimalai;
