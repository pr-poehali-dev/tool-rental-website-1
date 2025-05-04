
import AdminLayout from "@/components/admin/AdminLayout";
import ToolsManagement from "@/components/admin/ToolsManagement";

const ToolsManagementPage = () => {
  return (
    <AdminLayout
      title="Управление инструментами"
      subtitle="Добавление, редактирование и удаление инструментов в каталоге"
    >
      <div className="grid gap-6">
        <ToolsManagement />
      </div>
    </AdminLayout>
  );
};

export default ToolsManagementPage;
