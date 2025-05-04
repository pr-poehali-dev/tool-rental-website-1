
import AdminLayout from "@/components/admin/AdminLayout";
import OrdersTableWithApi from "@/components/admin/OrdersTableWithApi";

const OrdersApi = () => {
  return (
    <AdminLayout 
      title="Управление заказами (API)" 
      subtitle="Управление заказами и отслеживание их статуса с использованием API"
    >
      <div className="grid gap-6">
        <OrdersTableWithApi />
      </div>
    </AdminLayout>
  );
};

export default OrdersApi;
