// Database Types
export interface Driver {
  id: string;
  full_name: string;
  phone: string;
  hire_date: string;
  status: 'active' | 'inactive';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  status: 'available' | 'in_trip' | 'maintenance';
  fuel_consumption?: number; // Расход топлива л/100км
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  name: string;
  distance_km: number;
  avg_cost: number;
  created_at: string;
}

export interface Trip {
  id: string;
  trip_date: string;
  driver_id: string;
  vehicle_id: string;
  route_id: string;
  revenue: number;
  fuel_cost: number;
  maintenance_cost: number;
  other_costs: number;
  total_costs: number;
  net_profit: number;
  driver_payment: number;
  owner_payment: number;
  status: 'completed' | 'in_progress' | 'cancelled';
  comment?: string;
  created_at: string;
  created_by?: string;
  // Joined data
  driver?: Driver;
  vehicle?: Vehicle;
  route?: Route;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'dispatcher' | 'driver';
  driver_id?: string;
}

// Stats & Analytics Types
export interface DashboardStats {
  totalRevenue: number;
  totalTrips: number;
  netProfit: number;
  avgProfitPerTrip: number;
}

export interface DriverStats extends Driver {
  total_trips: number;
  total_payment: number;
  avg_profit_per_trip: number;
  rating: number;
}

export interface VehicleStats extends Vehicle {
  total_trips: number;
  total_revenue: number;
  avg_profit_per_trip: number;
  last_trip_date?: string;
}

export interface RouteStats extends Route {
  trip_count: number;
  total_revenue: number;
  avg_revenue: number;
}

// Form Types
export interface TripFormData {
  trip_date: string;
  driver_id: string;
  vehicle_id: string;
  route_id: string;
  revenue: number;
  fuel_cost: number;
  maintenance_cost: number;
  other_costs: number;
  status: Trip['status'];
  comment?: string;
}

export interface DriverFormData {
  full_name: string;
  phone: string;
  hire_date: string;
  status: Driver['status'];
  notes?: string;
}

export interface VehicleFormData {
  brand: string;
  model: string;
  license_plate: string;
  year: number;
  status: Vehicle['status'];
  fuel_consumption?: number; // Расход топлива л/100км
  notes?: string;
}

// Настройки топлива
export interface FuelSettings {
  fuel_price_per_liter: number;     // Цена за литр
  default_fuel_consumption: number;  // Расход по умолчанию л/100км
}

export interface RouteFormData {
  name: string;
  distance_km: number;
  avg_cost: number;
}

// Filter Types
export type DateFilter = 'today' | 'week' | 'month' | 'all';

export interface TripFilters {
  dateFilter: DateFilter;
  driverId?: string;
  vehicleId?: string;
  status?: Trip['status'];
  searchQuery?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  revenue: number;
  profit: number;
  trips: number;
}

export interface RouteChartData {
  name: string;
  trips: number;
  revenue: number;
}
