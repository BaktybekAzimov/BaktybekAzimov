# Пошаговая инструкция по деплою KELECHEK Website

## Вариант 1: Vercel (Рекомендуется) - Самый простой

### Шаг 1: Подготовка
```bash
# Убедитесь, что сборка работает локально
npm install
npm run build
```

### Шаг 2: Деплой через Vercel
1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите **"Sign Up"** → войдите через GitHub
3. Нажмите **"Add New..."** → **"Project"**
4. Найдите репозиторий `BaktybekAzimov/BaktybekAzimov`
5. Выберите нужную ветку: `claude/truck-trip-tracking-system-015jHYFy9qorK9xx1petdvVn`
6. Vercel автоматически определит Vite проект
7. Нажмите **"Deploy"**

### Шаг 3: Готово!
- Через 1-2 минуты сайт будет доступен по адресу типа: `kelechek-website.vercel.app`
- Можно подключить свой домен в настройках

---

## Вариант 2: Netlify

### Шаг 1: Подготовка
```bash
npm install
npm run build
```

### Шаг 2: Деплой через Netlify
1. Зайдите на [netlify.com](https://netlify.com)
2. Войдите через GitHub
3. Нажмите **"Add new site"** → **"Import an existing project"**
4. Выберите GitHub → найдите репозиторий
5. Настройки:
   - **Branch to deploy:** `claude/truck-trip-tracking-system-015jHYFy9qorK9xx1petdvVn`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Нажмите **"Deploy site"**

---

## Вариант 3: GitHub Pages (Бесплатно)

### Шаг 1: Установить gh-pages
```bash
npm install --save-dev gh-pages
```

### Шаг 2: Обновить package.json
Добавить в `scripts`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Шаг 3: Обновить vite.config.js
```javascript
export default defineConfig({
  base: '/BaktybekAzimov/', // имя репозитория
  plugins: [react()],
})
```

### Шаг 4: Деплой
```bash
npm run deploy
```

### Шаг 5: Включить GitHub Pages
1. Зайдите в репозиторий на GitHub
2. **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Branch: `gh-pages` / `root`
5. Save

Сайт будет на: `https://baktybekazimov.github.io/BaktybekAzimov/`

---

## Вариант 4: Cloudflare Pages

### Шаг 1: Подготовка
1. Зайдите на [pages.cloudflare.com](https://pages.cloudflare.com)
2. Войдите/создайте аккаунт

### Шаг 2: Создать проект
1. **Create a project** → **Connect to Git**
2. Авторизуйте GitHub
3. Выберите репозиторий `BaktybekAzimov`
4. Настройки:
   - **Production branch:** ваша ветка
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. **Save and Deploy**

---

## Быстрое сравнение

| Платформа | Бесплатный план | HTTPS | Свой домен | CI/CD |
|-----------|-----------------|-------|------------|-------|
| Vercel | ✅ Unlimited | ✅ | ✅ | ✅ |
| Netlify | ✅ 100GB/мес | ✅ | ✅ | ✅ |
| GitHub Pages | ✅ Unlimited | ✅ | ✅ | ⚠️ Ручной |
| Cloudflare | ✅ Unlimited | ✅ | ✅ | ✅ |

---

## Рекомендация

**Для продакшена используйте Vercel или Netlify** - они:
- Автоматически деплоят при каждом push
- Дают preview для pull requests
- Имеют CDN по всему миру
- Бесплатны для личных проектов

---

## После деплоя

1. **Проверьте сайт** - все страницы, навигация
2. **Подключите домен** (если есть) - например `kelechek27.com`
3. **Настройте Analytics** - Google Analytics или Vercel Analytics
4. **Проверьте SEO** - через Google Search Console

---

## Полезные команды

```bash
# Локальная проверка продакшен сборки
npm run build
npm run preview

# Открыть на http://localhost:4173
```

---

Готово! Выберите один из вариантов и деплойте! 🚀
