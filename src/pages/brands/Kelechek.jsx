import Button from '../../components/ui/Button';

const Kelechek = () => {
  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="bg-kelechek-hero text-white py-20 mb-20">
        <div className="container-custom text-center">
          <h1 className="font-primary text-hero mb-6">
            KELECHEK №27
          </h1>
          <p className="font-secondary text-2xl mb-8 max-w-3xl mx-auto">
            Премиальная лечебно-столовая минеральная вода из источника №27
          </p>
          <Button size="large" variant="outline">
            Где купить
          </Button>
        </div>
      </section>

      <div className="container-custom">
        {/* Description */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-primary text-h2 text-kelechek-dark mb-6">
                ФЛАГМАНСКИЙ ПРОДУКТ
              </h2>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                KELECHEK №27 - это премиальная лечебно-столовая минеральная вода из уникального
                источника №27 в Жалал-Абаде, Кыргызстан.
              </p>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                Сертифицирована для лечения заболеваний желудочно-кишечного тракта.
                Идеальный баланс минералов для ежедневного употребления.
              </p>
              <p className="font-secondary text-lg text-gray-700">
                Экспортируется в Казахстан, Узбекистан, Россию и США.
              </p>
            </div>
            <div className="bg-kelechek-bg rounded-2xl p-8">
              <h3 className="font-primary text-2xl text-kelechek-dark mb-6">ХАРАКТЕРИСТИКИ</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Лечебно-столовая вода</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Источник №27, Жалал-Абад</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Сертифицирована для лечения ЖКТ</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Премиум качество</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="mb-20 bg-kelechek-subtle rounded-2xl p-12">
          <h2 className="font-primary text-h2 text-center text-kelechek-dark mb-12">
            ФОРМАТЫ
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { size: '0.5л', desc: 'Индивидуальный' },
              { size: '1л', desc: 'Семейный' },
              { size: '1.5л', desc: 'Стандартный' },
              { size: '19л', desc: 'Офисный' },
            ].map((format, idx) => (
              <div key={idx} className="text-center bg-white rounded-xl p-6 shadow-md">
                <div className="font-primary text-5xl text-kelechek-primary mb-3">{format.size}</div>
                <div className="font-secondary text-gray-600">{format.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Kelechek;
