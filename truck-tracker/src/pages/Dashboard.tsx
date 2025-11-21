import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { TrendingUp, Truck, DollarSign, TrendingDown, Calendar, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate, getDateRange, getStatusColor, getStatusLabel, cn } from '../lib/utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

// Local type definitions
type DateFilter = 'today' | 'month' | 'all' | 'custom';

interface DashboardStats {
  totalRevenue: number;
  totalTrips: number;
  netProfit: number;
  avgProfitPerTrip: number;
}

interface DriverStats {
  driver_id: string;
  driver_name: string;
  total_trips: number;
  total_profit: number;
}

interface MonthComparison {
  month: string;
  revenue: number;
  profit: number;
}

interface VehicleUtilization {
  status: string;
  count: number;
  percentage: number;
}

interface ChartDataPoint {
  date: string;
  revenue: number;
  profit: number;
  trips?: number;
}

interface RouteChartData {
  name: string;
  trips: number;
  revenue?: number;
  [key: string]: string | number | undefined;
}

interface Trip {
  id: string;
  trip_date: string;
  revenue: number;
  net_profit: number;
  status: string;
  driver?: { full_name: string };
  vehicle?: { brand: string; model: string };
  route?: { name: string };
}

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));

  // Расширенные фильтры
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');

  // Справочники для фильтров
  const [drivers, setDrivers] = useState<Array<{id: string; full_name: string}>>([]);
  const [vehicles, setVehicles] = useState<Array<{id: string; brand: string; model: string; license_plate: string}>>([]);
  const [routes, setRoutes] = useState<Array<{id: string; name: string}>>([]);

  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalTrips: 0,
    netProfit: 0,
    avgProfitPerTrip: 0,
  });
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [routeData, setRouteData] = useState<RouteChartData[]>([]);
  const [topDrivers, setTopDrivers] = useState<DriverStats[]>([]);
  const [monthComparison, setMonthComparison] = useState<MonthComparison[]>([]);
  const [vehicleUtilization, setVehicleUtilization] = useState<VehicleUtilization[]>([]);

  // Настройки виджетов
  const [widgetSettings, setWidgetSettings] = useState({
    widget_revenue_chart_enabled: true,
    widget_routes_chart_enabled: true,
    widget_recent_trips_enabled: true,
    widget_top_drivers_enabled: false,
    widget_monthly_comparison_enabled: false,
    widget_vehicle_utilization_enabled: true,
  });

  useEffect(() => {
    loadSettings();
    loadFilterData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [dateFilter, selectedMonth, showAdvancedFilters, dateFrom, dateTo, selectedDriver, selectedVehicle, selectedRoute, widgetSettings]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('widget_revenue_chart_enabled, widget_routes_chart_enabled, widget_recent_trips_enabled, widget_top_drivers_enabled, widget_monthly_comparison_enabled, widget_vehicle_utilization_enabled')
        .single();

      if (data && !error) {
        setWidgetSettings({
          widget_revenue_chart_enabled: data.widget_revenue_chart_enabled,
          widget_routes_chart_enabled: data.widget_routes_chart_enabled,
          widget_recent_trips_enabled: data.widget_recent_trips_enabled,
          widget_top_drivers_enabled: data.widget_top_drivers_enabled,
          widget_monthly_comparison_enabled: data.widget_monthly_comparison_enabled,
          widget_vehicle_utilization_enabled: data.widget_vehicle_utilization_enabled,
        });
      }
    } catch (err) {
      console.error('Error loading widget settings:', err);
    }
  };

  const loadFilterData = async () => {
    try {
      const [driversRes, vehiclesRes, routesRes] = await Promise.all([
        supabase.from('drivers').select('id, full_name').eq('status', 'active'),
        supabase.from('vehicles').select('id, brand, model, license_plate'),
        supabase.from('routes').select('id, name'),
      ]);

      if (driversRes.data) setDrivers(driversRes.data);
      if (vehiclesRes.data) setVehicles(vehiclesRes.data);
      if (routesRes.data) setRoutes(routesRes.data);
    } catch (err) {
      console.error('Error loading filter data:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let start: Date | null = null;
      let end: Date | null = null;

      // Determine date range based on filter
      if (showAdvancedFilters) {
        // Use custom date range from advanced filters
        if (dateFrom) start = new Date(dateFrom + 'T00:00:00');
        if (dateTo) end = new Date(dateTo + 'T23:59:59');
      } else {
        // Use standard date filter
        if (dateFilter === 'custom' && selectedMonth) {
          // Parse selectedMonth (format: 'yyyy-MM')
          const [year, month] = selectedMonth.split('-').map(Number);
          const date = new Date(year, month - 1, 1);
          start = startOfMonth(date);
          end = endOfMonth(date);
        } else if (dateFilter !== 'custom') {
          const range = getDateRange(dateFilter);
          start = range.start;
          end = range.end;
        }
      }

      // Build query with filters
      let tripsQuery = supabase
        .from('trips')
        .select('*, driver:drivers(*), vehicle:vehicles(*), route:routes(*)')
        .eq('status', 'completed');

      if (start && end) {
        tripsQuery = tripsQuery
          .gte('trip_date', start.toISOString())
          .lte('trip_date', end.toISOString());
      }

      // Применяем расширенные фильтры
      if (showAdvancedFilters) {
        if (selectedDriver !== 'all') {
          tripsQuery = tripsQuery.eq('driver_id', selectedDriver);
        }
        if (selectedVehicle !== 'all') {
          tripsQuery = tripsQuery.eq('vehicle_id', selectedVehicle);
        }
        if (selectedRoute !== 'all') {
          tripsQuery = tripsQuery.eq('route_id', selectedRoute);
        }
      }

      const { data: trips, error: tripsError } = await tripsQuery;

      if (tripsError) throw tripsError;

      // Calculate stats
      const totalRevenue = trips?.reduce((sum, trip) => sum + trip.revenue, 0) || 0;
      const totalTrips = trips?.length || 0;
      const netProfit = trips?.reduce((sum, trip) => sum + trip.net_profit, 0) || 0;
      const avgProfitPerTrip = totalTrips > 0 ? netProfit / totalTrips : 0;

      setStats({
        totalRevenue,
        totalTrips,
        netProfit,
        avgProfitPerTrip,
      });

      // Get recent trips (last 10)
      const { data: recent, error: recentError } = await supabase
        .from('trips')
        .select('*, driver:drivers(*), vehicle:vehicles(*), route:routes(*)')
        .order('trip_date', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;
      setRecentTrips(recent || []);

      // Prepare revenue chart data (group by date)
      if (trips && trips.length > 0) {
        const groupedByDate = trips.reduce((acc, trip) => {
          const date = formatDate(trip.trip_date);
          if (!acc[date]) {
            acc[date] = { date, revenue: 0, profit: 0, trips: 0 };
          }
          acc[date].revenue += trip.revenue;
          acc[date].profit += trip.net_profit;
          acc[date].trips += 1;
          return acc;
        }, {} as Record<string, ChartDataPoint>);

        const chartData = (Object.values(groupedByDate) as ChartDataPoint[]).sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        setRevenueData(chartData);
      } else {
        setRevenueData([]);
      }

      // Prepare route chart data (top 10 routes by trips)
      if (trips && trips.length > 0) {
        const groupedByRoute = trips.reduce((acc, trip) => {
          const routeName = trip.route?.name || 'Неизвестный маршрут';
          if (!acc[routeName]) {
            acc[routeName] = { name: routeName, trips: 0, revenue: 0 };
          }
          acc[routeName].trips += 1;
          acc[routeName].revenue += trip.revenue;
          return acc;
        }, {} as Record<string, RouteChartData>);

        const routeChartData = (Object.values(groupedByRoute) as RouteChartData[])
          .sort((a, b) => b.trips - a.trips)
          .slice(0, 10);
        setRouteData(routeChartData);
      } else {
        setRouteData([]);
      }

      // Топ 5 водителей (только если включено в настройках)
      if (widgetSettings.widget_top_drivers_enabled && trips && trips.length > 0) {
        const groupedByDriver = trips.reduce((acc, trip) => {
          const driverId = trip.driver?.id || 'unknown';
          const driverName = trip.driver?.full_name || 'Неизвестный';
          if (!acc[driverId]) {
            acc[driverId] = {
              driver_id: driverId,
              driver_name: driverName,
              total_trips: 0,
              total_profit: 0,
            };
          }
          acc[driverId].total_trips += 1;
          acc[driverId].total_profit += trip.net_profit;
          return acc;
        }, {} as Record<string, DriverStats>);

        const topDriversData = (Object.values(groupedByDriver) as DriverStats[])
          .sort((a, b) => b.total_profit - a.total_profit)
          .slice(0, 5);
        setTopDrivers(topDriversData);
      } else {
        setTopDrivers([]);
      }

      // Сравнение последних 6 месяцев (только если включено)
      if (widgetSettings.widget_monthly_comparison_enabled) {
        const { data: allTrips } = await supabase
          .from('trips')
          .select('trip_date, revenue, net_profit')
          .eq('status', 'completed')
          .gte('trip_date', subMonths(new Date(), 6).toISOString());

        if (allTrips && allTrips.length > 0) {
          const groupedByMonth = allTrips.reduce((acc, trip) => {
            const month = format(new Date(trip.trip_date), 'MMM yyyy', { locale: ru });
            if (!acc[month]) {
              acc[month] = { month, revenue: 0, profit: 0 };
            }
            acc[month].revenue += trip.revenue;
            acc[month].profit += trip.net_profit;
            return acc;
          }, {} as Record<string, MonthComparison>);

          const monthComparisonData = Object.values(groupedByMonth)
            .sort((a, b) => {
              const dateA = new Date(a.month);
              const dateB = new Date(b.month);
              return dateA.getTime() - dateB.getTime();
            })
            .slice(-6);
          setMonthComparison(monthComparisonData);
        } else {
          setMonthComparison([]);
        }
      } else {
        setMonthComparison([]);
      }

      // Загруженность транспорта (только если включено)
      if (widgetSettings.widget_vehicle_utilization_enabled) {
        const { data: vehicles } = await supabase
          .from('vehicles')
          .select('status');

        if (vehicles && vehicles.length > 0) {
          const total = vehicles.length;
          const statusCounts = vehicles.reduce((acc, vehicle) => {
            acc[vehicle.status] = (acc[vehicle.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const utilizationData: VehicleUtilization[] = [
            {
              status: 'active',
              count: statusCounts['active'] || 0,
              percentage: Math.round(((statusCounts['active'] || 0) / total) * 100),
            },
            {
              status: 'maintenance',
              count: statusCounts['maintenance'] || 0,
              percentage: Math.round(((statusCounts['maintenance'] || 0) / total) * 100),
            },
            {
              status: 'inactive',
              count: statusCounts['inactive'] || 0,
              percentage: Math.round(((statusCounts['inactive'] || 0) / total) * 100),
            },
          ];

          setVehicleUtilization(utilizationData);
        } else {
          setVehicleUtilization([]);
        }
      } else {
        setVehicleUtilization([]);
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Не удалось загрузить данные дашборда');
    } finally {
      setLoading(false);
    }
  };

  const filterButtons: Array<{ label: string; value: DateFilter }> = [
    { label: 'Сегодня', value: 'today' },
    { label: 'Месяц', value: 'month' },
    { label: 'Всё время', value: 'all' },
  ];

  // Generate month options for the last 12 months
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = subMonths(new Date(), i);
    const value = format(date, 'yyyy-MM');
    const label = format(date, 'LLLL yyyy', { locale: ru });
    return { value, label };
  });

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
    setDateFilter('custom');
  };

  if (loading) {
    return (
      <MainLayout>
        <Header title="Дашборд" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Header title="Дашборд" />
        <div className="p-8">
          <Card className="bg-error-50 border border-error-200">
            <p className="text-error-700">{error}</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Дашборд"
        subtitle="Аналитика"
        icon={LayoutDashboard}
        actions={
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {!showAdvancedFilters && (
              <>
                {/* Quick Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {filterButtons.map((btn) => (
                    <Button
                      key={btn.value}
                      variant={dateFilter === btn.value ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setDateFilter(btn.value)}
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>
                {/* Month Selector */}
                <div className="flex items-center gap-2 min-w-[200px]">
                  <Calendar className="w-4 h-4 text-secondary-500" />
                  <Select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    options={monthOptions}
                    className="min-w-[180px]"
                  />
                </div>
              </>
            )}
            <Button
              variant={showAdvancedFilters ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? '✓ Фильтры активны' : 'Расширенные фильтры'}
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-4">
        {/* Расширенные фильтры */}
        {showAdvancedFilters && (
          <Card className="animate-slide-up">
            <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Фильтры аналитики</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              {/* Дата от */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Дата от</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              {/* Дата до */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Дата до</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 transition-all duration-200"
                />
              </div>

              {/* Водитель */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Водитель</label>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 transition-all duration-200"
                >
                  <option value="all">Все водители</option>
                  {drivers.map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.full_name}</option>
                  ))}
                </select>
              </div>

              {/* Транспорт */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Транспорт</label>
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 transition-all duration-200"
                >
                  <option value="all">Весь транспорт</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.license_plate})
                    </option>
                  ))}
                </select>
              </div>

              {/* Маршрут */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Маршрут</label>
                <select
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg text-sm bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 transition-all duration-200"
                >
                  <option value="all">Все маршруты</option>
                  {routes.map((route) => (
                    <option key={route.id} value={route.id}>{route.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Кнопка сброса */}
            {(dateFrom || dateTo || selectedDriver !== 'all' || selectedVehicle !== 'all' || selectedRoute !== 'all') && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFrom('');
                    setDateTo('');
                    setSelectedDriver('all');
                    setSelectedVehicle('all');
                    setSelectedRoute('all');
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            )}
          </Card>
        )}
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="animate-slide-up" style={{ animationDelay: '0ms' }}>
            <KPICard
              title="Общая выручка"
              value={formatCurrency(stats.totalRevenue)}
              icon={DollarSign}
              iconColor="text-success-600"
              iconBgColor="bg-success-100"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <KPICard
              title="Всего рейсов"
              value={stats.totalTrips}
              icon={Truck}
              iconColor="text-primary-600"
              iconBgColor="bg-primary-100"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <KPICard
              title="Чистая прибыль"
              value={formatCurrency(stats.netProfit)}
              icon={TrendingUp}
              iconColor="text-warning-600"
              iconBgColor="bg-warning-100"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <KPICard
              title="Средняя прибыль"
              value={formatCurrency(stats.avgProfitPerTrip)}
              icon={TrendingDown}
              iconColor="text-secondary-600"
              iconBgColor="bg-secondary-100"
            />
          </div>
        </div>

        {/* Charts - Компактная аналитика */}
        {(widgetSettings.widget_revenue_chart_enabled || widgetSettings.widget_routes_chart_enabled) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Прибыль по дням - компактный bar chart */}
            {widgetSettings.widget_revenue_chart_enabled && (
              <Card className="lg:col-span-2 animate-scale-in" style={{ animationDelay: '400ms' }}>
            <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              Прибыль за период
            </h3>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueData.slice(-10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    style={{ fontSize: '10px' }}
                    tick={{ fill: '#64748b' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    style={{ fontSize: '10px' }}
                    tick={{ fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar
                    dataKey="profit"
                    fill="#10b981"
                    name="Прибыль"
                    radius={[4, 4, 0, 0]}
                    cursor="default"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-secondary-400 dark:text-secondary-500">
                Нет данных
              </div>
            )}
              </Card>
            )}

            {/* Рейсы по маршрутам - круговой график */}
            {widgetSettings.widget_routes_chart_enabled && (
              <Card>
            <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
              Распределение рейсов
            </h3>
            {routeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={routeData.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="trips"
                    label={({ percent }: { percent?: number }) =>
                      percent ? `${(percent * 100).toFixed(0)}%` : ''
                    }
                    labelLine={false}
                    cursor="default"
                    isAnimationActive={false}
                  >
                    {routeData.slice(0, 5).map((_route, index) => {
                      const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="none"
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-secondary-400 dark:text-secondary-500">
                Нет данных
              </div>
            )}
            {/* Легенда для круговой диаграммы */}
            {routeData.length > 0 && (
              <div className="mt-3 space-y-1">
                {routeData.slice(0, 5).map((route, index) => {
                  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                  return (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-secondary-600 truncate max-w-[120px]">
                          {route.name}
                        </span>
                      </div>
                      <span className="font-medium text-secondary-900">{route.trips}</span>
                    </div>
                  );
                })}
              </div>
            )}
              </Card>
            )}
          </div>
        )}

        {/* Дополнительные виджеты */}
        {(widgetSettings.widget_vehicle_utilization_enabled ||
          widgetSettings.widget_top_drivers_enabled ||
          widgetSettings.widget_monthly_comparison_enabled) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Загруженность транспорта */}
            {widgetSettings.widget_vehicle_utilization_enabled && (
              <Card>
                <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                  🚛 Загруженность транспорта
                </h3>
                {vehicleUtilization.length > 0 ? (
                  <div className="space-y-3">
                    {vehicleUtilization.map((item) => {
                      const statusInfo = {
                        active: { label: 'В рейсе', color: 'bg-success-500', textColor: 'text-success-700', icon: '✅' },
                        maintenance: { label: 'На ремонте', color: 'bg-warning-500', textColor: 'text-warning-700', icon: '🔧' },
                        inactive: { label: 'Свободно', color: 'bg-secondary-400', textColor: 'text-secondary-700', icon: '⏸️' },
                      }[item.status] || { label: item.status, color: 'bg-gray-500', textColor: 'text-gray-700', icon: '❓' };

                      return (
                        <div key={item.status} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{statusInfo.icon}</span>
                              <span className="text-sm font-medium text-secondary-900">
                                {statusInfo.label}
                              </span>
                            </div>
                            <span className={`text-sm font-bold ${statusInfo.textColor}`}>
                              {item.count} ({item.percentage}%)
                            </span>
                          </div>
                          {/* Прогресс бар */}
                          <div className="w-full bg-secondary-200 rounded-full h-2">
                            <div
                              className={`${statusInfo.color} h-2 rounded-full transition-all duration-300`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {/* Итого */}
                    <div className="pt-3 border-t border-secondary-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-secondary-900">Всего транспорта:</span>
                        <span className="text-sm font-bold text-primary-600">
                          {vehicleUtilization.reduce((sum, item) => sum + item.count, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-secondary-400">
                    Нет данных о транспорте
                  </div>
                )}
              </Card>
            )}
            {/* Топ 5 водителей */}
            {widgetSettings.widget_top_drivers_enabled && (
              <Card>
                <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                  🏆 Топ 5 водителей
                </h3>
                {topDrivers.length > 0 ? (
                  <div className="space-y-2">
                    {topDrivers.map((driver, index) => (
                      <div
                        key={driver.driver_id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                              index === 0 && "bg-yellow-100 text-yellow-700",
                              index === 1 && "bg-gray-100 text-gray-700",
                              index === 2 && "bg-orange-100 text-orange-700",
                              index > 2 && "bg-secondary-100 text-secondary-700"
                            )}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-secondary-900">
                              {driver.driver_name}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {driver.total_trips} рейсов
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-success-600">
                            {formatCurrency(driver.total_profit)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-secondary-400">
                    Нет данных о водителях
                  </div>
                )}
              </Card>
            )}

            {/* Сравнение месяцев */}
            {widgetSettings.widget_monthly_comparison_enabled && (
              <Card>
                <h3 className="text-base font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                  📊 Сравнение последних месяцев
                </h3>
                {monthComparison.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="month"
                        stroke="#94a3b8"
                        style={{ fontSize: '10px' }}
                        tick={{ fill: '#64748b' }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '10px' }}
                        tick={{ fill: '#64748b' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '12px',
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#3b82f6"
                        name="Выручка"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="profit"
                        fill="#10b981"
                        name="Прибыль"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-sm text-secondary-400">
                    Нет данных для сравнения
                  </div>
                )}
              </Card>
            )}
          </div>
        )}

        {/* Recent Trips Table - Компактная версия */}
        {widgetSettings.widget_recent_trips_enabled && (
          <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-secondary-900">
              Последние рейсы
            </h3>
            <a
              href="/trips"
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Все рейсы →
            </a>
          </div>
          {recentTrips.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-2 px-3 text-xs font-semibold text-secondary-600">Дата</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-secondary-600">Водитель</th>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-secondary-600">Маршрут</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-secondary-600">Прибыль</th>
                    <th className="text-center py-2 px-3 text-xs font-semibold text-secondary-600">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.slice(0, 5).map((trip) => (
                    <tr key={trip.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-2 px-3 text-xs text-secondary-700">
                        {formatDate(trip.trip_date)}
                      </td>
                      <td className="py-2 px-3 text-xs font-medium text-secondary-900">
                        {trip.driver?.full_name || 'N/A'}
                      </td>
                      <td className="py-2 px-3 text-xs text-secondary-700">
                        {trip.route?.name || 'N/A'}
                      </td>
                      <td className="py-2 px-3 text-xs text-right font-semibold text-success-600">
                        {formatCurrency(trip.net_profit)}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Badge className={`text-xs ${getStatusColor(trip.status)}`}>
                          {getStatusLabel(trip.status)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-secondary-400">
              Нет рейсов
            </div>
          )}
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
