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
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '../lib/utils';
import { Vehicle, VehicleFormData, VehicleStats } from '../types';

export const Vehicles: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<VehicleStats[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleStats[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | Vehicle['status']>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>();

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    // Filter vehicles by status
    if (statusFilter === 'all') {
      setFilteredVehicles(vehicles);
    } else {
      setFilteredVehicles(vehicles.filter((v) => v.status === statusFilter));
    }
  }, [statusFilter, vehicles]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch vehicle stats from the view
      const { data, error: fetchError } = await supabase
        .from('vehicle_stats')
        .select('*')
        .order('total_revenue', { ascending: false });

      if (fetchError) throw fetchError;

      setVehicles(data || []);
      setFilteredVehicles(data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError('Не удалось загрузить данные автомобилей');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingVehicle(null);
    reset({
      brand: '',
      model: '',
      license_plate: '',
      year: new Date().getFullYear(),
      status: 'available',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    reset({
      brand: vehicle.brand,
      model: vehicle.model,
      license_plate: vehicle.license_plate,
      year: vehicle.year,
      status: vehicle.status,
      notes: vehicle.notes || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: VehicleFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      const vehicleData = {
        brand: data.brand,
        model: data.model,
        license_plate: data.license_plate,
        year: Number(data.year),
        status: data.status,
        notes: data.notes || null,
      };

      if (editingVehicle) {
        // Update existing vehicle
        const { error } = await supabase
          .from('vehicles')
          .update(vehicleData)
          .eq('id', editingVehicle.id);

        if (error) throw error;
      } else {
        // Create new vehicle
        const { error } = await supabase.from('vehicles').insert([vehicleData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchVehicles();
    } catch (err) {
      console.error('Error saving vehicle:', err);
      setError('Не удалось сохранить автомобиль');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) return;

    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);

      if (error) throw error;

      fetchVehicles();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError('Не удалось удалить автомобиль');
    }
  };

  // Status counts for filter buttons
  const statusCounts = {
    all: vehicles.length,
    available: vehicles.filter((v) => v.status === 'available').length,
    in_trip: vehicles.filter((v) => v.status === 'in_trip').length,
    maintenance: vehicles.filter((v) => v.status === 'maintenance').length,
  };

  if (loading) {
    return (
      <MainLayout>
        <Header title="Автомобили" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Автомобили"
        subtitle={`Всего автомобилей: ${vehicles.length}`}
        actions={
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            Добавить автомобиль
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {error && (
          <Card className="bg-error-50 border border-error-200">
            <p className="text-error-700">{error}</p>
          </Card>
        )}

        {/* Status Filter */}
        <Card>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={statusFilter === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              Все ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === 'available' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('available')}
            >
              Свободны ({statusCounts.available})
            </Button>
            <Button
              variant={statusFilter === 'in_trip' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('in_trip')}
            >
              В рейсе ({statusCounts.in_trip})
            </Button>
            <Button
              variant={statusFilter === 'maintenance' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('maintenance')}
            >
              На ремонте ({statusCounts.maintenance})
            </Button>
          </div>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Автомобиль</TableHead>
                <TableHead>Номер</TableHead>
                <TableHead>Год</TableHead>
                <TableHead>Всего рейсов</TableHead>
                <TableHead>Общая выручка</TableHead>
                <TableHead>Средняя прибыль</TableHead>
                <TableHead>Последний рейс</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <Truck size={16} className="text-primary-600" />
                        </div>
                        {vehicle.brand} {vehicle.model}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      {vehicle.license_plate}
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary-700">
                        {vehicle.total_trips || 0}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-success-700">
                      {formatCurrency(vehicle.total_revenue || 0)}
                    </TableCell>
                    <TableCell className="font-mono text-secondary-700">
                      {formatCurrency(vehicle.avg_profit_per_trip || 0)}
                    </TableCell>
                    <TableCell>
                      {vehicle.last_trip_date ? (
                        formatDate(vehicle.last_trip_date)
                      ) : (
                        <span className="text-secondary-400">Нет данных</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {getStatusLabel(vehicle.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(vehicle)}
                          icon={<Edit size={16} />}
                        >
                          Изменить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id)}
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
                  <TableCell colSpan={9} className="text-center py-12 text-secondary-500">
                    {statusFilter === 'all' ? 'Нет автомобилей' : 'Нет автомобилей с таким статусом'}
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
        title={editingVehicle ? 'Редактировать автомобиль' : 'Добавить автомобиль'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Марка"
            placeholder="Например: Volvo"
            {...register('brand', { required: 'Марка обязательна' })}
            error={errors.brand?.message}
          />

          <Input
            label="Модель"
            placeholder="Например: FH16"
            {...register('model', { required: 'Модель обязательна' })}
            error={errors.model?.message}
          />

          <Input
            label="Номер (госномер)"
            placeholder="Например: 01ABC123"
            {...register('license_plate', { required: 'Номер обязателен' })}
            error={errors.license_plate?.message}
          />

          <Input
            label="Год выпуска"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            {...register('year', {
              required: 'Год обязателен',
              min: { value: 1900, message: 'Год не может быть меньше 1900' },
              max: {
                value: new Date().getFullYear() + 1,
                message: 'Год не может быть больше текущего',
              },
            })}
            error={errors.year?.message}
          />

          <Select
            label="Статус"
            {...register('status', { required: 'Статус обязателен' })}
            options={[
              { value: 'available', label: 'Свободна' },
              { value: 'in_trip', label: 'В рейсе' },
              { value: 'maintenance', label: 'На ремонте' },
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
              {editingVehicle ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
