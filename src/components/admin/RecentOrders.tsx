
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "refunded";
}

const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "Иванов Иван",
    date: "02.05.2025",
    amount: "2,400 ₽",
    status: "completed",
    paymentStatus: "paid",
  },
  {
    id: "ORD-002",
    customer: "Петров Петр",
    date: "01.05.2025",
    amount: "3,800 ₽",
    status: "processing",
    paymentStatus: "paid",
  },
  {
    id: "ORD-003",
    customer: "Сидорова Анна",
    date: "30.04.2025",
    amount: "1,500 ₽",
    status: "pending",
    paymentStatus: "unpaid",
  },
  {
    id: "ORD-004",
    customer: "Козлов Дмитрий",
    date: "28.04.2025",
    amount: "5,200 ₽",
    status: "cancelled",
    paymentStatus: "refunded",
  },
  {
    id: "ORD-005",
    customer: "Смирнова Елена",
    date: "27.04.2025",
    amount: "3,600 ₽",
    status: "completed",
    paymentStatus: "paid",
  },
];

const RecentOrders = () => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Последние заказы</CardTitle>
        <Link to="/admin/orders">
          <Button variant="outline" size="sm">
            Все заказы
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Клиент</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Сумма</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Оплата</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
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
                  <Button variant="ghost" size="sm">
                    Просмотр
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
