import Button from '../components/ui/Button';

const About = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <h1 className="font-primary text-h1 text-kelechek-dark mb-6">
            О КОМПАНИИ KELECHEK
          </h1>
          <p className="font-secondary text-xl text-gray-600 max-w-3xl mx-auto">
            30 лет создаем продукты премиум-класса для здоровья и удовольствия
          </p>
        </section>

        {/* History */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-primary text-h2 text-kelechek-dark mb-6">
                ИСТОРИЯ КОМПАНИИ
              </h2>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                ЗАО «КЕЛЕЧЕК» основано в 1991 году в городе Жалал-Абад, Кыргызстан.
                За 30 лет работы мы стали крупнейшим производителем премиальной минеральной
                воды в регионе.
              </p>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                Наш флагманский продукт - лечебно-столовая минеральная вода из источника №27 -
                сертифицирована для лечения заболеваний желудочно-кишечного тракта.
              </p>
              <p className="font-secondary text-lg text-gray-700">
                Сегодня продукция KELECHEK экспортируется в Казахстан, Узбекистан,
                Россию и США.
              </p>
            </div>
            <div className="bg-kelechek-bg rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <div className="font-primary text-4xl text-kelechek-primary mb-2">1991</div>
                  <div className="font-secondary text-gray-700">Год основания</div>
                </div>
                <div>
                  <div className="font-primary text-4xl text-kelechek-primary mb-2">30+</div>
                  <div className="font-secondary text-gray-700">Лет на рынке</div>
                </div>
                <div>
                  <div className="font-primary text-4xl text-kelechek-primary mb-2">4</div>
                  <div className="font-secondary text-gray-700">Страны экспорта</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20 bg-kelechek-subtle rounded-2xl p-12">
          <h2 className="font-primary text-h2 text-center text-kelechek-dark mb-12">
            НАШИ ЦЕННОСТИ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-kelechek-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-primary text-2xl text-kelechek-dark mb-3">КАЧЕСТВО</h3>
              <p className="font-secondary text-gray-600">
                Строгий контроль на каждом этапе производства
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kelechek-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-primary text-2xl text-kelechek-dark mb-3">ПРИРОДА</h3>
              <p className="font-secondary text-gray-600">
                Чистая вода из природных источников Кыргызстана
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-kelechek-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-primary text-2xl text-kelechek-dark mb-3">ДОСТУПНОСТЬ</h3>
              <p className="font-secondary text-gray-600">
                Премиум качество по справедливым ценам
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <h2 className="font-primary text-h2 text-kelechek-dark mb-6">
            ХОТИТЕ УЗНАТЬ БОЛЬШЕ?
          </h2>
          <p className="font-secondary text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами для получения дополнительной информации о компании и продукции
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="large" variant="primary">
              Связаться с нами
            </Button>
            <Button size="large" variant="secondary">
              Наша продукция
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
