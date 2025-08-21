import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, Users, Calendar, Filter, LucideIcon } from 'lucide-react';

// Types Definition
interface SalesDataPoint {
  date: string;
  sales: number;
  revenue: number;
  orders: number;
}

interface ProductData {
  name: string;
  sales: number;
  percentage: number;
  color: string;
}

interface CategoryData {
  category: string;
  amount: number;
}

interface StatCardProps {
  title: string;
  value: number;
  previousValue: number;
  icon: LucideIcon;
  formatter?: (value: number) => string;
  suffix?: string;
}

type Period = '7d' | '30d' | '90d' | '1y';
type Metric = 'sales' | 'revenue' | 'orders';

interface AnalyticsData {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  topProduct: string;
  previousSales: number;
  previousRevenue: number;
  previousOrders: number;
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7d');
  const [selectedMetric, setSelectedMetric] = useState<Metric>('revenue');

  // Data dummy yang lebih realistis
  const analyticsData: AnalyticsData = {
    totalSales: 10,
    totalRevenue: 25000000,
    totalOrders: 120,
    topProduct: "Produk A",
    previousSales: 120,
    previousRevenue: 20000000,
    previousOrders: 98
  };

  const { 
    totalSales, 
    totalRevenue, 
    totalOrders, 
    topProduct,
    previousSales, 
    previousRevenue, 
    previousOrders 
  } = analyticsData;
  
  // Perhitungan persentase perubahan
  const salesGrowth = ((totalSales - previousSales) / previousSales * 100).toFixed(1);
  const revenueGrowth = ((totalRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);
  const ordersGrowth = ((totalOrders - previousOrders) / previousOrders * 100).toFixed(1);

  // Data untuk grafik penjualan harian
  const salesData: SalesDataPoint[] = [
    { date: '01/08', sales: 12, revenue: 1800000, orders: 8 },
    { date: '02/08', sales: 19, revenue: 2850000, orders: 15 },
    { date: '03/08', sales: 15, revenue: 2250000, orders: 12 },
    { date: '04/08', sales: 22, revenue: 3300000, orders: 18 },
    { date: '05/08', sales: 18, revenue: 2700000, orders: 14 },
    { date: '06/08', sales: 25, revenue: 3750000, orders: 20 },
    { date: '07/08', sales: 28, revenue: 4200000, orders: 22 },
    { date: '08/08', sales: 24, revenue: 3600000, orders: 19 },
    { date: '09/08', sales: 30, revenue: 4500000, orders: 24 },
    { date: '10/08', sales: 27, revenue: 4050000, orders: 21 },
    { date: '11/08', sales: 32, revenue: 4800000, orders: 26 },
    { date: '12/08', sales: 35, revenue: 5250000, orders: 28 }
  ];

  // Data produk terlaris
  const topProducts: ProductData[] = [
    { name: 'Produk A', sales: 45, percentage: 30, color: '#3B82F6' },
    { name: 'Produk B', sales: 35, percentage: 23, color: '#10B981' },
    { name: 'Produk C', sales: 28, percentage: 19, color: '#F59E0B' },
    { name: 'Produk D', sales: 25, percentage: 17, color: '#EF4444' },
    { name: 'Lainnya', sales: 17, percentage: 11, color: '#8B5CF6' }
  ];

  // Data penjualan per kategori
  const categoryData: CategoryData[] = [
    { category: 'Elektronik', amount: 8500000 },
    { category: 'Fashion', amount: 6200000 },
    { category: 'Makanan', amount: 4800000 },
    { category: 'Kesehatan', amount: 3200000 },
    { category: 'Olahraga', amount: 2300000 }
  ];

  const StatCard: React.FC<StatCardProps> = ({ 
    title, 
    value, 
    previousValue, 
    icon: Icon, 
    formatter = (v: number) => v.toString(), 
    suffix = "" 
  }) => {
    const growth: number = previousValue ? ((value - previousValue) / previousValue * 100) : 0;
    const isPositive: boolean = growth >= 0;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <div className={`flex items-center space-x-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(Number(growth.toFixed(1)))}%</span>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-gray-900">
            {formatter(value)}{suffix}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            vs periode sebelumnya: {formatter(previousValue)}{suffix}
          </p>
        </div>
      </div>
    );
  };

  const formatCurrency = (value: number): string => `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analitik Penjualan</h1>
            <p className="text-gray-600">Dashboard komprehensif untuk memantau performa bisnis Anda</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as Period)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
                <option value="90d">90 Hari Terakhir</option>
                <option value="1y">1 Tahun Terakhir</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Penjualan" 
            value={totalSales} 
            previousValue={previousSales}
            icon={ShoppingCart}
            suffix=" item"
          />
          <StatCard 
            title="Total Pendapatan" 
            value={totalRevenue} 
            previousValue={previousRevenue}
            icon={DollarSign}
            formatter={formatCurrency}
          />
          <StatCard 
            title="Total Pesanan" 
            value={totalOrders} 
            previousValue={previousOrders}
            icon={Package}
            suffix=" pesanan"
          />
          <StatCard 
            title="Rata-rata per Pesanan" 
            value={Math.round(totalRevenue / totalOrders)} 
            previousValue={Math.round(previousRevenue / previousOrders)}
            icon={Users}
            formatter={formatCurrency}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trend Penjualan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Trend Penjualan Harian</h3>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select 
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as Metric)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="sales">Penjualan</option>
                  <option value="revenue">Pendapatan</option>
                  <option value="orders">Pesanan</option>
                </select>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number, name: string) => [
                      selectedMetric === 'revenue' ? formatCurrency(value) : value,
                      selectedMetric === 'sales' ? 'Penjualan' : 
                      selectedMetric === 'revenue' ? 'Pendapatan' : 'Pesanan'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric}
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Produk Terlaris */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Distribusi Produk Terlaris</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="sales"
                  >
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} item`, 'Terjual']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: product.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{product.sales} item</span>
                    <span className="text-xs text-gray-500 ml-2">({product.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Penjualan per Kategori */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Penjualan per Kategori</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="category" type="category" stroke="#6b7280" fontSize={12} width={80} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Penjualan']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Insights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Performa Terbaik</h4>
            <p className="text-blue-100 text-sm mb-4">Hari dengan penjualan tertinggi</p>
            <p className="text-2xl font-bold">12 Agustus</p>
            <p className="text-blue-100 text-sm">35 item terjual</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Pertumbuhan</h4>
            <p className="text-green-100 text-sm mb-4">Dibanding periode sebelumnya</p>
            <p className="text-2xl font-bold">+{revenueGrowth}%</p>
            <p className="text-green-100 text-sm">Peningkatan pendapatan</p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Target Bulanan</h4>
            <p className="text-purple-100 text-sm mb-4">Progress menuju target</p>
            <p className="text-2xl font-bold">67%</p>
            <p className="text-purple-100 text-sm">dari target Rp 37.5M</p>
          </div>
        </div>
      </div>
    </div>
  );
}