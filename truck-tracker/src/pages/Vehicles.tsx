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
import { Plus, Edit, Trash2, Truck, Car } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate, getStatusColor } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

interface VehicleFormData {
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  status: string;
  notes?: string;
}

interface VehicleStats {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  status: string;
  notes?: string;
  total_trips: number;
  total_revenue: number;
  avg_profit_per_trip: number;
  last_trip_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const Vehicles: React.FC = () => {
  const { t } = useLanguage();
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

      // Сначала пробуем view vehicle_stats
      let { data, error: fetchError } = await supabase
        .from('vehicle_stats')
        .select('*')
        .order('total_revenue', { ascending: false });

      // Если view не существует, используем обычную таблицу vehicles
      if (fetchError) {
        console.log('View vehicle_stats not found, using vehicles table');
        const { data: vehiclesData, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('*')
          .order('brand', { ascending: true });

        if (vehiclesError) throw vehiclesError;

        // Преобразуем данные в формат VehicleStats
        data = (vehiclesData || []).map(vehicle => ({
          ...vehicle,
          total_trips: 0,
          total_revenue: 0,
          avg_profit_per_trip: 0,
          last_trip_date: undefined,
        }));
      }

      setVehicles(data || []);
      setFilteredVehicles(data || []);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      setError(t('error.load_failed'));
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
      setError(t('error.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm.delete_vehicle'))) return;

    try {
      // Проверка на активные рейсы
      const { data: activeTrips } = await supabase
        .from('trips')
        .select('id')
        .eq('vehicle_id', id)
        .in('status', ['in_progress', 'planned'])
        .limit(1);

      if (activeTrips && activeTrips.length > 0) {
        setError(t('error.has_active_trips'));
        return;
      }

      const { error } = await supabase.from('vehicles').delete().eq('id', id);

      if (error) throw error;

      fetchVehicles();
    } catch (err) {
      console.error('Error deleting vehicle:', err);
      setError(t('error.delete_failed'));
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
        <Header title={t('vehicles.title')} icon={Car} />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title={t('vehicles.title')}
        subtitle={`${t('vehicles.total')}: ${vehicles.length}`}
        icon={Car}
        actions={
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            {t('vehicles.add')}
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {error && (
          <Card className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p className="text-error-700 dark:text-error-400">{error}</p>
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
              {t('common.all')} ({statusCounts.all})
            </Button>
            <Button
              variant={statusFilter === 'available' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('available')}
            >
              {t('filter.free')} ({statusCounts.available})
            </Button>
            <Button
              variant={statusFilter === 'in_trip' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('in_trip')}
            >
              {t('filter.in_trip')} ({statusCounts.in_trip})
            </Button>
            <Button
              variant={statusFilter === 'maintenance' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('maintenance')}
            >
              {t('filter.maintenance')} ({statusCounts.maintenance})
            </Button>
          </div>
        </Card>

        {/* Vehicles Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('trips.vehicle')}</TableHead>
                <TableHead>{t('vehicles.plate')}</TableHead>
                <TableHead>{t('vehicles.year')}</TableHead>
                <TableHead>{t('vehicles.total_trips')}</TableHead>
                <TableHead>{t('vehicles.revenue')}</TableHead>
                <TableHead>{t('vehicles.avg_profit')}</TableHead>
                <TableHead>{t('vehicles.last_trip')}</TableHead>
                <TableHead>{t('vehicles.status')}</TableHead>
                <TableHead>{t('trips.actions')}</TableHead>
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
                      <span className="font-semibold text-primary-700 dark:text-primary-400">
                        {vehicle.total_trips || 0}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-success-700 dark:text-success-400">
                      {formatCurrency(vehicle.total_revenue || 0)}
                    </TableCell>
                    <TableCell className="font-mono text-secondary-700 dark:text-secondary-400">
                      {formatCurrency(vehicle.avg_profit_per_trip || 0)}
                    </TableCell>
                    <TableCell>
                      {vehicle.last_trip_date ? (
                        formatDate(vehicle.last_trip_date)
                      ) : (
                        <span className="text-secondary-400 dark:text-secondary-500">{t('common.no_data')}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {t(`status.${vehicle.status}`)}
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
                          {t('button.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(vehicle.id)}
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
                  <TableCell colSpan={9} className="text-center py-12 text-secondary-500">
                    {statusFilter === 'all' ? t('empty.vehicles') : t('empty.vehicles_status')}
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
        title={editingVehicle ? t('modal.edit_vehicle') : t('modal.add_vehicle')}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('vehicles.brand')}
            placeholder={t('vehicles.brand_placeholder')}
            {...register('brand', { required: t('validation.brand_required') })}
            error={errors.brand?.message}
          />

          <Input
            label={t('vehicles.model')}
            placeholder={t('vehicles.model_placeholder')}
            {...register('model', { required: t('validation.model_required') })}
            error={errors.model?.message}
          />

          <Input
            label={t('vehicles.license_plate')}
            placeholder={t('vehicles.plate_placeholder')}
            {...register('license_plate', { required: t('validation.plate_required') })}
            error={errors.license_plate?.message}
          />

          <Input
            label={t('vehicles.year_label')}
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            {...register('year', {
              required: t('validation.year_required'),
              min: { value: 1900, message: t('validation.year_min') },
              max: {
                value: new Date().getFullYear() + 1,
                message: t('validation.year_max'),
              },
            })}
            error={errors.year?.message}
          />

          <Select
            label={t('vehicles.status')}
            {...register('status', { required: t('validation.status_required') })}
            options={[
              { value: 'available', label: t('status.available') },
              { value: 'in_trip', label: t('status.in_trip') },
              { value: 'maintenance', label: t('status.maintenance') },
            ]}
            error={errors.status?.message}
          />

          <Input
            label={t('vehicles.notes')}
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
              {editingVehicle ? t('button.save') : t('button.create')}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
