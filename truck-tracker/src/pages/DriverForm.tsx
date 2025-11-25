import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { CheckCircle, Truck } from 'lucide-react';

// Иконка сома (KGS)
const SomIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <text x="6" y="17" fontSize="14" fontWeight="bold" stroke="none" fill="currentColor">с</text>
  </svg>
);
import { supabase } from '../lib/supabase';
import { formatCurrency, calculateTripFinancials } from '../lib/utils';

interface Driver {
  id: string;
  full_name: string;
  phone: string;
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

interface DriverTripFormData {
  driver_name: string;
  trip_date: string;
  route_id: string;
  revenue: number;
  fuel_cost: number;
  other_costs: number;
}

export const DriverForm: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const calculatedValues = calculateTripFinancials(
    Number(revenue),
    Number(fuelCost),
    0, // No maintenance cost in driver form
    Number(otherCosts)
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch drivers and routes in parallel
      const [driversRes, routesRes] = await Promise.all([
        supabase.from('drivers').select('*').eq('status', 'active').order('full_name'),
        supabase.from('routes').select('*').order('name'),
      ]);

      if (driversRes.error) throw driversRes.error;
      if (routesRes.error) throw routesRes.error;

      setDrivers(driversRes.data || []);
      setRoutes(routesRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: DriverTripFormData) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(false);

      const calculated = calculateTripFinancials(
        Number(data.revenue),
        Number(data.fuel_cost),
        0, // No maintenance cost
        Number(data.other_costs)
      );

      // Find the driver by name to get the ID
      const driver = drivers.find((d) => d.full_name === data.driver_name);
      if (!driver) {
        throw new Error('Водитель не найден');
      }

      // For now, we'll use a default vehicle (you might want to add vehicle selection)
      // or handle this differently based on your requirements
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id')
        .eq('status', 'available')
        .limit(1);

      if (!vehicles || vehicles.length === 0) {
        throw new Error('Нет доступных автомобилей');
      }

      const tripData = {
        trip_date: data.trip_date,
        driver_id: driver.id,
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
        comment: 'Создано водителем через форму',
      };

      const { error } = await supabase.from('trips').insert([tripData]);

      if (error) throw error;

      setSuccess(true);
      reset({
        driver_name: '',
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
      setError(err.message || 'Не удалось сохранить рейс');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Форма рейса
          </h1>
          <p className="text-secondary-600">
            Быстрое добавление нового рейса
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 bg-success-50 border-2 border-success-500 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 text-success-700">
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-semibold">Рейс успешно добавлен!</p>
                <p className="text-sm">Данные сохранены в системе.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 bg-error-50 border-2 border-error-500">
            <p className="text-error-700 font-medium">{error}</p>
          </Card>
        )}

        {/* Form */}
        <Card className="shadow-strong">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Driver Selection */}
            <Select
              label="Водитель"
              {...register('driver_name', { required: 'Выберите водителя' })}
              options={drivers.map((d) => ({
                value: d.full_name,
                label: d.full_name,
              }))}
              error={errors.driver_name?.message}
            />

            {/* Date */}
            <Input
              label="Дата рейса"
              type="date"
              {...register('trip_date', { required: 'Дата обязательна' })}
              error={errors.trip_date?.message}
            />

            {/* Route */}
            <Select
              label="Маршрут"
              {...register('route_id', { required: 'Выберите маршрут' })}
              options={routes.map((r) => ({
                value: r.id,
                label: `${r.name} (${r.distance_km} км)`,
              }))}
              error={errors.route_id?.message}
            />

            {/* Revenue */}
            <Input
              label="Выручка"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('revenue', {
                required: 'Выручка обязательна',
                min: { value: 0, message: 'Выручка должна быть положительной' },
              })}
              error={errors.revenue?.message}
            />

            {/* Fuel Cost */}
            <Input
              label="Расход на топливо"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              {...register('fuel_cost', {
                required: 'Расход на топливо обязателен',
                min: { value: 0, message: 'Расход должен быть положительным' },
              })}
              error={errors.fuel_cost?.message}
            />

            {/* Other Costs */}
            <Input
              label="Прочие расходы"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              helperText="Парковка, питание, и т.д."
              {...register('other_costs', {
                min: { value: 0, message: 'Расход должен быть положительным' },
              })}
              error={errors.other_costs?.message}
            />

            {/* Calculated Driver Payment */}
            <Card className="bg-primary-50 border-2 border-primary-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary-600 rounded-xl">
                    <SomIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 font-medium">
                      Ваша выплата (30%)
                    </p>
                    <p className="text-2xl font-bold text-primary-700 font-mono">
                      {formatCurrency(calculatedValues.driverPayment)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-secondary-600">Чистая прибыль:</p>
                  <p className="font-mono font-semibold text-success-700">
                    {formatCurrency(calculatedValues.netProfit)}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-600">Всего расходы:</p>
                  <p className="font-mono font-semibold text-error-700">
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
              Отправить рейс
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-secondary-500 mt-6">
          Заполните все поля для добавления рейса в систему
        </p>
      </div>
    </div>
  );
};
