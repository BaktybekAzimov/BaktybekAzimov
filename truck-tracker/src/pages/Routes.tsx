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
import { useLanguage } from '../contexts/LanguageContext';

interface Route {
  id: string;
  name: string;
  distance_km: number;
  avg_cost: number;
  created_at?: string;
}

interface RouteFormData {
  name: string;
  distance_km: number;
  avg_cost: number;
}

interface RouteStats {
  id: string;
  name: string;
  distance_km: number;
  avg_cost: number;
  trip_count: number;
  total_revenue: number;
  avg_revenue: number;
  created_at?: string;
}

export const Routes: React.FC = () => {
  const { t } = useLanguage();
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

      // Сначала пробуем view route_stats
      let { data, error: fetchError } = await supabase
        .from('route_stats')
        .select('*')
        .order('trip_count', { ascending: false });

      // Если view не существует, используем обычную таблицу routes
      if (fetchError) {
        console.log('View route_stats not found, using routes table');
        const { data: routesData, error: routesError } = await supabase
          .from('routes')
          .select('*')
          .order('name', { ascending: true });

        if (routesError) throw routesError;

        // Преобразуем данные в формат RouteStats
        data = (routesData || []).map(route => ({
          ...route,
          trip_count: 0,
          total_revenue: 0,
          avg_revenue: 0,
        }));
      }

      setRoutes(data || []);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError(t('error.load_failed'));
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
      setError(t('error.save_failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm.delete_route'))) return;

    try {
      // Проверка на связанные рейсы
      const { data: linkedTrips } = await supabase
        .from('trips')
        .select('id')
        .eq('route_id', id)
        .limit(1);

      if (linkedTrips && linkedTrips.length > 0) {
        setError(t('error.has_linked_trips'));
        return;
      }

      const { error } = await supabase.from('routes').delete().eq('id', id);

      if (error) throw error;

      fetchRoutes();
    } catch (err) {
      console.error('Error deleting route:', err);
      setError(t('error.delete_failed'));
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Header title={t('routes.title')} icon={MapPin} />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title={t('routes.title')}
        subtitle={`${t('routes.total')}: ${routes.length}`}
        icon={MapPin}
        actions={
          <Button onClick={openCreateModal} icon={<Plus size={20} />}>
            {t('routes.add')}
          </Button>
        }
      />

      <div className="p-8 space-y-6">
        {error && (
          <Card className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800">
            <p className="text-error-700 dark:text-error-400">{error}</p>
          </Card>
        )}

        {/* Routes Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('routes.name')}</TableHead>
                <TableHead>{t('routes.distance')}</TableHead>
                <TableHead>{t('routes.standard_price')}</TableHead>
                <TableHead>{t('routes.trip_count')}</TableHead>
                <TableHead>{t('routes.total_revenue')}</TableHead>
                <TableHead>{t('routes.avg_revenue')}</TableHead>
                <TableHead>{t('trips.actions')}</TableHead>
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
                          {t('button.edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(route.id)}
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
                    {t('empty.routes')}
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
        title={editingRoute ? t('modal.edit_route') : t('modal.add_route')}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label={t('routes.name')}
            placeholder={t('routes.name_placeholder')}
            {...register('name', { required: t('validation.name_required') })}
            error={errors.name?.message}
          />

          <Input
            label={t('routes.distance')}
            type="number"
            step="0.01"
            min="0"
            placeholder={t('routes.distance_placeholder')}
            {...register('distance_km', {
              required: t('validation.distance_required'),
              min: { value: 0, message: t('validation.distance_positive') },
            })}
            error={errors.distance_km?.message}
          />

          <Input
            label={t('routes.standard_price')}
            type="number"
            step="0.01"
            min="0"
            placeholder={t('routes.price_placeholder')}
            helperText={t('routes.price_helper')}
            {...register('avg_cost', {
              required: t('validation.price_required'),
              min: { value: 0, message: t('validation.price_positive') },
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
              {t('button.cancel')}
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingRoute ? t('button.save') : t('button.create')}
            </Button>
          </div>
        </form>
      </Modal>
    </MainLayout>
  );
};
