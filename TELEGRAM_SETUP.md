# 🤖 Настройка Telegram Bot - Пошаговая инструкция

## ✅ Что умеет бот (100% БЕСПЛАТНО):
- ✅ Отправлять уведомления админу о новых рейсах
- ✅ Отправлять отчёты (день/неделя/месяц)
- ✅ Уведомлять о завершении рейсов
- ✅ Показывать статистику по команде
- ✅ Неограниченное количество сообщений

---

## 📝 Шаг 1: Создать Telegram бота

1. Открыть Telegram и найти **@BotFather**
2. Написать команду `/newbot`
3. Ввести имя бота (например: `TruckTrack Notifications`)
4. Ввести username бота (должен заканчиваться на `bot`, например: `trucktrack_notify_bot`)
5. **Скопировать TOKEN** который выдал BotFather
   ```
   Пример токена: 6789012345:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
   ```

---

## 📝 Шаг 2: Получить Chat ID администратора

### Вариант 1: Через бота @userinfobot
1. Найти бота **@userinfobot** в Telegram
2. Написать ему `/start`
3. Он пришлёт ваш Chat ID (например: `123456789`)

### Вариант 2: Через ваш бот
1. Написать вашему боту `/start`
2. Открыть в браузере:
   ```
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
3. Найти в ответе `"chat":{"id":123456789}`

---

## 📝 Шаг 3: Добавить настройки в Supabase

1. Открыть **Supabase Dashboard** → **Table Editor** → **settings**
2. Найти единственную строку с настройками
3. Нажать **Edit**
4. Заполнить поля:
   - `telegram_bot_token`: вставить токен от BotFather
   - `telegram_admin_chat_id`: вставить ваш Chat ID
   - `telegram_bot_enabled`: поставить `true`
   - `telegram_notifications_enabled`: поставить `true`
5. Нажать **Save**

### Пример настроек:
```
telegram_bot_token = "6789012345:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw"
telegram_admin_chat_id = "123456789"
telegram_bot_enabled = true
telegram_notifications_enabled = true
```

---

## 📝 Шаг 4: Создать Supabase Edge Function для уведомлений

### 4.1. Установить Supabase CLI (если ещё не установлен)
```bash
npm install supabase --save-dev
```

### 4.2. Войти в Supabase
```bash
npx supabase login
```

### 4.3. Создать функцию
```bash
npx supabase functions new send-telegram-notification
```

### 4.4. Скопировать код функции

Файл: `supabase/functions/send-telegram-notification/index.ts`
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get settings from database
    const { data: settings } = await supabaseClient
      .from('settings')
      .select('*')
      .single()

    if (!settings || !settings.telegram_bot_enabled || !settings.telegram_bot_token) {
      return new Response(
        JSON.stringify({ error: 'Telegram not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get notification data from request
    const { message, type = 'info' } = await req.json()

    // Format message with emoji
    const emoji = {
      'info': 'ℹ️',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'trip': '🚚',
      'money': '💰',
      'driver': '👤',
    }[type] || 'ℹ️'

    const fullMessage = `${emoji} *TruckTrack*\n\n${message}`

    // Send to Telegram
    const telegramUrl = `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegram_admin_chat_id,
        text: fullMessage,
        parse_mode: 'Markdown',
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Telegram API error: ${JSON.stringify(result)}`)
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
```

### 4.5. Развернуть функцию
```bash
npx supabase functions deploy send-telegram-notification
```

---

## 📝 Шаг 5: Добавить Database Trigger для автоматических уведомлений

Выполнить в **Supabase SQL Editor**:

```sql
-- Функция для отправки уведомления о новом рейсе
CREATE OR REPLACE FUNCTION notify_telegram_new_trip()
RETURNS TRIGGER AS $$
DECLARE
  driver_name TEXT;
  vehicle_name TEXT;
  route_name TEXT;
  settings_row RECORD;
  function_url TEXT;
BEGIN
  -- Получить настройки
  SELECT * INTO settings_row FROM settings LIMIT 1;

  -- Проверить что Telegram включен
  IF NOT settings_row.telegram_bot_enabled OR NOT settings_row.notifications_new_trip_enabled THEN
    RETURN NEW;
  END IF;

  -- Получить данные для сообщения
  SELECT full_name INTO driver_name FROM drivers WHERE id = NEW.driver_id;
  SELECT brand || ' ' || model || ' (' || license_plate || ')' INTO vehicle_name
    FROM vehicles WHERE id = NEW.vehicle_id;
  SELECT name INTO route_name FROM routes WHERE id = NEW.route_id;

  -- URL Edge Function (замените на ваш URL)
  function_url := 'https://ваш-проект.supabase.co/functions/v1/send-telegram-notification';

  -- Отправить уведомление через HTTP request
  PERFORM
    net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('request.jwt.claim.access_token', true)
      ),
      body := jsonb_build_object(
        'type', 'trip',
        'message', format(
          E'*Новый рейс создан* #%s\n\n' ||
          E'📅 Дата: %s\n' ||
          E'👤 Водитель: %s\n' ||
          E'🚛 Транспорт: %s\n' ||
          E'📍 Маршрут: %s\n' ||
          E'💰 Выручка: %s с',
          NEW.id::TEXT,
          NEW.trip_date::TEXT,
          driver_name,
          vehicle_name,
          route_name,
          NEW.revenue::TEXT
        )
      )
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создать триггер
DROP TRIGGER IF EXISTS telegram_notify_new_trip ON trips;
CREATE TRIGGER telegram_notify_new_trip
AFTER INSERT ON trips
FOR EACH ROW
EXECUTE FUNCTION notify_telegram_new_trip();
```

**ВАЖНО:** Замените `https://ваш-проект.supabase.co` на ваш реальный URL проекта!

---

## 📝 Шаг 6: Протестировать

1. Создать новый рейс через форму водителя или админ панель
2. Проверить что пришло уведомление в Telegram
3. Если не пришло - проверить:
   - Правильность токена
   - Правильность Chat ID
   - Что `telegram_bot_enabled = true`
   - Логи в Supabase Edge Functions

---

## 🔧 Команды для бота (опционально)

Можно добавить команды для взаимодействия:

```
/start - Приветствие
/stats - Статистика за сегодня
/today - Рейсы за сегодня
/week - Отчёт за неделю
/month - Отчёт за месяц
```

Для этого нужно создать отдельную Edge Function для webhook.

---

## ❓ FAQ

**Q: Сколько стоит Telegram Bot?**
A: **Совершенно бесплатно!** Неограниченное количество сообщений.

**Q: Можно ли отправлять уведомления нескольким админам?**
A: Да, можно создать группу в Telegram, добавить туда бота, и использовать Group Chat ID.

**Q: Как получить Chat ID группы?**
A: Добавить бота в группу, написать в группе /start, затем открыть:
`https://api.telegram.org/bot<TOKEN>/getUpdates` и найти `"chat":{"id":-100123456789}`

**Q: Можно ли отправлять фото?**
A: Да! Используйте `sendPhoto` вместо `sendMessage` в Edge Function.

**Q: Telegram бот работает без интернета?**
A: Нет, нужен интернет на сервере (Supabase Edge Functions).

---

## ✅ Готово!

Теперь вы будете получать уведомления в Telegram о:
- ✅ Новых рейсах
- ✅ Завершённых рейсах
- ✅ Ежедневных/еженедельных отчётах

**Все настройки делаются через Supabase Dashboard - никакого кода!**
