
import AdminLayout from "@/components/admin/AdminLayout";
import OrdersTable from "@/components/admin/OrdersTable";

const Orders = () => {
  return (
    <AdminLayout 
      title="Управление заказами" 
      subtitle="Просмотр и обработка заказов клиентов"
    >
      <div className="grid gap-6">
        <OrdersTable />
      </div>
    </AdminLayout>
  );
};

export default Orders;
