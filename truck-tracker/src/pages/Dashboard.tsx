import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { Header } from '../components/layout/Header';
import { KPICard } from '../components/ui/KPICard';
import { Card } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { TrendingUp, Truck, DollarSign, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency, formatDate, getDateRange, getStatusColor, getStatusLabel } from '../lib/utils';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Local type definitions
type DateFilter = 'today' | 'week' | 'month' | 'all';

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
}

interface RouteChartData {
  name: string;
  trips: number;
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
  }, [dateFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { start, end } = getDateRange(dateFilter);

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

        const chartData = Object.values(groupedByDate).sort((a, b) =>
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

        const routeChartData = Object.values(groupedByRoute)
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
          <div className="flex gap-2">
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
        }
      />

      <div className="p-8 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Over Time */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Выручка по дням
            </h3>
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1e3a8a"
                    strokeWidth={2}
                    name="Выручка"
                    dot={{ fill: '#1e3a8a' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#059669"
                    strokeWidth={2}
                    name="Прибыль"
                    dot={{ fill: '#059669' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-secondary-500">
                Нет данных для отображения
              </div>
            )}
          </Card>

          {/* Trips by Route */}
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Рейсы по маршрутам (Топ 10)
            </h3>
            {routeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={routeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="trips"
                    fill="#1e3a8a"
                    name="Кол-во рейсов"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-secondary-500">
                Нет данных для отображения
              </div>
            )}
          </Card>
        </div>

        {/* Recent Trips Table */}
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Последние 10 рейсов
          </h3>
          {recentTrips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Водитель</TableHead>
                  <TableHead>Маршрут</TableHead>
                  <TableHead>Автомобиль</TableHead>
                  <TableHead>Выручка</TableHead>
                  <TableHead>Прибыль</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTrips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>{formatDate(trip.trip_date)}</TableCell>
                    <TableCell className="font-medium">
                      {trip.driver?.full_name || 'N/A'}
                    </TableCell>
                    <TableCell>{trip.route?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {trip.vehicle ? `${trip.vehicle.brand} ${trip.vehicle.model}` : 'N/A'}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-success-700">
                      {formatCurrency(trip.revenue)}
                    </TableCell>
                    <TableCell className="font-mono font-semibold text-primary-700">
                      {formatCurrency(trip.net_profit)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(trip.status)}>
                        {getStatusLabel(trip.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-secondary-500">
              Нет рейсов для отображения
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};
