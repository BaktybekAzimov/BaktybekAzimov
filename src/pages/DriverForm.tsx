import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CheckCircle, Truck, Lock, Shield } from 'lucide-react';

// Иконка валюты (динамическая)
const CurrencyIcon: React.FC<{ className?: string }> = ({ className }) => {
  const currency = localStorage.getItem('currency') || 'KGS';
  const symbols: Record<string, string> = { KGS: 'с', USD: '$', RUB: '₽' };
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <text x="6" y="17" fontSize="14" fontWeight="bold" stroke="none" fill="currentColor">{symbols[currency] || 'с'}</text>
    </svg>
  );
};
import { supabase } from '../lib/supabase';
import { formatCurrency, calculateTripFinancials } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface Driver {
  id: string;
  full_name: string;
  phone: string;
  pin_code?: string;
  hire_date: string;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface Route {
  id: string;
  name: string;
  distance_km: number;
  avg_cost: number;
  created_at?: string;
}

interface FuelSettings {
  fuel_price_per_liter: number;
  default_fuel_consumption: number;
}

interface DriverTripFormData {
  trip_date: string;
  route_id: string;
  revenue: number;
  fuel_cost: number;
  other_costs: number;
}

export const DriverForm: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [fuelSettings, setFuelSettings] = useState<FuelSettings>({
    fuel_price_per_liter: 58,
    default_fuel_consumption: 30,
  });

  // Авторизация по телефону + PIN
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'phone' | 'pin' | 'create_pin'>('phone');
  const [authPhone, setAuthPhone] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authAttempts, setAuthAttempts] = useState(0);
  const [authenticatedDriver, setAuthenticatedDriver] = useState<Driver | null>(null);
  const [foundDriver, setFoundDriver] = useState<Driver | null>(null);
  const MAX_AUTH_ATTEMPTS = 5;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DriverTripFormData>({
    defaultValues: {
      trip_date: new Date().toISOString().split('T')[0],
      revenue: 0,
      fuel_cost: 0,
      other_costs: 0,
    },
  });

  // Watch form values for auto-calculation
  const revenue = watch('revenue') || 0;
  const fuelCost = watch('fuel_cost') || 0;
  const otherCosts = watch('other_costs') || 0;
  const selectedRouteId = watch('route_id');

  const calculatedValues = calculateTripFinancials(
    Number(revenue),
    Number(fuelCost),
    0, // No maintenance cost in driver form
    Number(otherCosts)
  );

  // Auto-fill fuel cost and revenue when route changes
  useEffect(() => {
    if (selectedRouteId && routes.length > 0) {
      const route = routes.find(r => r.id === selectedRouteId);
      if (route) {
        // Auto-calculate fuel cost
        const calculatedFuel = Math.round(
          (route.distance_km * fuelSettings.default_fuel_consumption / 100) * fuelSettings.fuel_price_per_liter
        );
        if (calculatedFuel > 0) {
          setValue('fuel_cost', calculatedFuel);
        }
        // Auto-fill revenue from standard price
        if (route.avg_cost > 0) {
          setValue('revenue', route.avg_cost);
        }
      }
    }
  }, [selectedRouteId, routes, fuelSettings]);

  useEffect(() => {
    // Check if already authenticated in this session
    const savedDriverId = sessionStorage.getItem('driverFormDriverId');
    if (savedDriverId) {
      // Restore authenticated driver from session
      restoreSession(savedDriverId);
    } else {
      setLoading(false);
    }
  }, []);

  // Restore session from saved driver ID
  const restoreSession = async (driverId: string) => {
    try {
      setLoading(true);
      const { data: driver, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', driverId)
        .eq('status', 'active')
        .single();

      if (error || !driver) {
        sessionStorage.removeItem('driverFormDriverId');
        setLoading(false);
        return;
      }

      setAuthenticatedDriver(driver);
      setIsAuthenticated(true);
      await fetchData();
    } catch {
      sessionStorage.removeItem('driverFormDriverId');
      setLoading(false);
    }
  };

  // Нормализация телефона для сравнения
  const normalizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  // Step 1: Find driver by phone
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!authPhone) {
      setAuthError('Введите номер телефона');
      return;
    }

    try {
      setLoading(true);

      // Find driver by phone
      const { data: allDrivers, error } = await supabase
        .from('drivers')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      // Normalize phone for comparison
      const normalizedInputPhone = normalizePhone(authPhone);

      const driver = allDrivers?.find(d => {
        const normalizedDriverPhone = normalizePhone(d.phone);
        return normalizedDriverPhone === normalizedInputPhone;
      });

      if (!driver) {
        setAuthError('Водитель с таким номером не найден. Обратитесь к администратору.');
        setLoading(false);
        return;
      }

      setFoundDriver(driver);

      // Check if driver has PIN
      if (driver.pin_code) {
        // Has PIN - go to PIN entry step
        setAuthStep('pin');
      } else {
        // No PIN - go to PIN creation step
        setAuthStep('create_pin');
      }
      setLoading(false);
    } catch (err) {
      console.error('Phone lookup error:', err);
      setAuthError('Ошибка поиска. Попробуйте позже.');
      setLoading(false);
    }
  };

  // Step 2a: Verify existing PIN
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authAttempts >= MAX_AUTH_ATTEMPTS) {
      setAuthError('Слишком много попыток. Попробуйте позже.');
      return;
    }

    if (!authPin || authPin.length < 4) {
      setAuthError('Введите 4-значный PIN-код');
      return;
    }

    if (!foundDriver) {
      setAuthStep('phone');
      return;
    }

    if (foundDriver.pin_code === authPin) {
      // PIN correct - authenticate
      setAuthenticatedDriver(foundDriver);
      setIsAuthenticated(true);
      sessionStorage.setItem('driverFormDriverId', foundDriver.id);
      await fetchData();
    } else {
      setAuthAttempts(prev => prev + 1);
      const remaining = MAX_AUTH_ATTEMPTS - authAttempts - 1;
      setAuthError(`Неверный PIN-код. Осталось попыток: ${remaining}`);
      setAuthPin('');
    }
  };

  // Step 2b: Create new PIN
  const handleCreatePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!newPin || newPin.length < 4) {
      setAuthError('PIN-код должен содержать 4 цифры');
      return;
    }

    if (newPin !== confirmPin) {
      setAuthError('PIN-коды не совпадают');
      setConfirmPin('');
      return;
    }

    if (!foundDriver) {
      setAuthStep('phone');
      return;
    }

    try {
      setLoading(true);

      // Save PIN to database
      const { error } = await supabase
        .from('drivers')
        .update({ pin_code: newPin })
        .eq('id', foundDriver.id);

      if (error) throw error;

      // Update foundDriver with new PIN
      const updatedDriver = { ...foundDriver, pin_code: newPin };
      setAuthenticatedDriver(updatedDriver);
      setIsAuthenticated(true);
      sessionStorage.setItem('driverFormDriverId', foundDriver.id);
      await fetchData();
    } catch (err) {
      console.error('PIN creation error:', err);
      setAuthError('Не удалось сохранить PIN-код. Попробуйте позже.');
      setLoading(false);
    }
  };

  // Logout driver
  const handleLogout = () => {
    sessionStorage.removeItem('driverFormDriverId');
    setIsAuthenticated(false);
    setAuthenticatedDriver(null);
    setFoundDriver(null);
    setAuthStep('phone');
    setAuthPhone('');
    setAuthPin('');
    setNewPin('');
    setConfirmPin('');
    setAuthAttempts(0);
    setAuthError(null);
  };

  // Go back to phone step
  const handleBackToPhone = () => {
    setAuthStep('phone');
    setFoundDriver(null);
    setAuthPin('');
    setNewPin('');
    setConfirmPin('');
    setAuthError(null);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch routes and settings in parallel
      const [routesRes, settingsRes] = await Promise.all([
        supabase.from('routes').select('*').order('name'),
        supabase.from('settings').select('fuel_price_per_liter, default_fuel_consumption').single(),
      ]);

      if (routesRes.error) throw routesRes.error;

      setRoutes(routesRes.data || []);

      // Set fuel settings if available
      if (settingsRes.data) {
        setFuelSettings({
          fuel_price_per_liter: settingsRes.data.fuel_price_per_liter || 58,
          default_fuel_consumption: settingsRes.data.default_fuel_consumption || 30,
        });
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(t('driver_form.load_error'));
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DriverTripFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      // Use authenticated driver
      if (!authenticatedDriver) {
        throw new Error('Необходимо авторизоваться');
      }

      const calculated = calculateTripFinancials(
        Number(data.revenue),
        Number(data.fuel_cost),
        0, // No maintenance cost
        Number(data.other_costs)
      );

      // For now, we'll use a default vehicle (you might want to add vehicle selection)
      // or handle this differently based on your requirements
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id')
        .eq('status', 'available')
        .limit(1);

      if (!vehicles || vehicles.length === 0) {
        throw new Error(t('driver_form.no_vehicles'));
      }

      const tripData = {
        trip_date: data.trip_date,
        driver_id: authenticatedDriver.id,
        vehicle_id: vehicles[0].id, // Use first available vehicle
        route_id: data.route_id,
        revenue: Number(data.revenue),
        fuel_cost: Number(data.fuel_cost),
        maintenance_cost: 0,
        other_costs: Number(data.other_costs),
        total_costs: calculated.totalCosts,
        net_profit: calculated.netProfit,
        driver_payment: calculated.driverPayment,
        owner_payment: calculated.ownerPayment,
        status: 'completed',
        comment: `Создано водителем: ${authenticatedDriver.full_name}`,
      };

      const { error } = await supabase.from('trips').insert([tripData]);

      if (error) throw error;

      // Убедиться, что водитель помечен как свободный после сдачи отчёта
      await supabase
        .from('drivers')
        .update({ availability: 'available' })
        .eq('id', authenticatedDriver.id)
        .neq('availability', 'off_duty'); // Не менять если "Не на смене"

      setSuccess(true);
      reset({
        trip_date: new Date().toISOString().split('T')[0],
        route_id: '',
        revenue: 0,
        fuel_cost: 0,
        other_costs: 0,
      });

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Error saving trip:', err);
      setError(err.message || t('driver_form.save_error'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-950 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Экран авторизации - многошаговый процесс
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="shadow-strong">
            {/* Шаг 1: Ввод телефона */}
            {authStep === 'phone' && (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                    Вход для водителя
                  </h1>
                  <p className="text-secondary-600 dark:text-secondary-400">
                    Введите ваш номер телефона
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                    <p className="text-error-700 dark:text-error-400 text-sm font-medium">{authError}</p>
                  </div>
                )}

                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Номер телефона
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full px-4 py-3 text-lg border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-800 dark:text-white"
                      placeholder="+996 XXX XXX XXX"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={!authPhone}
                    isLoading={loading}
                  >
                    Продолжить
                  </Button>
                </form>

                <p className="text-center text-xs text-secondary-500 dark:text-secondary-400 mt-6">
                  Используйте телефон, указанный при регистрации
                </p>
              </>
            )}

            {/* Шаг 2a: Ввод существующего PIN */}
            {authStep === 'pin' && (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                    Введите PIN-код
                  </h1>
                  {foundDriver && (
                    <p className="text-primary-600 dark:text-primary-400 font-medium">
                      {foundDriver.full_name}
                    </p>
                  )}
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                    <p className="text-error-700 dark:text-error-400 text-sm font-medium">{authError}</p>
                  </div>
                )}

                {authAttempts >= MAX_AUTH_ATTEMPTS ? (
                  <div className="text-center py-8">
                    <Lock className="w-12 h-12 text-error-500 mx-auto mb-4" />
                    <p className="text-secondary-700 dark:text-secondary-300">
                      Слишком много неудачных попыток. Обратитесь к администратору.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePinSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        PIN-код (4 цифры)
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        value={authPin}
                        onChange={(e) => setAuthPin(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-800 dark:text-white"
                        placeholder="••••"
                        autoFocus
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={authPin.length < 4}
                      isLoading={loading}
                      icon={<Lock size={20} />}
                    >
                      Войти
                    </Button>
                    <button
                      type="button"
                      onClick={handleBackToPhone}
                      className="w-full text-sm text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
                    >
                      ← Другой номер
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Шаг 2b: Создание нового PIN */}
            {authStep === 'create_pin' && (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-success-600 rounded-2xl mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                    Создайте PIN-код
                  </h1>
                  {foundDriver && (
                    <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                      {foundDriver.full_name}
                    </p>
                  )}
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                    Придумайте 4-значный PIN для быстрого входа
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
                    <p className="text-error-700 dark:text-error-400 text-sm font-medium">{authError}</p>
                  </div>
                )}

                <form onSubmit={handleCreatePinSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Придумайте PIN-код
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-800 dark:text-white"
                      placeholder="••••"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Повторите PIN-код
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-800 dark:text-white"
                      placeholder="••••"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={newPin.length < 4 || confirmPin.length < 4}
                    isLoading={loading}
                  >
                    Создать и войти
                  </Button>
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="w-full text-sm text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300"
                  >
                    ← Другой номер
                  </button>
                </form>

                <p className="text-center text-xs text-secondary-500 dark:text-secondary-400 mt-6">
                  Запомните этот PIN - он понадобится для входа в следующий раз
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-secondary-900 dark:to-secondary-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
            {t('driver_form.title')}
          </h1>
          {authenticatedDriver && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg font-medium text-primary-600 dark:text-primary-400">
                👋 {authenticatedDriver.full_name}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-secondary-500 hover:text-error-500 underline"
              >
                Выйти
              </button>
            </div>
          )}
          <p className="text-secondary-600 dark:text-secondary-400">
            {t('driver_form.subtitle')}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 bg-success-50 dark:bg-success-900/20 border-2 border-success-500 dark:border-success-700 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 text-success-700 dark:text-success-400">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">{t('driver_form.success')}</p>
                <p className="text-sm">{t('driver_form.success_desc')}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 bg-error-50 dark:bg-error-900/20 border-2 border-error-500 dark:border-error-700">
            <p className="text-error-700 dark:text-error-400 font-medium">{error}</p>
          </Card>
        )}

        {/* Form */}
        <Card className="shadow-strong">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Date */}
            <Input
              label={t('driver_form.trip_date')}
              type="date"
              {...register('trip_date', { required: t('driver_form.date_required') })}
              error={errors.trip_date?.message}
            />

            {/* Route */}
            <Select
              label={t('driver_form.route')}
              {...register('route_id', { required: t('driver_form.select_route') })}
              options={routes.map((r) => ({
                value: r.id,
                label: `${r.name} (${r.distance_km} ${t('routes.km')})`,
              }))}
              error={errors.route_id?.message}
            />

            {/* Revenue */}
            <Input
              label={t('driver_form.revenue')}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('revenue', {
                required: t('driver_form.revenue_required'),
                min: { value: 0, message: t('driver_form.revenue_positive') },
              })}
              error={errors.revenue?.message}
            />

            {/* Fuel Cost */}
            <Input
              label={t('driver_form.fuel_cost')}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('fuel_cost', {
                required: t('driver_form.fuel_required'),
                min: { value: 0, message: t('driver_form.cost_positive') },
              })}
              error={errors.fuel_cost?.message}
            />

            {/* Other Costs */}
            <Input
              label={t('driver_form.other_costs')}
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              helperText={t('driver_form.other_costs_hint')}
              {...register('other_costs', {
                min: { value: 0, message: t('driver_form.cost_positive') },
              })}
              error={errors.other_costs?.message}
            />

            {/* Calculated Driver Payment */}
            <Card className="bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-200 dark:border-primary-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-600 rounded-xl">
                    <CurrencyIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
                      {t('driver_form.your_payment')}
                    </p>
                    <p className="text-2xl font-bold text-primary-700 dark:text-primary-400 font-mono">
                      {formatCurrency(calculatedValues.driverPayment)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary-200 dark:border-primary-800 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-secondary-600 dark:text-secondary-400">{t('driver_form.net_profit')}</p>
                  <p className="font-mono font-semibold text-success-700 dark:text-success-400">
                    {formatCurrency(calculatedValues.netProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600 dark:text-secondary-400">{t('driver_form.total_costs')}</p>
                  <p className="font-mono font-semibold text-error-700 dark:text-error-400">
                    {formatCurrency(calculatedValues.totalCosts)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={submitting}
              className="w-full text-lg py-4"
              size="lg"
            >
              {t('driver_form.submit')}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-secondary-500 dark:text-secondary-400 mt-6">
          {t('driver_form.footer')}
        </p>
      </div>
    </div>
  );
};
