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
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusLabel,
  calculateTripFinancials,
} from '../lib/utils';
import { Trip, TripFormData, Driver, Vehicle, Route } from '../types';

export const Trips: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 20;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>();

  // Watch form values for auto-calculation
  const revenue = watch('revenue') || 0;
  const fuelCost = watch('fuel_cost') || 0;
  const maintenanceCost = watch('maintenance_cost') || 0;
  const otherCosts = watch('other_costs') || 0;

  const calculatedValues = calculateTripFinancials(
    Number(revenue),
    Number(fuelCost),
    Number(maintenanceCost),
    Number(otherCosts)
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Filter trips based on search query
    if (searchQuery.trim() === '') {
      setFilteredTrips(trips);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = trips.filter(
        (trip) =>
          trip.driver?.full_name.toLowerCase().includes(query) ||
          trip.vehicle?.license_plate.toLowerCase().includes(query) ||
          trip.route?.name.toLowerCase().includes(query)
      );
      setFilteredTrips(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, trips]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [tripsRes, driversRes, vehiclesRes, routesRes] = await Promise.all([
        supabase
          .from('trips')
          .select('*, driver:drivers(*), vehicle:vehicles(*), route:routes(*)')
          .order('trip_date', { ascending: false }),
        supabase.from('drivers').select('*').eq('status', 'active'),
        supabase.from('vehicles').select('*'),
        supabase.from('routes').select('*'),
      ]);

      if (tripsRes.error) throw tripsRes.error;
      if (driversRes.error) throw driversRes.error;
      if (vehiclesRes.error) throw vehiclesRes.error;
      if (routesRes.error) throw routesRes.error;

      setTrips(tripsRes.data || []);
      setFilteredTrips(tripsRes.data || []);
      setDrivers(driversRes.data || []);
      setVehicles(vehiclesRes.data || []);
      setRoutes(routesRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTrip(null);
    reset({
      trip_date: new Date().toISOString().split('T')[0],
      driver_id: '',
      vehicle_id: '',
      route_id: '',
      revenue: 0,
      fuel_cost: 0,
      maintenance_cost: 0,
      other_costs: 0,
      status: 'completed',
      comment: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (trip: Trip) => {
    setEditingTrip(trip);
    reset({
      trip_date: trip.trip_date.split('T')[0],
      driver_id: trip.driver_id,
      vehicle_id: trip.vehicle_id,
      route_id: trip.route_id,
      revenue: trip.revenue,
      fuel_cost: trip.fuel_cost,
      maintenance_cost: trip.maintenance_cost,
      other_costs: trip.other_costs,
      status: trip.status,
      comment: trip.comment || '',
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: TripFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      const calculated = calculateTripFinancials(
        Number(data.revenue),
        Number(data.fuel_cost),
        Number(data.maintenance_cost),
        Number(data.other_costs)
      );

      const tripData = {
        trip_date: data.trip_date,
        driver_id: data.driver_id,
        vehicle_id: data.vehicle_id,
        route_id: data.route_id,
        revenue: Number(data.revenue),
        fuel_cost: Number(data.fuel_cost),
        maintenance_cost: Number(data.maintenance_cost),
        other_costs: Number(data.other_costs),
        total_costs: calculated.totalCosts,
        net_profit: calculated.netProfit,
        driver_payment: calculated.driverPayment,
        owner_payment: calculated.ownerPayment,
        status: data.status,
        comment: data.comment || null,
      };

      if (editingTrip) {
        // Update existing trip
        const { error } = await supabase
          .from('trips')
          .update(tripData)
          .eq('id', editingTrip.id);

        if (error) throw error;
      } else {
        // Create new trip
        const { error } = await supabase.from('trips').insert([tripData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Error saving trip:', err);
      setError('Не удалось сохранить рейс');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот рейс?')) return;

    try {
      const { error } = await supabase.from('trips').delete().eq('id', id);

      if (error) throw error;

      fetchData();
    } catch (err) {
      console.error('Error deleting trip:', err);
      setError('Не удалось удалить рейс');
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <MainLayout>
        <Header title="Рейсы" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Рейсы"
        subtitle={`Всего рейсов: ${filteredTrips.length}`}
        actions={
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            Добавить рейс
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {error && (
          <Card className="bg-error-50 border border-error-200">
            <p className="text-error-700">{error}</p>
          </Card>
        )}

        {/* Search */}
        <Card>
          <Input
            placeholder="Поиск по водителю, автомобилю или маршруту..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={20} />}
          />
        </Card>

        {/* Trips Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Водитель</TableHead>
                <TableHead>Автомобиль</TableHead>
                <TableHead>Маршрут</TableHead>
                <TableHead>Выручка</TableHead>
                <TableHead>Расходы</TableHead>
                <TableHead>Прибыль</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrips.length > 0 ? (
                paginatedTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">
                      {formatDate(trip.trip_date)}
                    </TableCell>
                    <TableCell>{trip.driver?.full_name || 'N/A'}</TableCell>
                    <TableCell>
                      {trip.vehicle
                        ? `${trip.vehicle.brand} ${trip.vehicle.license_plate}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{trip.route?.name || 'N/A'}</TableCell>
                    <TableCell className="font-mono font-semibold text-success-700">
                      {formatCurrency(trip.revenue)}
                    </TableCell>
                    <TableCell className="font-mono text-error-700">
                      {formatCurrency(trip.total_costs)}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-primary-700">
                      {formatCurrency(trip.net_profit)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trip.status)}>
                        {getStatusLabel(trip.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(trip)}
                          icon={<Edit size={16} />}
                        >
                          Изменить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(trip.id)}
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
                    {searchQuery ? 'Рейсы не найдены' : 'Нет рейсов'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-secondary-200">
              <p className="text-sm text-secondary-600">
                Страница {currentPage} из {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  icon={<ChevronLeft size={16} />}
                >
                  Назад
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  icon={<ChevronRight size={16} />}
                >
                  Вперед
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTrip ? 'Редактировать рейс' : 'Добавить рейс'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Дата рейса"
              type="date"
              {...register('trip_date', { required: 'Дата обязательна' })}
              error={errors.trip_date?.message}
            />

            <Select
              label="Водитель"
              {...register('driver_id', { required: 'Водитель обязателен' })}
              options={drivers.map((d) => ({
                value: d.id,
                label: d.full_name,
              }))}
              error={errors.driver_id?.message}
            />

            <Select
              label="Автомобиль"
              {...register('vehicle_id', { required: 'Автомобиль обязателен' })}
              options={vehicles.map((v) => ({
                value: v.id,
                label: `${v.brand} ${v.model} (${v.license_plate})`,
              }))}
              error={errors.vehicle_id?.message}
            />

            <Select
              label="Маршрут"
              {...register('route_id', { required: 'Маршрут обязателен' })}
              options={routes.map((r) => ({
                value: r.id,
                label: r.name,
              }))}
              error={errors.route_id?.message}
            />

            <Input
              label="Выручка"
              type="number"
              step="0.01"
              {...register('revenue', { required: 'Выручка обязательна', min: 0 })}
              error={errors.revenue?.message}
            />

            <Input
              label="Расход на топливо"
              type="number"
              step="0.01"
              {...register('fuel_cost', { required: 'Расход на топливо обязателен', min: 0 })}
              error={errors.fuel_cost?.message}
            />

            <Input
              label="Расход на ремонт"
              type="number"
              step="0.01"
              {...register('maintenance_cost', { min: 0 })}
              error={errors.maintenance_cost?.message}
            />

            <Input
              label="Прочие расходы"
              type="number"
              step="0.01"
              {...register('other_costs', { min: 0 })}
              error={errors.other_costs?.message}
            />

            <Select
              label="Статус"
              {...register('status', { required: 'Статус обязателен' })}
              options={[
                { value: 'completed', label: 'Завершён' },
                { value: 'in_progress', label: 'В пути' },
                { value: 'cancelled', label: 'Отменён' },
              ]}
              error={errors.status?.message}
            />
          </div>

          {/* Auto-calculated values */}
          <Card className="bg-secondary-50">
            <h4 className="font-semibold text-secondary-900 mb-3">Автоматический расчёт:</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-secondary-600">Общие расходы:</p>
                <p className="font-mono font-bold text-error-700">
                  {formatCurrency(calculatedValues.totalCosts)}
                </p>
              </div>
              <div>
                <p className="text-secondary-600">Чистая прибыль:</p>
                <p className="font-mono font-bold text-success-700">
                  {formatCurrency(calculatedValues.netProfit)}
                </p>
              </div>
              <div>
                <p className="text-secondary-600">Водителю (30%):</p>
                <p className="font-mono font-bold text-primary-700">
                  {formatCurrency(calculatedValues.driverPayment)}
                </p>
              </div>
              <div>
                <p className="text-secondary-600">Владельцу (70%):</p>
                <p className="font-mono font-bold text-primary-700">
                  {formatCurrency(calculatedValues.ownerPayment)}
                </p>
              </div>
            </div>
          </Card>

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
              {editingTrip ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
