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
import { Plus, Edit, Trash2, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../lib/utils';
import { Driver, DriverFormData, DriverStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const Drivers: React.FC = () => {
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

      // Fetch driver stats from the view
      const { data, error: fetchError } = await supabase
        .from('driver_stats')
        .select('*')
        .order('total_payment', { ascending: false });

      if (fetchError) throw fetchError;

      setDrivers(data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError('Не удалось загрузить данные водителей');
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
      setError('Не удалось сохранить водителя');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого водителя?')) return;

    try {
      const { error } = await supabase.from('drivers').delete().eq('id', id);

      if (error) throw error;

      fetchDrivers();
    } catch (err) {
      console.error('Error deleting driver:', err);
      setError('Не удалось удалить водителя');
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
        <Header title="Водители" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Водители"
        subtitle={`Всего водителей: ${drivers.length}`}
        actions={
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            Добавить водителя
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {error && (
          <Card className="bg-error-50 border border-error-200">
            <p className="text-error-700">{error}</p>
          </Card>
        )}

        {/* Top Drivers Chart */}
        {topDriversData.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Топ 10 водителей по выплатам
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topDriversData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  style={{ fontSize: '12px' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar
                  dataKey="payment"
                  fill="#1e3a8a"
                  name="Выплаты"
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
                <TableHead>Имя</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Дата найма</TableHead>
                <TableHead>Всего рейсов</TableHead>
                <TableHead>Общие выплаты</TableHead>
                <TableHead>Средняя прибыль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
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
                        {getStatusLabel(driver.status)}
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
                          Изменить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(driver.id)}
                          icon={<Trash2 size={16} />}
                        >
                          Удалить
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-secondary-500">
                    Нет водителей
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
        title={editingDriver ? 'Редактировать водителя' : 'Добавить водителя'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Полное имя"
            {...register('full_name', { required: 'Имя обязательно' })}
            error={errors.full_name?.message}
          />

          <Input
            label="Телефон"
            type="tel"
            placeholder="+996 XXX XXX XXX"
            {...register('phone', { required: 'Телефон обязателен' })}
            error={errors.phone?.message}
          />

          <Input
            label="Дата найма"
            type="date"
            {...register('hire_date', { required: 'Дата найма обязательна' })}
            error={errors.hire_date?.message}
          />

          <Select
            label="Статус"
            {...register('status', { required: 'Статус обязателен' })}
            options={[
              { value: 'active', label: 'Активен' },
              { value: 'inactive', label: 'Неактивен' },
            ]}
            error={errors.status?.message}
          />

          <Input
            label="Заметки"
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
              Отмена
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingDriver ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
