import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { TrendingUp, Truck, DollarSign, TrendingDown, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate, getDateRange, getStatusColor, getStatusLabel } from '../lib/utils';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, format, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

// Local type definitions
type DateFilter = 'today' | 'week' | 'month' | 'all' | 'custom';

interface DashboardStats {
  totalRevenue: number;
  totalTrips: number;
  netProfit: number;
  avgProfitPerTrip: number;
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
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalTrips: 0,
    netProfit: 0,
    avgProfitPerTrip: 0,
  });
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[]>([]);
  const [routeData, setRouteData] = useState<RouteChartData[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateFilter, selectedMonth]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let start: Date | null = null;
      let end: Date | null = null;

      // Determine date range based on filter
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

      // Build query with date filter
      let tripsQuery = supabase
        .from('trips')
        .select('*, driver:drivers(*), vehicle:vehicles(*), route:routes(*)')
        .eq('status', 'completed');

      if (start && end) {
        tripsQuery = tripsQuery
          .gte('trip_date', start.toISOString())
          .lte('trip_date', end.toISOString());
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

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Не удалось загрузить данные дашборда');
    } finally {
      setLoading(false);
    }
  };

  const filterButtons: Array<{ label: string; value: DateFilter }> = [
    { label: 'Сегодня', value: 'today' },
    { label: 'Неделя', value: 'week' },
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
        subtitle="Обзор бизнес-показателей"
        actions={
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
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
          </div>
        }
      />

      <div className="p-6 space-y-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Общая выручка"
            value={formatCurrency(stats.totalRevenue)}
            icon={DollarSign}
            iconColor="text-success-600"
            iconBgColor="bg-success-100"
          />
          <KPICard
            title="Всего рейсов"
            value={stats.totalTrips}
            icon={Truck}
            iconColor="text-primary-600"
            iconBgColor="bg-primary-100"
          />
          <KPICard
            title="Чистая прибыль"
            value={formatCurrency(stats.netProfit)}
            icon={TrendingUp}
            iconColor="text-warning-600"
            iconBgColor="bg-warning-100"
          />
          <KPICard
            title="Средняя прибыль"
            value={formatCurrency(stats.avgProfitPerTrip)}
            icon={TrendingDown}
            iconColor="text-secondary-600"
            iconBgColor="bg-secondary-100"
          />
        </div>

        {/* Charts - Компактная аналитика */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Прибыль по дням - компактный bar chart */}
          <Card className="lg:col-span-2">
            <h3 className="text-base font-semibold text-secondary-900 mb-3">
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
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-sm text-secondary-400">
                Нет данных
              </div>
            )}
          </Card>

          {/* Рейсы по маршрутам - круговой график */}
          <Card>
            <h3 className="text-base font-semibold text-secondary-900 mb-3">
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
                  >
                    {routeData.slice(0, 5).map((_route, index) => {
                      const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                      return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />;
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
              <div className="h-[200px] flex items-center justify-center text-sm text-secondary-400">
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
        </div>

        {/* Recent Trips Table - Компактная версия */}
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
      </div>
    </MainLayout>
  );
};
