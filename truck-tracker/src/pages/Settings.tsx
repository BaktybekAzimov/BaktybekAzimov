import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  Settings as SettingsIcon,
  Percent,
  Globe,
  Save,
  MessageCircle,
  BarChart3,
  Eye,
  EyeOff,
  Check,
  Type,
} from 'lucide-react';

// Иконка сома (KGS)
const SomIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <text x="6" y="17" fontSize="14" fontWeight="bold" stroke="none" fill="currentColor">с</text>
  </svg>
);
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useFontSize } from '../contexts/FontSizeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface SupabaseSettings {
  id: string;
  driver_payment_percentage: number;
  currency: 'KGS' | 'USD' | 'RUB';
  language: 'ru' | 'ky';

  // Telegram
  telegram_bot_token: string | null;
  telegram_bot_enabled: boolean;
  telegram_admin_chat_id: string | null;
  telegram_notifications_enabled: boolean;

  // Виджеты аналитики
  widget_revenue_chart_enabled: boolean;
  widget_routes_chart_enabled: boolean;
  widget_recent_trips_enabled: boolean;
  widget_vehicle_utilization_enabled: boolean;
  widget_top_drivers_enabled: boolean;
  widget_monthly_comparison_enabled: boolean;

  // Уведомления
  notifications_new_trip_enabled: boolean;
  notifications_trip_completed_enabled: boolean;
  notifications_daily_report_enabled: boolean;
  notifications_weekly_report_enabled: boolean;
}

