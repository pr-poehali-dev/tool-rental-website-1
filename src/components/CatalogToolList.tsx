
import ToolCard, { ToolProps } from "@/components/ToolCard";

interface CatalogToolListProps {
  tools: ToolProps[];
  isLoading?: boolean;
}

const CatalogToolList: React.FC<CatalogToolListProps> = ({ 
  tools,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-300" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-full" />
              <div className="h-4 bg-gray-300 rounded w-5/6" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-300 rounded w-1/4" />
                <div className="h-8 bg-gray-300 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-700 mb-2">Нет инструментов по заданным критериям</h3>
        <p className="text-gray-500">Попробуйте изменить параметры фильтрации или поиска</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
};

export default CatalogToolList;
