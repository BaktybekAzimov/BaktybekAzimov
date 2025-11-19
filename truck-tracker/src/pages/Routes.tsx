import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../lib/utils';
import { Route, RouteFormData, RouteStats } from '../types';

export const Routes: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<RouteStats[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RouteFormData>();

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch route stats from the view
      const { data, error: fetchError } = await supabase
        .from('route_stats')
        .select('*')
        .order('trip_count', { ascending: false });

      if (fetchError) throw fetchError;

      setRoutes(data || []);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Не удалось загрузить данные маршрутов');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRoute(null);
    reset({
      name: '',
      distance_km: 0,
      avg_cost: 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (route: Route) => {
    setEditingRoute(route);
    reset({
      name: route.name,
      distance_km: route.distance_km,
      avg_cost: route.avg_cost,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: RouteFormData) => {
    try {
      setSubmitting(true);
      setError(null);

      const routeData = {
        name: data.name,
        distance_km: Number(data.distance_km),
        avg_cost: Number(data.avg_cost),
      };

      if (editingRoute) {
        // Update existing route
        const { error } = await supabase
          .from('routes')
          .update(routeData)
          .eq('id', editingRoute.id);

        if (error) throw error;
      } else {
        // Create new route
        const { error } = await supabase.from('routes').insert([routeData]);

        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchRoutes();
    } catch (err) {
      console.error('Error saving route:', err);
      setError('Не удалось сохранить маршрут');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот маршрут?')) return;

    try {
      const { error } = await supabase.from('routes').delete().eq('id', id);

      if (error) throw error;

      fetchRoutes();
    } catch (err) {
      console.error('Error deleting route:', err);
      setError('Не удалось удалить маршрут');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Header title="Маршруты" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Маршруты"
        subtitle={`Всего маршрутов: ${routes.length}`}
        actions={
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            Добавить маршрут
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {error && (
          <Card className="bg-error-50 border border-error-200">
            <p className="text-error-700">{error}</p>
          </Card>
        )}

        {/* Routes Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название маршрута</TableHead>
                <TableHead>Расстояние (км)</TableHead>
                <TableHead>Средняя стоимость</TableHead>
                <TableHead>Кол-во рейсов</TableHead>
                <TableHead>Общая выручка</TableHead>
                <TableHead>Средняя выручка</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.length > 0 ? (
                routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-100 rounded-lg">
                          <MapPin size={16} className="text-primary-600" />
                        </div>
                        {route.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-secondary-700">
                        {route.distance_km} км
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-secondary-700">
                      {formatCurrency(route.avg_cost)}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-primary-700">
                        {route.trip_count || 0}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-success-700">
                      {formatCurrency(route.total_revenue || 0)}
                    </TableCell>
                    <TableCell className="font-mono text-secondary-700">
                      {formatCurrency(route.avg_revenue || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(route)}
                          icon={<Edit size={16} />}
                        >
                          Изменить
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(route.id)}
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
                  <TableCell colSpan={7} className="text-center py-12 text-secondary-500">
                    Нет маршрутов
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
        title={editingRoute ? 'Редактировать маршрут' : 'Добавить маршрут'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Название маршрута"
            placeholder="Например: Бишкек - Алматы"
            {...register('name', { required: 'Название обязательно' })}
            error={errors.name?.message}
          />

          <Input
            label="Расстояние (км)"
            type="number"
            step="0.01"
            min="0"
            placeholder="Например: 245.5"
            {...register('distance_km', {
              required: 'Расстояние обязательно',
              min: { value: 0, message: 'Расстояние должно быть положительным' },
            })}
            error={errors.distance_km?.message}
          />

          <Input
            label="Средняя стоимость"
            type="number"
            step="0.01"
            min="0"
            placeholder="Например: 15000"
            helperText="Ориентировочная стоимость рейса по этому маршруту"
            {...register('avg_cost', {
              required: 'Стоимость обязательна',
              min: { value: 0, message: 'Стоимость должна быть положительной' },
            })}
            error={errors.avg_cost?.message}
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
              {editingRoute ? 'Сохранить' : 'Создать'}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
