
import AdminLayout from "@/components/admin/AdminLayout";
import ProductsTable from "@/components/admin/ProductsTable";

const Products = () => {
  return (
    <AdminLayout 
      title="Управление инструментами" 
      subtitle="Добавление, редактирование и удаление инструментов"
    >
      <div className="grid gap-6">
        <ProductsTable />
      </div>
    </AdminLayout>
  );
};

export default Products;
