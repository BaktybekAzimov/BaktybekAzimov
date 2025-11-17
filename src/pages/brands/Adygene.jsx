import Button from '../../components/ui/Button';

const Adygene = () => {
  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="bg-adygene-ice text-adygene-text py-20 mb-20">
        <div className="container-custom text-center">
          <h1 className="font-primary text-hero mb-6">
            ADYGENE
          </h1>
          <p className="font-secondary text-2xl mb-4 max-w-3xl mx-auto">
            Ледниковая питьевая вода с высоты 4,216 метров
          </p>
          <p className="font-secondary text-xl mb-8 max-w-2xl mx-auto opacity-80">
            Выше чем Evian (850м) и Fiji (0м)!
          </p>
          <Button size="large" variant="primary" className="bg-adygene-primary hover:bg-adygene-primary/90">
            Где купить
          </Button>
        </div>
      </section>

      <div className="container-custom">
        {/* Description */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-primary text-h2 text-adygene-text mb-6">
                УНИКАЛЬНАЯ ВЫСОТА
              </h2>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                ADYGENE - это уникальная ледниковая питьевая вода, собранная на высоте 4,216 метров
                в горах Кыргызстана.
              </p>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                Это самая высокая точка сбора воды в регионе, что обеспечивает
                исключительную чистоту и природный вкус.
              </p>
              <p className="font-secondary text-lg text-gray-700">
                Холодная, чистая, минималистичная - как сами горы Кыргызстана.
              </p>
            </div>
            <div className="bg-adygene-light rounded-2xl p-8">
              <h3 className="font-primary text-2xl text-adygene-text mb-6">ПРЕИМУЩЕСТВА</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-adygene-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Высота сбора: 4,216 метров</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-adygene-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Ледниковая чистота</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-adygene-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Природный минеральный состав</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-adygene-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Освежающий вкус</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Variants */}
        <section className="mb-20 bg-adygene-light rounded-2xl p-12">
          <h2 className="font-primary text-h2 text-center text-adygene-text mb-12">
            ВАРИАНТЫ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Классическая', desc: 'Чистая ледниковая вода' },
              { name: 'С лимоном', desc: 'Освежающий цитрус' },
              { name: 'С мятой', desc: 'Холодная свежесть' },
            ].map((variant, idx) => (
              <div key={idx} className="text-center bg-white rounded-xl p-6 shadow-md">
                <div className="font-primary text-3xl text-adygene-primary mb-3">{variant.name}</div>
                <div className="font-secondary text-gray-600">{variant.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Adygene;