export const Settings: React.FC = () => {
  const { fontSize, setFontSize } = useFontSize();
  const { isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<SupabaseSettings | null>(null);
  const [showTelegramToken, setShowTelegramToken] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadSettings();
    }
  }, [isAdmin]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (fetchError) {
        // Если таблицы нет, показать предупреждение
        throw new Error(t('settings.table_not_found'));
      }

      setSettings(data);

      // Синхронизировать язык
      if (data.language && data.language !== language) {
        setLanguage(data.language as 'ru' | 'ky');
      }
    } catch (err: any) {
      console.error('Error loading settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const { error: updateError } = await supabase
        .from('settings')
        .update({
          driver_payment_percentage: settings.driver_payment_percentage,
          currency: settings.currency,
          language: settings.language,
          telegram_bot_token: settings.telegram_bot_token,
          telegram_bot_enabled: settings.telegram_bot_enabled,
          telegram_admin_chat_id: settings.telegram_admin_chat_id,
          telegram_notifications_enabled: settings.telegram_notifications_enabled,
          widget_revenue_chart_enabled: settings.widget_revenue_chart_enabled,
          widget_routes_chart_enabled: settings.widget_routes_chart_enabled,
          widget_recent_trips_enabled: settings.widget_recent_trips_enabled,
          widget_vehicle_utilization_enabled: settings.widget_vehicle_utilization_enabled,
          widget_top_drivers_enabled: settings.widget_top_drivers_enabled,
          widget_monthly_comparison_enabled: settings.widget_monthly_comparison_enabled,
          notifications_new_trip_enabled: settings.notifications_new_trip_enabled,
          notifications_trip_completed_enabled: settings.notifications_trip_completed_enabled,
          notifications_daily_report_enabled: settings.notifications_daily_report_enabled,
          notifications_weekly_report_enabled: settings.notifications_weekly_report_enabled,
        })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Обновить язык если изменился
      if (settings.language !== language) {
        setLanguage(settings.language as 'ru' | 'ky');
      }
    } catch (err: any) {
      console.error('Error saving settings:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleWidget = (widgetKey: keyof SupabaseSettings) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [widgetKey]: !settings[widgetKey],
    });
  };

  const currencyOptions = [
    { value: 'KGS', label: t('settings.currency_kgs') },
    { value: 'USD', label: t('settings.currency_usd') },
    { value: 'RUB', label: t('settings.currency_rub') },
  ];

  const languageOptions = [
    { value: 'ru', label: t('settings.lang_ru') },
    { value: 'ky', label: t('settings.lang_ky') },
  ];

  if (!isAdmin) {
    return (
      <MainLayout>
        <Header title={t('settings.title')} icon={SettingsIcon} />
        <div className="p-8">
          <Card className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p className="text-error-700 dark:text-error-400">{t('error.no_access')}</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <Header title={t('settings.title')} icon={SettingsIcon} />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Header title={t('settings.title')} icon={SettingsIcon} />
        <div className="p-8">
          <Card className="bg-error-50 dark:bg-error-900/20 border-2 border-error-200 dark:border-error-800">
            <h3 className="text-error-900 dark:text-error-300 font-semibold mb-2">{t('error.loading')}</h3>
            <p className="text-error-700 dark:text-error-400 text-sm mb-4">{error}</p>
            <p className="text-error-600 dark:text-error-500 text-xs">
              {t('settings.run_sql')}: <code className="bg-error-100 dark:bg-error-900/30 px-2 py-1 rounded">supabase/create-settings-table.sql</code>
            </p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!settings) {
    return null;
  }

  return (
    <MainLayout>
      <Header
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        icon={SettingsIcon}
        actions={
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? t('common.saving') : t('settings.save')}
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {/* Success Message */}
        {success && (
          <Card className="bg-success-50 dark:bg-success-900/20 border-2 border-success-500 animate-in fade-in">
            <div className="flex items-center gap-3 text-success-700 dark:text-success-400">
              <Check className="w-5 h-5" />
              <p className="font-semibold">{t('settings.saved')}</p>
            </div>
          </Card>
        )}

        {/* Финансовые настройки */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
              <SomIcon className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {t('settings.financial')}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('settings.financial_desc')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Процент водителя */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                {t('settings.driver_percentage')}
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
              <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                {t('common.driver_share')}: {settings.driver_payment_percentage}%, {t('common.owner_share')}: {100 - settings.driver_payment_percentage}%
              </p>
            </div>

            {/* Валюта */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                {t('settings.currency')}
              </label>
              <Select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    currency: e.target.value as 'KGS' | 'USD' | 'RUB',
                  })
                }
                options={currencyOptions}
              />
              <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">
                {t('settings.currency_desc')}
              </p>
            </div>
          </div>
        </Card>

        {/* Региональные настройки */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {t('settings.regional')}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('settings.regional_desc')}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              {t('settings.language')}
            </label>
            <Select
              value={settings.language}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  language: e.target.value as 'ru' | 'ky',
                })
              }
              options={languageOptions}
            />
            <p className="mt-2 text-sm text-success-600 dark:text-success-400 font-medium">
              ✅ {t('settings.language_switch_active')}
            </p>
          </div>
        </Card>

        {/* Настройки внешнего вида */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Type className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {t('settings.appearance')}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('settings.appearance_desc')}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
              {t('settings.font_size')}
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFontSize("small")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  fontSize === "small"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                    : "border-secondary-300 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                <div className="text-center">
                  <div className="text-xs font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                    {t('settings.font_small')}
                  </div>
                  <div className="text-lg font-bold text-secondary-700 dark:text-secondary-300">
                    Aa
                  </div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    13px
                  </div>
                </div>
              </button>

              <button
                onClick={() => setFontSize("medium")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  fontSize === "medium"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                    : "border-secondary-300 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                    {t('settings.font_medium')}
                  </div>
                  <div className="text-xl font-bold text-secondary-700 dark:text-secondary-300">
                    Aa
                  </div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    15px
                  </div>
                </div>
              </button>

              <button
                onClick={() => setFontSize("large")}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  fontSize === "large"
                    ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                    : "border-secondary-300 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-700"
                }`}
              >
                <div className="text-center">
                  <div className="text-base font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                    {t('settings.font_large')}
                  </div>
                  <div className="text-2xl font-bold text-secondary-700 dark:text-secondary-300">
                    Aa
                  </div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    18px
                  </div>
                </div>
              </button>
            </div>
            <p className="mt-3 text-sm text-secondary-500 dark:text-secondary-400">
              💡 {t('settings.font_hint')}
            </p>
          </div>
        </Card>

        {/* Telegram Интеграция */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {t('telegram.title')}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('telegram.subtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Включить Telegram */}
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">{t('telegram.enable')}</p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">{t('telegram.activate')}</p>
              </div>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    telegram_bot_enabled: !settings.telegram_bot_enabled,
                  })
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.telegram_bot_enabled ? 'bg-success-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.telegram_bot_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Bot Token */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                {t('telegram.token')}
              </label>
              <div className="relative">
                <Input
                  type={showTelegramToken ? 'text' : 'password'}
                  value={settings.telegram_bot_token || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      telegram_bot_token: e.target.value,
                    })
                  }
                  placeholder="6789012345:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw"
                />
                <button
                  type="button"
                  onClick={() => setShowTelegramToken(!showTelegramToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                >
                  {showTelegramToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Admin Chat ID */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                {t('telegram.chat_id')}
              </label>
              <Input
                type="text"
                value={settings.telegram_admin_chat_id || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    telegram_admin_chat_id: e.target.value,
                  })
                }
                placeholder="123456789"
              />
              <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400">
                {t('settings.get_chat_id')}
              </p>
            </div>

            {/* Уведомления */}
            <div>
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">{t('telegram.notifications')}</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications_new_trip_enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications_new_trip_enabled: e.target.checked,
                      })
                    }
                    className="rounded border-secondary-300 dark:border-secondary-600"
                  />
                  <span className="text-sm text-secondary-900 dark:text-secondary-100">{t('telegram.new_trip')}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications_trip_completed_enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications_trip_completed_enabled: e.target.checked,
                      })
                    }
                    className="rounded border-secondary-300 dark:border-secondary-600"
                  />
                  <span className="text-sm text-secondary-900 dark:text-secondary-100">{t('telegram.trip_completed')}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications_daily_report_enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications_daily_report_enabled: e.target.checked,
                      })
                    }
                    className="rounded border-secondary-300 dark:border-secondary-600"
                  />
                  <span className="text-sm text-secondary-900 dark:text-secondary-100">{t('telegram.daily_report')}</span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.notifications_weekly_report_enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        notifications_weekly_report_enabled: e.target.checked,
                      })
                    }
                    className="rounded border-secondary-300 dark:border-secondary-600"
                  />
                  <span className="text-sm text-secondary-900 dark:text-secondary-100">{t('telegram.weekly_report')}</span>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Виджеты аналитики */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                {t('widgets.title')}
              </h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                {t('widgets.subtitle')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Revenue Chart */}
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">{t('widgets.revenue_chart')}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('widgets.revenue_desc')}</p>
              </div>
              <button
                onClick={() => toggleWidget('widget_revenue_chart_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.widget_revenue_chart_enabled ? 'bg-success-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.widget_revenue_chart_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Routes Chart */}
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">{t('widgets.routes_chart')}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('widgets.routes_desc')}</p>
              </div>
              <button
                onClick={() => toggleWidget('widget_routes_chart_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.widget_routes_chart_enabled ? 'bg-success-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.widget_routes_chart_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Recent Trips */}
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">{t('widgets.recent_trips')}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('widgets.recent_trips_desc')}</p>
              </div>
              <button
                onClick={() => toggleWidget('widget_recent_trips_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.widget_recent_trips_enabled ? 'bg-success-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.widget_recent_trips_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Vehicle Utilization */}
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">{t('widgets.vehicle_utilization')}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('widgets.vehicle_utilization_desc')}</p>
              </div>
              <button
                onClick={() => toggleWidget('widget_vehicle_utilization_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.widget_vehicle_utilization_enabled ? 'bg-success-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.widget_vehicle_utilization_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Top Drivers */}
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">{t('widgets.top_drivers')}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('widgets.top_drivers_desc')}</p>
              </div>
              <button
                onClick={() => toggleWidget('widget_top_drivers_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.widget_top_drivers_enabled ? 'bg-success-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.widget_top_drivers_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Monthly Comparison */}
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100">{t('widgets.monthly_comparison')}</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">{t('widgets.monthly_comparison_desc')}</p>
              </div>
              <button
                onClick={() => toggleWidget('widget_monthly_comparison_enabled')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.widget_monthly_comparison_enabled ? 'bg-success-600' : 'bg-secondary-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.widget_monthly_comparison_enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Информация */}
        <Card className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <h4 className="font-semibold text-primary-900 dark:text-primary-300 mb-2">
            ℹ️ {t('settings.info_title')}
          </h4>
          <ul className="text-sm text-primary-700 dark:text-primary-400 space-y-1">
            <li>• {t('settings.info_1')}</li>
            <li>• {t('settings.info_2')}</li>
            <li>• {t('settings.info_3')}</li>
            <li>• {t('settings.info_4')}</li>
            <li>• {t('settings.info_5')}</li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
};
