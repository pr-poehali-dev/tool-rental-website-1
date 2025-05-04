
import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  MoreHorizontal, 
  Filter, 
  RefreshCw,
  EyeIcon, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ordersApi, Order } from "@/lib/api";
import { useApiList, useApi } from "@/hooks/useApi";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const statusColors = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", badge: "default" },
  processing: { bg: "bg-blue-100", text: "text-blue-800", badge: "secondary" },
  completed: { bg: "bg-green-100", text: "text-green-800", badge: "default" },
  cancelled: { bg: "bg-red-100", text: "text-red-800", badge: "destructive" },
};

const paymentStatusColors = {
  paid: { bg: "bg-green-100", text: "text-green-800", badge: "default" },
  unpaid: { bg: "bg-yellow-100", text: "text-yellow-800", badge: "secondary" },
  refunded: { bg: "bg-gray-100", text: "text-gray-800", badge: "outline" },
};

const OrdersTableWithApi = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false);
  const [changePaymentStatusDialogOpen, setChangePaymentStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");
  const [newPaymentStatus, setNewPaymentStatus] = useState<Order["paymentStatus"]>("unpaid");
  
  const { toast } = useToast();

  const {
    items: orders,
    isLoading,
    error,
    refresh,
    loadItems,
  } = useApiList<Order>(ordersApi.getAll);

  const {
    execute: updateOrderStatus,
    isLoading: isUpdatingStatus,
  } = useApi(
    (id: string, status: Order["status"]) => ordersApi.updateStatus(id, status),
    { showSuccessToast: true }
  );

  const {
    execute: updatePaymentStatus,
    isLoading: isUpdatingPaymentStatus,
  } = useApi(
    (id: string, paymentStatus: Order["paymentStatus"]) => 
      ordersApi.updatePaymentStatus(id, paymentStatus),
    { showSuccessToast: true }
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSearch = () => {
    loadItems(1, 10, { search });
  };

  const handleFilterChange = (status: string) => {
    setStatusFilter(status);
    loadItems(1, 10, { status });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleOpenStatusChange = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setChangeStatusDialogOpen(true);
  };

  const handleOpenPaymentStatusChange = (order: Order) => {
    setSelectedOrder(order);
    setNewPaymentStatus(order.paymentStatus);
    setChangePaymentStatusDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder) return;
    
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setChangeStatusDialogOpen(false);
      refresh();
    } catch (error) {
      // Ошибка уже обрабатывается в хуке useApi
    }
  };

  const confirmPaymentStatusChange = async () => {
    if (!selectedOrder) return;
    
    try {
      await updatePaymentStatus(selectedOrder.id, newPaymentStatus);
      setChangePaymentStatusDialogOpen(false);
      refresh();
    } catch (error) {
      // Ошибка уже обрабатывается в хуке useApi
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = statusColors[status];
    const StatusIcon = {
      pending: Clock,
      processing: Package,
      completed: CheckCircle,
      cancelled: XCircle,
    }[status];

    return (
      <Badge variant={statusConfig.badge as any} className={`${statusConfig.bg} ${statusConfig.text}`}>
        {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
        {status === "pending" && "Ожидает"}
        {status === "processing" && "В обработке"}
        {status === "completed" && "Выполнен"}
        {status === "cancelled" && "Отменен"}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (paymentStatus: Order["paymentStatus"]) => {
    const paymentConfig = paymentStatusColors[paymentStatus];
    
    return (
      <Badge variant={paymentConfig.badge as any} className={`${paymentConfig.bg} ${paymentConfig.text}`}>
        {paymentStatus === "paid" && "Оплачен"}
        {paymentStatus === "unpaid" && "Не оплачен"}
        {paymentStatus === "refunded" && "Возврат"}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(
    (order) =>
      (statusFilter === "" || order.status === statusFilter) &&
      (search === "" || 
        order.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase()))
  );

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="rounded-full bg-red-100 p-3 text-red-600 mb-4">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Ошибка загрузки данных</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md">
              {error.message || "Произошла ошибка при загрузке заказов. Пожалуйста, попробуйте позже."}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={refresh}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Загрузка...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Повторить
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Заказы</CardTitle>
            <CardDescription>Управление заказами и отслеживание их статуса</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={refresh} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Обновить
          </Button>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Поиск по имени клиента, email или номеру заказа..."
                className="pl-8 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-shrink-0">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter ? 
                    `Статус: ${
                      statusFilter === "pending" ? "Ожидает" :
                      statusFilter === "processing" ? "В обработке" :
                      statusFilter === "completed" ? "Выполнен" :
                      statusFilter === "cancelled" ? "Отменен" : 
                      statusFilter
                    }` : 
                    "Фильтровать"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Статус заказа</h4>
                  <Select 
                    value={statusFilter} 
                    onValueChange={handleFilterChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Все статусы" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Все статусы</SelectItem>
                      <SelectItem value="pending">Ожидает</SelectItem>
                      <SelectItem value="processing">В обработке</SelectItem>
                      <SelectItem value="completed">Выполнен</SelectItem>
                      <SelectItem value="cancelled">Отменен</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Оплата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                      <p className="mt-2 text-sm text-gray-500">Загрузка заказов...</p>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <p className="text-sm text-gray-500">Заказы не найдены</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer.name}</div>
                          <div className="text-xs text-gray-500">{order.customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.date), "dd MMM yyyy", { locale: ru })}
                      </TableCell>
                      <TableCell className="font-medium">{order.amount} ₽</TableCell>
                      <TableCell>
                        {getStatusBadge(order.status)}
                      </TableCell>
                      <TableCell>
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                              <EyeIcon className="h-4 w-4 mr-2" />
                              Детали
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenStatusChange(order)}>
                              <Package className="h-4 w-4 mr-2" />
                              Изменить статус
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenPaymentStatusChange(order)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Статус оплаты
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Диалог с деталями заказа */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Детали заказа #{selectedOrder.id.slice(0, 8)}</DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedOrder.date), "dd MMMM yyyy, HH:mm", { locale: ru })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid sm:grid-cols-2 gap-4 py-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Информация о клиенте</h4>
                  <p className="font-medium">{selectedOrder.customer.name}</p>
                  <p className="text-sm">{selectedOrder.customer.email}</p>
                  <p className="text-sm">{selectedOrder.customer.phone}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Информация о заказе</h4>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Статус:</span>
                    <span>{getStatusBadge(selectedOrder.status)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Оплата:</span>
                    <span>{getPaymentStatusBadge(selectedOrder.paymentStatus)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Сумма:</span>
                    <span className="font-medium">{selectedOrder.amount} ₽</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Период аренды</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-xs text-gray-500">Начало</div>
                    <div className="font-medium">
                      {format(new Date(selectedOrder.startDate), "dd MMMM yyyy", { locale: ru })}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <div className="text-xs text-gray-500">Окончание</div>
                    <div className="font-medium">
                      {format(new Date(selectedOrder.endDate), "dd MMMM yyyy", { locale: ru })}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1">Всего дней: <span className="font-medium">{selectedOrder.totalDays}</span></div>
              </div>

              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Инструменты</h4>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.pricePerDay} ₽ × {selectedOrder.totalDays} дн. × {item.quantity} шт.
                        </div>
                      </div>
                      <div className="font-medium">
                        {item.pricePerDay * selectedOrder.totalDays * item.quantity} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
                  Закрыть
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Диалог изменения статуса заказа */}
      <Dialog open={changeStatusDialogOpen} onOpenChange={setChangeStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус заказа</DialogTitle>
            <DialogDescription>
              Заказ #{selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="status">Новый статус</Label>
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as Order["status"])}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Ожидает</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="completed">Выполнен</SelectItem>
                <SelectItem value="cancelled">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangeStatusDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={confirmStatusChange} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог изменения статуса оплаты */}
      <Dialog open={changePaymentStatusDialogOpen} onOpenChange={setChangePaymentStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус оплаты</DialogTitle>
            <DialogDescription>
              Заказ #{selectedOrder?.id.slice(0, 8)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="paymentStatus">Статус оплаты</Label>
            <Select 
              value={newPaymentStatus} 
              onValueChange={(value) => setNewPaymentStatus(value as Order["paymentStatus"])}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Оплачен</SelectItem>
                <SelectItem value="unpaid">Не оплачен</SelectItem>
                <SelectItem value="refunded">Возврат</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setChangePaymentStatusDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={confirmPaymentStatusChange} disabled={isUpdatingPaymentStatus}>
              {isUpdatingPaymentStatus ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersTableWithApi;
