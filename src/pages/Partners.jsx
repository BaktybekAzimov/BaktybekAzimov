import Button from '../components/ui/Button';

const Partners = () => {
  return (
    <div className="pt-32 pb-20">
      <div className="container-custom">
        <section className="text-center mb-20">
          <h1 className="font-primary text-h1 text-kelechek-dark mb-6">
            ПАРТНЕРАМ
          </h1>
          <p className="font-secondary text-xl text-gray-600 max-w-3xl mx-auto">
            Присоединяйтесь к нашей сети партнеров
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-kelechek-bg rounded-2xl p-8">
            <h2 className="font-primary text-h3 text-kelechek-dark mb-6">
              ПРЕИМУЩЕСТВА СОТРУДНИЧЕСТВА
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Премиум продукция с 30-летней историей</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Широкий ассортимент брендов</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Конкурентные цены</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Маркетинговая поддержка</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Надежная логистика</span>
              </li>
            </ul>
          </div>

          <div className="bg-kelechek-subtle rounded-2xl p-8">
            <h2 className="font-primary text-h3 text-kelechek-dark mb-6">
              КТО МОЖЕТ СТАТЬ ПАРТНЕРОМ
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Розничные магазины</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Оптовые дистрибьюторы</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">HoReCa (отели, рестораны, кафе)</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-kelechek-primary rounded-full mr-3 mt-2"></span>
                <span className="font-secondary text-gray-700">Офисная доставка</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="text-center">
          <h2 className="font-primary text-h2 text-kelechek-dark mb-6">
            НАЧНИТЕ СОТРУДНИЧЕСТВО
          </h2>
          <p className="font-secondary text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Заполните форму или свяжитесь с нами напрямую
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="large" variant="primary">
              Отправить заявку
            </Button>
            <Button size="large" variant="secondary">
              Связаться с нами
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Partners;
