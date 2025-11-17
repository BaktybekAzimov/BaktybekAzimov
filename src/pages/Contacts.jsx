import { useState } from 'react';
import Button from '../components/ui/Button';

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    type: 'general'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-32 pb-20">
      <section className="relative bg-gradient-to-br from-dark-navy via-primary-blue to-primary-cyan text-white py-32 mb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-cyan rounded-full blur-[120px]" />
        </div>

        <div className="container-custom text-center relative z-10">
          <span className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-sm font-secondary mb-8">
            Контакты
          </span>
          <h1 className="font-primary text-[clamp(50px,8vw,100px)] mb-6 leading-none">
            СВЯЖИТЕСЬ С НАМИ
          </h1>
          <p className="font-secondary text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed">
            Мы всегда рады ответить на ваши вопросы
          </p>
        </div>
      </section>

      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          <div>
            <h2 className="font-primary text-4xl text-dark-navy mb-8">
              Напишите нам
            </h2>

            {submitted && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="font-secondary text-lg font-semibold text-green-900 mb-1">
                      Спасибо за ваше сообщение!
                    </h3>
                    <p className="font-secondary text-green-700">
                      Мы получили ваш запрос и свяжемся с вами в ближайшее время.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Тип обращения
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                  required
                >
                  <option value="general">Общий вопрос</option>
                  <option value="b2b">B2B сотрудничество</option>
                  <option value="export">Экспорт</option>
                  <option value="feedback">Отзыв о продукции</option>
                  <option value="quality">Вопрос качества</option>
                </select>
              </div>

              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                  placeholder="Иван Иванов"
                  required
                />
              </div>

              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                  placeholder="ivan@example.com"
                  required
                />
              </div>

              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Телефон
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                  placeholder="+996 XXX XXX XXX"
                />
              </div>

              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Компания (если применимо)
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary"
                  placeholder="ООО 'Компания'"
                />
              </div>

              <div>
                <label className="block font-secondary text-sm font-medium text-gray-700 mb-2">
                  Сообщение *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-cyan focus:outline-none transition-colors font-secondary resize-none"
                  placeholder="Расскажите подробнее о вашем запросе..."
                  required
                />
              </div>

              <Button type="submit" size="large" variant="primary" className="w-full">
                Отправить сообщение
              </Button>

              <p className="text-sm text-gray-500 font-secondary text-center">
                * Обязательные поля
              </p>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="font-primary text-4xl text-dark-navy mb-8">
                Контактная информация
              </h2>
            </div>

            <div className="bg-gradient-to-br from-primary-blue/5 to-primary-cyan/5 rounded-2xl p-8 border-2 border-primary-cyan/20">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-primary text-xl text-dark-navy mb-2">Главный офис</h3>
                  <p className="font-secondary text-gray-700 mb-2">
                    ЗАО «КЕЛЕЧЕК»<br />
                    720500, Кыргызская Республика<br />
                    г. Жалал-Абад, ул. Ленина, 123
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-cyan/5 to-primary-blue/5 rounded-2xl p-8 border-2 border-primary-blue/20">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-cyan rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-primary text-xl text-dark-navy mb-2">Телефоны</h3>
                  <p className="font-secondary text-gray-700 mb-1">
                    Горячая линия: <a href="tel:+996312123456" className="text-primary-blue hover:underline">+996 (312) 12-34-56</a>
                  </p>
                  <p className="font-secondary text-gray-700 mb-1">
                    Отдел продаж: <a href="tel:+996555123456" className="text-primary-blue hover:underline">+996 (555) 12-34-56</a>
                  </p>
                  <p className="font-secondary text-gray-700">
                    B2B отдел: <a href="tel:+996777123456" className="text-primary-blue hover:underline">+996 (777) 12-34-56</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-blue/5 to-primary-cyan/5 rounded-2xl p-8 border-2 border-primary-cyan/20">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-blue rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-primary text-xl text-dark-navy mb-2">Email</h3>
                  <p className="font-secondary text-gray-700 mb-1">
                    Общие вопросы: <a href="mailto:info@kelechek.kg" className="text-primary-blue hover:underline">info@kelechek.kg</a>
                  </p>
                  <p className="font-secondary text-gray-700 mb-1">
                    Продажи: <a href="mailto:sales@kelechek.kg" className="text-primary-blue hover:underline">sales@kelechek.kg</a>
                  </p>
                  <p className="font-secondary text-gray-700">
                    Экспорт: <a href="mailto:export@kelechek.kg" className="text-primary-blue hover:underline">export@kelechek.kg</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-cyan/5 to-primary-blue/5 rounded-2xl p-8 border-2 border-primary-blue/20">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-cyan rounded-xl flex items-center justify-center flex-shrink-0 mr-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-primary text-xl text-dark-navy mb-2">Режим работы</h3>
                  <p className="font-secondary text-gray-700 mb-1">
                    Пн-Пт: 9:00 - 18:00
                  </p>
                  <p className="font-secondary text-gray-700 mb-1">
                    Сб: 10:00 - 15:00
                  </p>
                  <p className="font-secondary text-gray-700">
                    Вс: Выходной
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mb-20">
          <h2 className="font-primary text-4xl text-dark-navy mb-8 text-center">
            Как нас найти
          </h2>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 bg-gray-100">
            <div className="h-96 flex items-center justify-center">
              <div className="text-center p-8">
                <svg className="w-24 h-24 text-primary-cyan mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="font-primary text-2xl text-dark-navy mb-3">
                  ЗАО «КЕЛЕЧЕК»
                </h3>
                <p className="font-secondary text-lg text-gray-600">
                  г. Жалал-Абад, Кыргызстан
                  <br />
                  ул. Ленина, 123
                </p>
                <p className="font-secondary text-sm text-gray-500 mt-4">
                  [Здесь может быть интерактивная карта Google Maps или Яндекс.Карты]
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contacts;
