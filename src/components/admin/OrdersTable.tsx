
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Eye,
  Printer,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  items: string[];
  amount: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded";
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "Иванов Иван",
    email: "ivanov@example.com",
    phone: "+7 (900) 123-45-67",
    date: "02.05.2025",
    startDate: "05.05.2025",
    endDate: "08.05.2025",
    totalDays: 3,
    items: ["Перфоратор Bosch GBH 2-26 DRE", "Шуруповерт Makita DDF484Z"],
    amount: "2,400 ₽",
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "ORD-002",
    customer: "Петров Петр",
    email: "petrov@example.com",
    phone: "+7 (900) 234-56-78",
    date: "01.05.2025",
    startDate: "04.05.2025",
    endDate: "09.05.2025",
    totalDays: 5,
    items: ["Бетономешалка Prorab ECM 200"],
    amount: "3,800 ₽",
    status: "processing",
    paymentStatus: "paid",
  },
  {
    id: "ORD-003",
    customer: "Сидорова Анна",
    email: "sidorova@example.com",
    phone: "+7 (900) 345-67-89",
    date: "30.04.2025",
    startDate: "03.05.2025",
    endDate: "05.05.2025",
    totalDays: 2,
    items: ["Сварочный аппарат Ресанта САИ 250"],
    amount: "1,500 ₽",
    status: "pending",
    paymentStatus: "unpaid",
  },
  {
    id: "ORD-004",
    customer: "Козлов Дмитрий",
    email: "kozlov@example.com",
    phone: "+7 (900) 456-78-90",
    date: "28.04.2025",
    startDate: "01.05.2025",
    endDate: "06.05.2025",
    totalDays: 5,
    items: ["Газонокосилка Husqvarna LC 140", "Лазерный нивелир Bosch GLL 3-80"],
    amount: "5,200 ₽",
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: "ORD-005",
    customer: "Смирнова Елена",
    email: "smirnova@example.com",
    phone: "+7 (900) 567-89-01",
    date: "27.04.2025",
    startDate: "29.04.2025",
    endDate: "02.05.2025",
    totalDays: 3,
    items: ["Бензопила STIHL MS 180", "Мойка высокого давления Karcher K5"],
    amount: "3,600 ₽",
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "ORD-006",
    customer: "Орлов Максим",
    email: "orlov@example.com",
    phone: "+7 (900) 678-90-12",
    date: "26.04.2025",
    startDate: "28.04.2025",
    endDate: "01.05.2025",
    totalDays: 3,
    items: ["Шуруповерт Makita DDF484Z"],
    amount: "1,200 ₽",
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "ORD-007",
    customer: "Волков Антон",
    email: "volkov@example.com",
    phone: "+7 (900) 789-01-23",
    date: "25.04.2025",
    startDate: "26.04.2025",
    endDate: "28.04.2025",
    totalDays: 2,
    items: ["Плиткорез RUBI TX-700"],
    amount: "1,600 ₽",
    status: "completed",
    paymentStatus: "paid",
  },
];

const OrdersTable = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const { toast } = useToast();

  const handleViewOrder = (id: string) => {
    toast({
      title: "Просмотр заказа",
      description: `Открыт заказ #${id}`,
    });
  };

  const handlePrintOrder = (id: string) => {
    toast({
      title: "Печать заказа",
      description: `Подготовка к печати заказа #${id}`,
    });
  };

  const handleCompleteOrder = (id: string) => {
    toast({
      title: "Статус изменен",
      description: `Заказ #${id} отмечен как выполненный`,
      variant: "default",
    });
  };

  const handleCancelOrder = (id: string) => {
    toast({
      title: "Статус изменен",
      description: `Заказ #${id} отменен`,
      variant: "destructive",
    });
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "Завершен";
      case "processing":
        return "В обработке";
      case "pending":
        return "Ожидает";
      case "cancelled":
        return "Отменен";
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "Оплачен";
      case "unpaid":
        return "Не оплачен";
      case "refunded":
        return "Возвращен";
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter((order) => {
    // Поиск
    const matchesSearch =
      search === "" ||
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.email.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some((item) => item.toLowerCase().includes(search.toLowerCase()));

    // Фильтр по статусу заказа
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    // Фильтр по статусу оплаты
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заказы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск по заказу, клиенту или товару..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Статус заказа" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="processing">В обработке</SelectItem>
                  <SelectItem value="completed">Завершен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Статус оплаты" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все</SelectItem>
                  <SelectItem value="paid">Оплачен</SelectItem>
                  <SelectItem value="unpaid">Не оплачен</SelectItem>
                  <SelectItem value="refunded">Возвращен</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Период аренды</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Оплата</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    <div className="text-sm">{order.startDate} – {order.endDate}</div>
                    <div className="text-xs text-gray-500">{order.totalDays} дн.</div>
                  </TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(getStatusColor(order.status))}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(getPaymentStatusColor(order.paymentStatus))}
                    >
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Просмотреть
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePrintOrder(order.id)}>
                          <Printer className="h-4 w-4 mr-2" />
                          Печать
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {order.status !== "completed" && (
                          <DropdownMenuItem onClick={() => handleCompleteOrder(order.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Завершить
                          </DropdownMenuItem>
                        )}
                        {order.status !== "cancelled" && (
                          <DropdownMenuItem 
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Отменить
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    Заказы не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrdersTable;
