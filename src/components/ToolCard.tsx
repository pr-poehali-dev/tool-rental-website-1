
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export interface ToolProps {
  id: number;
  name: string;
  description: string;
  pricePerDay: number;
  image: string;
  category: string;
  available: boolean;
}

const ToolCard: React.FC<{ tool: ToolProps }> = ({ tool }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video bg-gray-100">
        <img 
          src={tool.image} 
          alt={tool.name} 
          className="object-cover w-full h-full"
        />
        {!tool.available && (
          <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 text-sm">
            Недоступно
          </div>
        )}
        <div className="absolute top-0 left-0 bg-primary text-white px-3 py-1 text-sm">
          {tool.category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{tool.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tool.description}</p>
        <div className="flex justify-between items-center">
          <p className="font-bold text-primary">
            {tool.pricePerDay} ₽<span className="text-sm font-normal text-gray-500">/день</span>
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-primary border-primary hover:bg-primary hover:text-white"
              disabled={!tool.available}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              В корзину
            </Button>
            <Link to={`/tools/${tool.id}`}>
              <Button
                variant="default"
                size="sm"
              >
                Подробнее
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
