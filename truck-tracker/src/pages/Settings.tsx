import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Settings as SettingsIcon, DollarSign, Percent, Globe, Save, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface AppSettings {
  driver_payment_percentage: number;
  currency: 'KGS' | 'USD' | 'RUB';
  language: 'ru' | 'ky';
  expense_types: string[];
}

export const Settings: React.FC = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<AppSettings>({
    driver_payment_percentage: 30,
    currency: 'KGS',
    language: 'ru',
    expense_types: ['Топливо', 'Обслуживание', 'Прочие расходы'],
  });
  const [newExpenseType, setNewExpenseType] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Загрузка настроек из localStorage (или можно создать таблицу settings в Supabase)
      const savedSettings = localStorage.getItem('app_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // Сохранение в localStorage (или в Supabase)
      localStorage.setItem('app_settings', JSON.stringify(settings));

      // Показать уведомление об успехе
      alert('Настройки успешно сохранены!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ошибка при сохранении настроек');
    } finally {
      setSaving(false);
    }
  };

  const addExpenseType = () => {
    if (newExpenseType.trim()) {
      setSettings({
        ...settings,
        expense_types: [...settings.expense_types, newExpenseType.trim()],
      });
      setNewExpenseType('');
    }
  };

  const removeExpenseType = (index: number) => {
    setSettings({
      ...settings,
      expense_types: settings.expense_types.filter((_, i) => i !== index),
    });
  };

  const currencyOptions = [
    { value: 'KGS', label: '🇰🇬 Сом (KGS)' },
    { value: 'USD', label: '🇺🇸 Доллар (USD)' },
    { value: 'RUB', label: '🇷🇺 Рубль (RUB)' },
  ];

  const languageOptions = [
    { value: 'ru', label: '🇷🇺 Русский' },
    { value: 'ky', label: '🇰🇬 Кыргызча' },
  ];

  if (!isAdmin) {
    return (
      <MainLayout>
        <Header title="Настройки" />
        <div className="p-8">
          <Card className="bg-error-50 border border-error-200">
            <p className="text-error-700">У вас нет прав для доступа к настройкам</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <Header title="Настройки" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Настройки системы"
        subtitle="Управление параметрами приложения"
        icon={SettingsIcon}
        actions={
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Финансовые настройки */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Финансовые параметры
              </h3>
              <p className="text-sm text-secondary-500">
                Настройки расчётов и валюты
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Процент водителя */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Процент выплаты водителю
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.driver_payment_percentage}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      driver_payment_percentage: Number(e.target.value),
                    })
                  }
                  className="pr-12"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Percent className="w-5 h-5 text-secondary-400" />
                </div>
              </div>
              <p className="mt-2 text-sm text-secondary-500">
                Текущий: {settings.driver_payment_percentage}% водителю,{' '}
                {100 - settings.driver_payment_percentage}% владельцу
              </p>
            </div>

            {/* Валюта */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Валюта по умолчанию
              </label>
              <Select
                value={settings.currency}
                onChange={(value) =>
                  setSettings({
                    ...settings,
                    currency: value as AppSettings['currency'],
                  })
                }
                options={currencyOptions}
              />
              <p className="mt-2 text-sm text-secondary-500">
                Используется для всех финансовых расчётов
              </p>
            </div>
          </div>
        </Card>

        {/* Региональные настройки */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900">
                Региональные настройки
              </h3>
              <p className="text-sm text-secondary-500">
                Язык интерфейса и форматы
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Язык интерфейса
            </label>
            <Select
              value={settings.language}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  language: value as AppSettings['language'],
                })
              }
              options={languageOptions}
            />
            <p className="mt-2 text-sm text-warning-600 font-medium">
              ⚠️ Переключение языка будет доступно в следующей версии
            </p>
          </div>
        </Card>

        {/* Типы расходов */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Типы расходов
            </h3>
            <p className="text-sm text-secondary-500">
              Управление категориями расходов для рейсов
            </p>
          </div>

          {/* Список типов расходов */}
          <div className="space-y-3 mb-4">
            {settings.expense_types.map((type, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
              >
                <span className="text-secondary-900">{type}</span>
                <button
                  onClick={() => removeExpenseType(index)}
                  className="p-2 text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                  disabled={settings.expense_types.length <= 1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Добавить новый тип */}
          <div className="flex gap-3">
            <Input
              value={newExpenseType}
              onChange={(e) => setNewExpenseType(e.target.value)}
              placeholder="Введите новый тип расхода..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addExpenseType();
                }
              }}
            />
            <Button onClick={addExpenseType} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Добавить
            </Button>
          </div>
        </Card>

        {/* Информация */}
        <Card className="bg-primary-50 border border-primary-200">
          <h4 className="font-semibold text-primary-900 mb-2">
            ℹ️ Важная информация
          </h4>
          <ul className="text-sm text-primary-700 space-y-1">
            <li>• После изменения процента выплат новые рейсы будут использовать новое значение</li>
            <li>• Старые рейсы сохранят прежние расчёты</li>
            <li>• Для применения нового процента к существующим рейсам потребуется пересчёт в БД</li>
            <li>• Изменение валюты не конвертирует существующие суммы автоматически</li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
};
