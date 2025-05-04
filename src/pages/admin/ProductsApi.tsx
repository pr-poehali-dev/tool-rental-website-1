
import AdminLayout from "@/components/admin/AdminLayout";
import ProductsTableWithApi from "@/components/admin/ProductsTableWithApi";

const ProductsApi = () => {
  return (
    <AdminLayout 
      title="Управление инструментами (API)" 
      subtitle="Добавление, редактирование и удаление инструментов с использованием API"
    >
      <div className="grid gap-6">
        <ProductsTableWithApi />
      </div>
    </AdminLayout>
  );
};

export default ProductsApi;
