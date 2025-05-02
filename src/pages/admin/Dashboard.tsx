
import AdminLayout from "@/components/admin/AdminLayout";
import StatCard from "@/components/admin/StatCard";
import RecentOrders from "@/components/admin/RecentOrders";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart,
  Package2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Янв", total: 53000 },
  { name: "Фев", total: 45000 },
  { name: "Мар", total: 61000 },
  { name: "Апр", total: 48000 },
  { name: "Май", total: 58000 },
  { name: "Июн", total: 0 },
  { name: "Июл", total: 0 },
  { name: "Авг", total: 0 },
  { name: "Сен", total: 0 },
  { name: "Окт", total: 0 },
  { name: "Ноя", total: 0 },
  { name: "Дек", total: 0 },
];

const topProducts = [
  { name: "Перфоратор Bosch GBH 2-26 DRE", revenue: 78600, orders: 98 },
  { name: "Шуруповерт Makita DDF484Z", revenue: 64200, orders: 128 },
  { name: "Бензопила STIHL MS 180", revenue: 55500, orders: 50 },
  { name: "Сварочный аппарат Ресанта САИ 250", revenue: 45900, orders: 51 },
  { name: "Газонокосилка Husqvarna LC 140", revenue: 38000, orders: 38 },
];

const formatCurrency = (value: number) => {
  return `${value.toLocaleString()} ₽`;
};

const Dashboard = () => {
  return (
    <AdminLayout 
      title="Дашборд" 
      subtitle="Обзор показателей вашего бизнеса"
    >
      <div className="grid gap-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Общая выручка"
            value="215 500 ₽"
            icon={BarChart3}
            description="Текущий месяц"
            trend="up"
            trendValue="12%"
            iconColor="bg-primary/10 text-primary"
          />
          <StatCard
            title="Заказы"
            value="72"
            icon={ShoppingCart}
            description="Текущий месяц"
            trend="up"
            trendValue="8%"
            iconColor="bg-indigo-100 text-indigo-600"
          />
          <StatCard
            title="Клиенты"
            value="2,845"
            icon={Users}
            description="Всего зарегистрированных"
            trend="up"
            trendValue="5%"
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Инструменты"
            value="246"
            icon={Package2}
            description="Активных предложений"
            trend="neutral"
            trendValue="0%"
            iconColor="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Обзор продаж</CardTitle>
              <Tabs defaultValue="year">
                <TabsList>
                  <TabsTrigger value="month">Месяц</TabsTrigger>
                  <TabsTrigger value="year">Год</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis 
                    dataKey="name" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000}k`} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Выручка']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#3a86ff" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Популярные инструменты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="bg-gray-100 p-2 rounded-md">
                      <Package2 className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.orders} заказов</p>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatCurrency(product.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders */}
        <RecentOrders />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
