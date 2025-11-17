# KELECHEK - Premium Mineral Water Website

Премиум веб-сайт для ЗАО «КЕЛЕЧЕК» - крупнейшего производителя минеральной воды в Кыргызстане.

## 🏔️ О проекте

KELECHEK - компания с 30-летней историей, производитель премиальной лечебно-столовой минеральной воды из источника №27 в Жалал-Абаде, Кыргызстан.

### Бренды:
- **KELECHEK №27** - Премиальная лечебно-столовая минеральная вода
- **ADYGENE** - Ледниковая вода с высоты 4,216 метров
- **GIMALAI** - Живая вода для всей семьи
- **ЛИМОНАДЫ** - Яркие газированные напитки

## 🚀 Tech Stack

- **Frontend:** React 18.2
- **Build Tool:** Vite 5.0.8
- **Styling:** Tailwind CSS 3.4
- **Animations:** GSAP 3.12.4
- **Routing:** React Router DOM 6.20.1
- **Fonts:** Bebas Neue (заголовки) + Montserrat (текст)

## 📦 Установка

```bash
# Клонировать репозиторий
git clone <repository-url>

# Перейти в директорию
cd kelechek-website

# Установить зависимости
npm install
```

## 💻 Разработка

```bash
# Запустить dev server (откроется на http://localhost:3000)
npm run dev

# Собрать для production
npm run build

# Предпросмотр production build
npm preview

# Запустить линтер
npm run lint
```

## 📁 Структура проекта

```
kelechek-website/
├── public/                 # Статические файлы
├── src/
│   ├── components/
│   │   ├── brands/        # Компоненты брендов
│   │   ├── common/        # Общие компоненты
│   │   ├── layout/        # Header, Footer, Navigation
│   │   └── ui/            # UI компоненты (Button, Card)
│   ├── pages/             # Страницы
│   │   ├── brands/        # Страницы брендов
│   │   ├── About.jsx
│   │   ├── Home.jsx
│   │   ├── Contacts.jsx
│   │   └── ...
│   ├── styles/
│   │   └── globals.css    # Глобальные стили
│   ├── App.jsx            # Главный компонент
│   └── main.jsx           # Entry point
├── index.html
├── package.json
├── tailwind.config.js     # Цветовая система брендов
└── vite.config.js
```

## 🎨 Цветовая система

Все цвета взяты с реальных этикеток продукции!

### KELECHEK №27
- Primary: `#C8102E` (красный)
- Dark: `#2C3E50` (графитовый)
- Background: `#F5F5F5` (серебристо-белый)

### ADYGENE
- Primary: `#4A90B5` (холодный синий)
- Light: `#E0F7FF` (ледяной голубой)
- Mint: `#00BFA5` (бирюзовая мята)

### GIMALAI
- Primary: `#87CEEB` (небесно-голубой)
- Aqua: `#00CED1` (аква)

### ЛИМОНАДЫ
Каждый вкус имеет свой уникальный цвет:
- Классический: `#FFD700` (желтый)
- Буратино: `#FF8C00` (оранжевый)
- Тархун: `#98FB98` (зеленый)
- K+ Витамины: `#7CFC00` (яркий зеленый)
- И другие...

## 🔧 Конфигурация

### Tailwind CSS
Полная цветовая система настроена в `tailwind.config.js` с учетом всех брендов.

### GSAP Анимации
- Scroll-triggered анимации
- Плавные переходы
- Hover эффекты
- Glow эффекты для текста

## 📱 Responsive Design

- **Mobile-first** подход
- Breakpoints: 375px, 640px, 768px, 1024px, 1280px, 1536px
- 60%+ трафика с мобильных устройств

## ⚡ Performance

- Lighthouse Score target: 85+
- Code splitting для оптимизации
- Lazy loading изображений
- Оптимизированные анимации (60fps)

## 🌐 i18n (Planned)

Поддержка 3 языков:
- Русский (основной)
- English
- Кыргызский

## 📄 Страницы

- `/` - Главная
- `/about` - О компании
- `/brands/kelechek` - KELECHEK №27
- `/brands/adygene` - ADYGENE
- `/brands/gimalai` - GIMALAI
- `/brands/lemonads` - ЛИМОНАДЫ
- `/where-to-buy` - Где купить
- `/partners` - Партнерам
- `/contacts` - Контакты

## 🚧 В разработке

- [ ] Интеграция с backend API
- [ ] Форма обратной связи
- [ ] Карта точек продаж
- [ ] Интернационализация (i18next)
- [ ] SEO оптимизация
- [ ] Добавление реальных изображений продукции

## 📝 Лицензия

UNLICENSED - Proprietary

## 👥 Контакты

**ЗАО «КЕЛЕЧЕК»**
Жалал-Абад, Кыргызстан
Email: info@kelechek27.com

---

© 2025 KELECHEK. 30 лет совершенства.
