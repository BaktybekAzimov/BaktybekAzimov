import Button from '../../components/ui/Button';

const Gimalai = () => {
  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="bg-gimalai-water text-white py-20 mb-20">
        <div className="container-custom text-center">
          <h1 className="font-primary text-hero mb-6">
            GIMALAI
          </h1>
          <p className="font-secondary text-2xl mb-8 max-w-3xl mx-auto">
            Живая вода для всей семьи
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
              <h2 className="font-primary text-h2 text-gimalai-dark mb-6">
                ДЛЯ ЕЖЕДНЕВНОГО ИСПОЛЬЗОВАНИЯ
              </h2>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                GIMALAI - это питьевая вода для ежедневного использования. Семейная, доступная,
                но с неизменно высоким качеством.
              </p>
              <p className="font-secondary text-lg text-gray-700 mb-4">
                Идеально подходит для дома, офиса и активного образа жизни.
                Природная чистота и семейные ценности в каждой капле.
              </p>
              <p className="font-secondary text-lg text-gray-700">
                Доступна в удобных форматах от 0.5л до 19л.
              </p>
            </div>
            <div className="bg-gimalai-light rounded-2xl p-8">
              <h3 className="font-primary text-2xl text-gimalai-dark mb-6">ПРЕИМУЩЕСТВА</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gimalai-aqua rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Природная чистота</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gimalai-aqua rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Для всей семьи</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gimalai-aqua rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Доступная цена</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gimalai-aqua rounded-full mr-3"></span>
                  <span className="font-secondary text-gray-700">Разные форматы</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Formats */}
        <section className="mb-20 bg-gimalai-light rounded-2xl p-12">
          <h2 className="font-primary text-h2 text-center text-gimalai-dark mb-12">
            ФОРМАТЫ
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { size: '0.5л', type: 'Дом' },
              { size: '1л', type: 'Дом' },
              { size: '5л', type: 'Дом/Офис' },
              { size: '10л', type: 'Офис' },
              { size: '19л', type: 'Офис/HoReCa' },
            ].map((format, idx) => (
              <div key={idx} className="text-center bg-white rounded-xl p-6 shadow-md">
                <div className="font-primary text-4xl text-gimalai-aqua mb-2">{format.size}</div>
                <div className="font-secondary text-sm text-gray-600">{format.type}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Gimalai;
