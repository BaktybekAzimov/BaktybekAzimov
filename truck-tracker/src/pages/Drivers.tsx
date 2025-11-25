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
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Plus, Edit, Trash2, User, Users } from 'lucide-react';
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

  const onSubmit = async (data: DriverFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      const driverData = {
        full_name: data.full_name,
        phone: data.phone,
        hire_date: data.hire_date,
        status: data.status,
        notes: data.notes || null,
      };

      if (editingDriver) {
        // Update existing driver
        const { error } = await supabase
          .from('drivers')
          .update(driverData)
          .eq('id', editingDriver.id);

        if (error) throw error;
      } else {
        // Create new driver
        const { error } = await supabase.from('drivers').insert([driverData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchDrivers();
    } catch (err) {
      console.error('Error saving driver:', err);
      setError(t('error.save_failed'));
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

      <div className="p-8 space-y-6">
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
                <TableHead>{t('drivers.hire_date')}</TableHead>
                <TableHead>{t('drivers.total_trips')}</TableHead>
                <TableHead>{t('drivers.total_payment')}</TableHead>
                <TableHead>{t('drivers.avg_profit')}</TableHead>
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
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <User size={16} className="text-primary-600" />
                        </div>
                        {driver.full_name}
                      </div>
                    </TableCell>
                    <TableCell>{driver.phone}</TableCell>
                    <TableCell>{formatDate(driver.hire_date)}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary-700">
                        {driver.total_trips || 0}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-success-700">
                      {formatCurrency(driver.total_payment || 0)}
                    </TableCell>
                    <TableCell className="font-mono text-secondary-700">
                      {formatCurrency(driver.avg_profit_per_trip || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(driver.status)}>
                        {t(`status.${driver.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
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
                  <TableCell colSpan={8} className="text-center py-12 text-secondary-500">
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
            {...register('phone', { required: t('validation.phone_required') })}
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
    </MainLayout>
  );
};
