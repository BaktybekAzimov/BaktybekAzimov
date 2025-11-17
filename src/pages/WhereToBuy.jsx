import { useState } from 'react';
import Button from '../components/ui/Button';

const WhereToBuy = () => {
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stores = [
    // Кыргызстан
    { id: 1, name: 'Bishkek Park Mall', city: 'Бишкек', country: 'Кыргызстан', address: 'пр. Чуй, 265', brands: ['Kelechek', 'Adygene', 'Gimalai', 'Lemonads'], phone: '+996 312 123 456' },
    { id: 2, name: 'Globus Hypermarket', city: 'Бишкек', country: 'Кыргызстан', address: 'ул. Московская, 123', brands: ['Kelechek', 'Adygene', 'Gimalai'], phone: '+996 312 234 567' },
    { id: 3, name: 'Dostuk Market', city: 'Бишкек', country: 'Кыргызстан', address: 'ул. Байтик Баатыра, 45', brands: ['Kelechek', 'Lemonads'], phone: '+996 312 345 678' },
    { id: 4, name: 'Narodniy', city: 'Бишкек', country: 'Кыргызстан', address: 'мкр. Асанбай, 7', brands: ['Kelechek', 'Adygene', 'Gimalai', 'Lemonads'], phone: '+996 312 456 789' },
    { id: 5, name: 'Beta Stores', city: 'Ош', country: 'Кыргызстан', address: 'ул. Ленина, 234', brands: ['Kelechek', 'Gimalai'], phone: '+996 3222 5 67 89' },
    { id: 6, name: 'Фрунзе', city: 'Жалал-Абад', country: 'Кыргызстан', address: 'ул. Эркиндик, 56', brands: ['Kelechek', 'Adygene', 'Lemonads'], phone: '+996 3722 5 12 34' },

    // Казахстан
    { id: 7, name: 'Magnum Cash & Carry', city: 'Алматы', country: 'Казахстан', address: 'пр. Райымбека, 500', brands: ['Kelechek', 'Adygene', 'Gimalai'], phone: '+7 727 123 45 67' },
    { id: 8, name: 'Small Almaty', city: 'Алматы', country: 'Казахстан', address: 'ул. Тимирязева, 42', brands: ['Kelechek', 'Lemonads'], phone: '+7 727 234 56 78' },
    { id: 9, name: 'Magnum Astana', city: 'Астана', country: 'Казахстан', address: 'ул. Достык, 12', brands: ['Kelechek', 'Adygene'], phone: '+7 7172 45 67 89' },

    // Россия
    { id: 10, name: 'Metro Cash & Carry', city: 'Москва', country: 'Россия', address: 'МКАД 47-й км', brands: ['Kelechek', 'Adygene'], phone: '+7 495 123 45 67' },
    { id: 11, name: 'Лента', city: 'Москва', country: 'Россия', address: 'Варшавское ш., 87', brands: ['Kelechek', 'Gimalai', 'Lemonads'], phone: '+7 495 234 56 78' },
    { id: 12, name: 'Перекрёсток', city: 'Санкт-Петербург', country: 'Россия', address: 'Невский пр., 114', brands: ['Kelechek', 'Adygene'], phone: '+7 812 345 67 89' },
    { id: 13, name: 'Пятёрочка', city: 'Москва', country: 'Россия', address: 'ул. Арбат, 23', brands: ['Kelechek', 'Lemonads'], phone: '+7 495 345 67 89' },

    // Узбекистан
    { id: 14, name: 'Ramstore', city: 'Ташкент', country: 'Узбекистан', address: 'ул. Amir Temur, 56', brands: ['Kelechek', 'Adygene', 'Lemonads'], phone: '+998 71 123 45 67' },
    { id: 15, name: 'Korzinka', city: 'Ташкент', country: 'Узбекистан', address: 'пр. Бунёдкор, 23', brands: ['Kelechek', 'Gimalai'], phone: '+998 71 234 56 78' },

    // США
    { id: 16, name: 'Russian Gourmet', city: 'Нью-Йорк', country: 'США', address: '615 Brighton Beach Ave', brands: ['Kelechek', 'Adygene'], phone: '+1 718 615 1515' },
    { id: 17, name: 'Tashkent Market', city: 'Лос-Анджелес', country: 'США', address: '11819 Wilshire Blvd', brands: ['Kelechek'], phone: '+1 310 478 1772' },
  ];

  const cities = ['all', ...new Set(stores.map(s => s.city))];
  const brands = ['all', 'Kelechek', 'Adygene', 'Gimalai', 'Lemonads'];

  const filteredStores = stores.filter(store => {
    const cityMatch = selectedCity === 'all' || store.city === selectedCity;
    const brandMatch = selectedBrand === 'all' || store.brands.includes(selectedBrand);
    const searchMatch = searchQuery === '' ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase());

    return cityMatch && brandMatch && searchMatch;
  });

  return (
    <div className="pt-32 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-cyan via-primary-blue to-dark-navy text-white py-32 mb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-secondary mb-8">
            Точки продаж
          </span>
          <h1 className="font-primary text-[clamp(50px,8vw,100px)] mb-6 leading-none">
            ГДЕ КУПИТЬ
          </h1>
          <p className="font-secondary text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
            Найдите продукцию KELECHEK рядом с вами
          </p>
        </div>
      </section>

      <div className="container-custom">
        {/* Search and Filters */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border-2 border-gray-100">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Search Input */}
              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Поиск по названию или адресу
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                />
              </div>

              {/* City Filter */}
              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Город
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                >
                  <option value="all">Все города</option>
                  {cities.filter(c => c !== 'all').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Бренд
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand === 'all' ? 'Все бренды' : brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Counter */}
            <div className="mt-6 text-center">
              <p className="font-secondary text-gray-600">
                Найдено точек продаж: <span className="font-bold text-primary-blue">{filteredStores.length}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Stores List */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-100 hover:border-primary-cyan"
              >
                {/* Store Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-primary-cyan to-primary-blue rounded-xl flex items-center justify-center text-white text-2xl mb-4">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>

                {/* Store Name */}
                <h3 className="font-primary text-xl text-dark-navy mb-2">
                  {store.name}
                </h3>

                {/* Location */}
                <div className="flex items-start mb-3">
                  <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="font-secondary text-sm text-gray-700">
                    <p className="font-semibold">{store.city}, {store.country}</p>
                    <p>{store.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-primary-blue mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${store.phone}`} className="font-secondary text-sm text-primary-blue hover:underline">
                    {store.phone}
                  </a>
                </div>

                {/* Available Brands */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="font-secondary text-xs text-gray-500 mb-2">Доступные бренды:</p>
                  <div className="flex flex-wrap gap-1">
                    {store.brands.map((brand) => (
                      <span
                        key={brand}
                        className="inline-block px-2 py-1 bg-gradient-to-r from-primary-cyan/10 to-primary-blue/10 text-primary-blue rounded-md text-xs font-secondary font-medium"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-primary text-2xl text-gray-600 mb-3">
                Точки продаж не найдены
              </h3>
              <p className="font-secondary text-gray-500">
                Попробуйте изменить параметры поиска
              </p>
            </div>
          )}
        </section>

        {/* Map Section */}
        <section className="mb-20">
          <h2 className="font-primary text-4xl text-dark-navy mb-8 text-center">
            Карта точек продаж
          </h2>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white">
            <div className="h-[500px] flex items-center justify-center">
              <div className="text-center p-8">
                <svg className="w-32 h-32 text-primary-cyan mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="font-primary text-3xl text-dark-navy mb-4">
                  Интерактивная карта
                </h3>
                <p className="font-secondary text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                  Здесь будет отображаться интерактивная карта с точками продаж нашей продукции
                  <br />
                  <span className="text-sm text-gray-500 mt-2 block">
                    [Интеграция Google Maps или Яндекс.Карты]
                  </span>
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="px-4 py-2 bg-primary-cyan/10 rounded-lg">
                    <span className="font-secondary text-sm text-primary-blue font-semibold">
                      570+ точек продаж
                    </span>
                  </div>
                  <div className="px-4 py-2 bg-primary-blue/10 rounded-lg">
                    <span className="font-secondary text-sm text-primary-blue font-semibold">
                      8 стран
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-br from-primary-blue to-primary-cyan text-white rounded-3xl p-12 md:p-16">
          <h2 className="font-primary text-5xl mb-6">
            НЕ НАШЛИ БЛИЖАЙШУЮ ТОЧКУ ПРОДАЖ?
          </h2>
          <p className="font-secondary text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Свяжитесь с нами, и мы подскажем, где можно приобрести нашу продукцию
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="large"
              variant="outline"
              onClick={() => window.location.href = '/contacts'}
            >
              Связаться с нами
            </Button>
            <Button
              size="large"
              variant="secondary"
              onClick={() => window.location.href = 'tel:+996312123456'}
            >
              +996 (312) 12-34-56
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WhereToBuy;
