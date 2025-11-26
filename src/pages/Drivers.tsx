import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ErrorModal } from '../components/ui/ErrorModal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Edit, Trash2, User, Users, Key, Copy, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate, getStatusColor } from '../lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// Helper function for chart colors based on theme
const getChartColors = (isDark: boolean) => ({
  grid: isDark ? '#374151' : '#e2e8f0',
  text: isDark ? '#9ca3af' : '#64748b',
  tooltip: {
    bg: isDark ? '#1f2937' : '#fff',
    border: isDark ? '#374151' : '#e2e8f0',
    text: isDark ? '#f3f4f6' : '#1f2937',
  },
});

interface Driver {
  id: string;
  full_name: string;
  phone: string;
  hire_date: string;
  status: string;
  pin_code?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface DriverFormData {
  full_name: string;
  phone: string;
  hire_date: string;
  status: string;
  notes?: string;
}

interface DriverStats {
  id: string;
  full_name: string;
  phone: string;
  hire_date: string;
  status: string;
  pin_code?: string;
  notes?: string;
  total_trips: number;
  total_payment: number;
  avg_profit_per_trip: number;
  created_at?: string;
  updated_at?: string;
}

export const Drivers: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const chartColors = getChartColors(theme === 'dark');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<DriverStats[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DriverFormData>();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Сначала пробуем view driver_stats
      let { data, error: fetchError } = await supabase
        .from('driver_stats')
        .select('*')
        .order('total_payment', { ascending: false });

      // Если view не существует, используем обычную таблицу drivers
      if (fetchError) {
        console.log('View driver_stats not found, using drivers table');
        const { data: driversData, error: driversError } = await supabase
          .from('drivers')
          .select('*')
          .order('full_name', { ascending: true });

        if (driversError) throw driversError;

        // Преобразуем данные в формат DriverStats
        data = (driversData || []).map(driver => ({
          ...driver,
          total_trips: 0,
          total_payment: 0,
          avg_profit_per_trip: 0,
        }));
      }

      setDrivers(data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(t('error.load_failed'));
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingDriver(null);
    reset({
      full_name: '',
      phone: '',
      hire_date: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    reset({
      full_name: driver.full_name,
      phone: driver.phone,
      hire_date: driver.hire_date.split('T')[0],
      status: driver.status,
      notes: driver.notes || '',
    });
    setIsModalOpen(true);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
  };

  // Генерация 4-значного PIN-кода
  const generatePinCode = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  // Копирование PIN в буфер обмена
  const copyPinToClipboard = async (pin: string, driverName: string) => {
    try {
      await navigator.clipboard.writeText(pin);
      alert(`PIN-код ${pin} для водителя "${driverName}" скопирован!`);
    } catch {
      alert(`PIN-код: ${pin}`);
    }
  };

  // Регенерация PIN-кода для водителя
  const regeneratePin = async (driverId: string, driverName: string) => {
    if (!confirm(`Сгенерировать новый PIN-код для водителя "${driverName}"? Старый PIN перестанет работать.`)) return;

    try {
      const newPin = generatePinCode();
      const { error } = await supabase
        .from('drivers')
        .update({ pin_code: newPin })
        .eq('id', driverId);

      if (error) throw error;

      alert(`Новый PIN-код для "${driverName}": ${newPin}`);
      fetchDrivers();
    } catch (err) {
      console.error('Error regenerating PIN:', err);
      showError('Не удалось сгенерировать новый PIN-код');
    }
  };

  const getErrorMessage = (err: any): string => {
    if (err?.code === '23505' || err?.message?.includes('duplicate') || err?.message?.includes('unique')) {
      return 'Водитель с таким номером телефона уже существует в системе';
    }
    if (err?.code === '42501' || err?.message?.includes('permission') || err?.message?.includes('policy')) {
      return 'Нет прав для выполнения этой операции. Обратитесь к администратору';
    }
    if (err?.code === 'PGRST301' || err?.message?.includes('JWT')) {
      return 'Сессия истекла. Пожалуйста, войдите в систему заново';
    }
    return 'Не удалось сохранить водителя. Попробуйте еще раз';
  };

  // Нормализация телефона - оставляем только цифры
  const normalizePhone = (phone: string): string => {
    return phone.replace(/\D/g, '');
  };

  const onSubmit = async (data: DriverFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Проверка на дубликат телефона
      const phoneNormalized = normalizePhone(data.phone);

      const { data: existingDrivers, error: checkError } = await supabase
        .from('drivers')
        .select('id, phone');

      if (checkError) {
        console.error('Error checking for duplicate:', checkError);
      }

      // Проверяем на совпадение нормализованных телефонов
      const duplicates = existingDrivers?.filter(d => {
        const existingNormalized = normalizePhone(d.phone);
        // Если редактируем - исключаем текущего водителя из проверки
        if (editingDriver && d.id === editingDriver.id) return false;
        return existingNormalized === phoneNormalized;
      });

      if (duplicates && duplicates.length > 0) {
        showError(`Водитель с телефоном "${data.phone}" уже существует в системе`);
        setSubmitting(false);
        return;
      }

      if (editingDriver) {
        // Update existing driver (without changing PIN)
        const driverData = {
          full_name: data.full_name,
          phone: data.phone,
          hire_date: data.hire_date,
          status: data.status,
          notes: data.notes || null,
        };

        const { error } = await supabase
          .from('drivers')
          .update(driverData)
          .eq('id', editingDriver.id);

        if (error) throw error;
      } else {
        // Create new driver with generated PIN
        const newPin = generatePinCode();
        const driverData = {
          full_name: data.full_name,
          phone: data.phone,
          hire_date: data.hire_date,
          status: data.status,
          notes: data.notes || null,
          pin_code: newPin,
        };

        const { error } = await supabase.from('drivers').insert([driverData]);

        if (error) throw error;

        // Показываем PIN-код после создания
        alert(`Водитель "${data.full_name}" создан!\n\nPIN-код для входа: ${newPin}\n\nСообщите этот PIN водителю для доступа к форме отчёта.`);
      }

      setIsModalOpen(false);
      fetchDrivers();
    } catch (err: any) {
      console.error('Error saving driver:', err);
      showError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm.delete_driver'))) return;

    try {
      // Проверка на активные рейсы
      const { data: activeTrips } = await supabase
        .from('trips')
        .select('id')
        .eq('driver_id', id)
        .in('status', ['in_progress', 'planned'])
        .limit(1);

      if (activeTrips && activeTrips.length > 0) {
        setError(t('error.has_active_trips'));
        return;
      }

      const { error } = await supabase.from('drivers').delete().eq('id', id);

      if (error) throw error;

      fetchDrivers();
    } catch (err) {
      console.error('Error deleting driver:', err);
      setError(t('error.delete_failed'));
    }
  };

  // Prepare chart data for top 10 drivers by profitability
  const topDriversData = drivers
    .filter((d) => d.total_trips > 0)
    .slice(0, 10)
    .map((d) => ({
      name: d.full_name,
      payment: d.total_payment,
      trips: d.total_trips,
    }));

  if (loading) {
    return (
      <MainLayout>
        <Header title={t('drivers.title')} icon={Users} />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title={t('drivers.title')}
        subtitle={`${t('drivers.total')}: ${drivers.length}`}
        icon={Users}
        actions={
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            {t('drivers.add')}
          </Button>
        }
      />

      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
        {error && (
          <Card className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p className="text-error-700 dark:text-error-400">{error}</p>
          </Card>
        )}

        {/* Top Drivers Chart */}
        {topDriversData.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              {t('drivers.top_by_payments')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDriversData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis
                  dataKey="name"
                  stroke={chartColors.text}
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke={chartColors.text} style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: chartColors.tooltip.bg,
                    border: `1px solid ${chartColors.tooltip.border}`,
                    borderRadius: '8px',
                    color: chartColors.tooltip.text,
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="payment"
                  fill="#1e3a8a"
                  name={t('drivers.payments')}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Drivers Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('drivers.name')}</TableHead>
                <TableHead>{t('drivers.phone')}</TableHead>
                <TableHead>PIN</TableHead>
                <TableHead>{t('drivers.total_trips')}</TableHead>
                <TableHead>{t('drivers.total_payment')}</TableHead>
                <TableHead>{t('drivers.status')}</TableHead>
                <TableHead>{t('drivers.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <TableRow key={driver.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          <User size={16} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <div>{driver.full_name}</div>
                          <div className="text-xs text-secondary-500">{formatDate(driver.hire_date)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>
                      {driver.pin_code ? (
                        <div className="flex items-center gap-1">
                          <code className="bg-secondary-100 dark:bg-secondary-700 px-2 py-1 rounded text-sm font-mono font-bold">
                            {driver.pin_code}
                          </code>
                          <button
                            onClick={() => copyPinToClipboard(driver.pin_code!, driver.full_name)}
                            className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors"
                            title="Копировать PIN"
                          >
                            <Copy size={14} className="text-secondary-500" />
                          </button>
                          <button
                            onClick={() => regeneratePin(driver.id, driver.full_name)}
                            className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors"
                            title="Новый PIN"
                          >
                            <RefreshCw size={14} className="text-secondary-500" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => regeneratePin(driver.id, driver.full_name)}
                          className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                        >
                          <Key size={12} />
                          Создать PIN
                        </button>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary-700 dark:text-primary-400">
                        {driver.total_trips || 0}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-success-700 dark:text-success-400">
                      {formatCurrency(driver.total_payment || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(driver.status)}>
                        {t(`status.${driver.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(driver)}
                          icon={<Edit size={16} />}
                        >
                          {t('button.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(driver.id)}
                          icon={<Trash2 size={16} />}
                        >
                          {t('button.delete')}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-secondary-500">
                    {t('empty.drivers')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDriver ? t('modal.edit_driver') : t('modal.add_driver')}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('drivers.full_name')}
            {...register('full_name', { required: t('validation.full_name_required') })}
            error={errors.full_name?.message}
          />

          <Input
            label={t('drivers.phone')}
            type="tel"
            placeholder={t('drivers.phone_placeholder')}
            {...register('phone', {
              required: t('validation.phone_required'),
              pattern: {
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                message: t('validation.phone_invalid')
              }
            })}
            error={errors.phone?.message}
          />

          <Input
            label={t('drivers.hire_date')}
            type="date"
            {...register('hire_date', { required: t('validation.hire_date_required') })}
            error={errors.hire_date?.message}
          />

          <Select
            label={t('drivers.status')}
            {...register('status', { required: t('validation.status_required') })}
            options={[
              { value: 'active', label: t('status.active') },
              { value: 'inactive', label: t('status.inactive') },
            ]}
            error={errors.status?.message}
          />

          <Input
            label={t('drivers.notes')}
            {...register('notes')}
            error={errors.notes?.message}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              {t('button.cancel')}
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingDriver ? t('button.save') : t('button.create')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModalOpen}
        onClose={() => setErrorModalOpen(false)}
        message={errorMessage}
      />
    </MainLayout>
  );
};
