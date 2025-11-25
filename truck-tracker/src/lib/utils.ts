import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency symbols mapping
const currencySymbols: Record<string, string> = {
  KGS: 'с',
  USD: '$',
  RUB: '₽',
};

// Format currency based on saved settings
export function formatCurrency(amount: number): string {
  const currency = localStorage.getItem('currency') || 'KGS';
  const symbol = currencySymbols[currency] || 'с';

  const formatted = new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  // USD uses prefix, others use suffix
  if (currency === 'USD') {
    return `${symbol}${formatted}`;
  }
  return `${formatted} ${symbol}`;
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

// Format datetime
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Calculate trip financials
export interface TripCalculation {
  totalCosts: number;
  netProfit: number;
  driverPayment: number;
  ownerPayment: number;
}

export function calculateTripFinancials(
  revenue: number,
  fuelCost: number,
  maintenanceCost: number,
  otherCosts: number
): TripCalculation {
  const totalCosts = fuelCost + maintenanceCost + otherCosts;
  const netProfit = revenue - totalCosts;
  // При убыточном рейсе выплаты = 0 (водитель не должен платить за убытки)
  const driverPayment = netProfit > 0 ? netProfit * 0.3 : 0;
  const ownerPayment = netProfit > 0 ? netProfit * 0.7 : netProfit; // Убыток несёт владелец

  return {
    totalCosts,
    netProfit,
    driverPayment,
    ownerPayment,
  };
}

// Get status color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    completed: 'bg-success-100 text-success-700',
    in_progress: 'bg-warning-100 text-warning-700',
    cancelled: 'bg-error-100 text-error-700',
    active: 'bg-success-100 text-success-700',
    inactive: 'bg-secondary-100 text-secondary-700',
    available: 'bg-success-100 text-success-700',
    in_trip: 'bg-warning-100 text-warning-700',
    maintenance: 'bg-error-100 text-error-700',
  };

  return colors[status] || 'bg-secondary-100 text-secondary-700';
}

// Get status label
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    completed: 'Завершён',
    in_progress: 'В пути',
    cancelled: 'Отменён',
    active: 'Активен',
    inactive: 'Неактивен',
    available: 'Свободна',
    in_trip: 'В рейсе',
    maintenance: 'На ремонте',
  };

  return labels[status] || status;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Get date range for filters
export function getDateRange(filter: 'today' | 'week' | 'month' | 'all'): { start: Date | null; end: Date | null } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  switch (filter) {
    case 'today': {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case 'week': {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case 'month': {
      const start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
    case 'all':
    default:
      return { start: null, end: null };
  }
}
