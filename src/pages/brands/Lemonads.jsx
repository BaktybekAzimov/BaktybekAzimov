import Button from '../../components/ui/Button';

const Lemonads = () => {
  const lemonads = [
    { name: 'Классический Лимонад', color: 'bg-gradient-to-br from-yellow-300 to-yellow-500', desc: 'Традиционный вкус' },
    { name: 'Буратино', color: 'bg-buratino', desc: 'Апельсиновый' },
    { name: 'Тархун', color: 'bg-tarhun', desc: 'Эстрагон' },
    { name: 'Дюшес', color: 'bg-duchess', desc: 'Грушевый' },
    { name: 'К+ Витамины', color: 'bg-kplus', desc: 'Лайм-Лимон (для мохито!)' },
    { name: 'Asia-Cola', color: 'bg-gradient-to-br from-gray-900 to-gray-700', desc: 'Кола' },
    { name: 'Гранат', color: 'bg-granat', desc: 'Насыщенный' },
    { name: 'Ситро', color: 'bg-citro', desc: 'Цитрусовый' },
  ];

  return (
    <div className="pt-32 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-yellow-300 via-green-400 to-orange-400 text-white py-20 mb-20">
        <div className="container-custom text-center">
          <h1 className="font-primary text-hero mb-6 drop-shadow-lg">
            ЛИМОНАДЫ
          </h1>
          <p className="font-secondary text-2xl mb-8 max-w-3xl mx-auto drop-shadow">
            Яркие вкусы для яркой жизни
          </p>
          <Button size="large" variant="outline">
            Где купить
          </Button>
        </div>
      </section>

      <div className="container-custom">
        {/* Description */}
        <section className="mb-20 text-center">
          <h2 className="font-primary text-h2 text-kelechek-dark mb-6">
            ГАЗИРОВАННЫЕ НАПИТКИ
          </h2>
          <p className="font-secondary text-lg text-gray-700 max-w-3xl mx-auto">
            Линейка ярких газированных напитков с традиционными и современными вкусами.
            От классического лимонада до K+ Витамины - идеально для мохито!
          </p>
        </section>

        {/* Products Grid */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lemonads.map((drink, idx) => (
              <div
                key={idx}
                className={`${drink.color} rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer`}
              >
                <h3 className="font-primary text-3xl mb-3 drop-shadow">
                  {drink.name}
                </h3>
                <p className="font-secondary text-sm opacity-90 drop-shadow">
                  {drink.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Special K+ Section */}
        <section className="bg-kplus rounded-2xl p-12 text-center mb-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-primary text-h1 text-kplus-green mb-6 drop-shadow">
              К+ ВИТАМИНЫ
            </h2>
            <p className="font-primary text-3xl text-gray-800 mb-6">
              ИДЕАЛЬНО ДЛЯ МОХИТО!
            </p>
            <p className="font-secondary text-lg text-gray-700">
              Освежающий напиток с лимоном и лаймом. Добавьте мяту и лед -
              получите идеальный домашний мохито!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Lemonads;
