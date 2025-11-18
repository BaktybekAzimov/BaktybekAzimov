import { useState } from 'react';
import Button from '../../components/ui/Button';
import ProductModal from '../../components/ui/ProductModal';
import WaterDrops from '../../components/effects/WaterDrops';

const Adygene = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    {
      id: 1,
      name: 'ADYGENE',
      subtitle: 'Классическая',
      volume: '0.5л',
      type: 'Питьевая вода высшей категории',
      description: 'Питьевая вода ADYGENE добывается из ледников горы Эльбрус на высоте 4216 метров. Самая чистая вода с уникальным минеральным составом.',
      characteristics: [
        'Источник: ледники Эльбруса',
        'Высота: 4,216 метров',
        'Категория: Высшая',
        'Минерализация: 0.2-0.3 г/л',
        'pH уровень: 7.0-7.5',
        'Негазированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Идеальна для ежедневного употребления',
        'Подходит для приготовления детского питания',
        'Мягкий вкус',
        'Экологически чистая',
        'Добывается в заповедной зоне'
      ]
    },
    {
      id: 2,
      name: 'ADYGENE',
      subtitle: 'Семейная',
      volume: '1.5л',
      type: 'Питьевая вода высшей категории',
      description: 'Семейный формат воды ADYGENE. Оптимальный объём для домашнего использования.',
      characteristics: [
        'Источник: ледники Эльбруса',
        'Высота: 4,216 метров',
        'Категория: Высшая',
        'Минерализация: 0.2-0.3 г/л',
        'pH уровень: 7.0-7.5',
        'Негазированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Экономичный семейный формат',
        'Идеальна для готовки',
        'Подходит для чая и кофе',
        'Удобная бутылка',
        'Лучшая цена за литр'
      ]
    },
    {
      id: 3,
      name: 'ADYGENE',
      subtitle: 'Премиум',
      volume: '5л',
      type: 'Питьевая вода высшей категории',
      description: 'Большой формат для офисов и семей. Вода из самого чистого источника планеты.',
      characteristics: [
        'Источник: ледники Эльбруса',
        'Высота: 4,216 метров',
        'Категория: Высшая',
        'Минерализация: 0.2-0.3 г/л',
        'pH уровень: 7.0-7.5',
        'Негазированная',
        'Срок годности: 12 месяцев'
      ],
      benefits: [
        'Максимально экономичный',
        'Для больших семей',
        'Офисное решение',
        'Меньше пластика на литр',
        'Удобная ручка для переноски'
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
      <WaterDrops count={40} color="rgba(100, 200, 255, 0.4)" />

      <section className="relative bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-300 text-dark-navy py-32 mb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <span className="inline-block px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full text-sm font-secondary mb-8 text-blue-900">
            Ледниковая вода
          </span>
          <h1 className="font-primary text-[clamp(60px,8vw,120px)] mb-6 leading-none drop-shadow-lg">
            ADYGENE
          </h1>
          <p className="font-secondary text-2xl md:text-4xl mb-4 max-w-4xl mx-auto leading-relaxed drop-shadow">
            Вода из ледников Эльбруса
            <br />
            <span className="text-blue-700 font-bold text-3xl md:text-5xl">
              4,216 метров над уровнем моря
            </span>
          </p>
          <Button size="large" variant="primary">
            Где купить
          </Button>
        </div>
      </section>

      <div className="container-custom">
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="font-primary text-6xl text-dark-navy mb-6">
              ВЫБЕРИ СВОЙ РАЗМЕР
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="group cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 border-blue-200 hover:border-cyan-400"
              >
                <div className="font-primary text-7xl text-blue-600 mb-4">{product.volume}</div>
                <div className="font-secondary text-gray-600 mb-6 text-lg">{product.subtitle}</div>
                <div className="text-blue-600 font-secondary text-sm flex items-center">
                  Подробнее
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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

export default Adygene;
