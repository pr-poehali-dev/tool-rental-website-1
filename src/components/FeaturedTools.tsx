
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

type ToolCardProps = {
  image: string;
  name: string;
  category: string;
  price: number;
};

const ToolCard = ({ image, name, category, price }: ToolCardProps) => (
  <Card className="overflow-hidden transition-all hover:shadow-lg">
    <div className="h-48 overflow-hidden bg-gray-100">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover transition-transform hover:scale-105"
      />
    </div>
    <CardContent className="p-4">
      <p className="text-sm text-gray-500 mb-1">{category}</p>
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      <p className="text-primary font-bold">{price} ₽/день</p>
    </CardContent>
    <CardFooter className="p-4 pt-0 flex justify-between">
      <Button variant="outline" size="sm">
        Подробнее
      </Button>
      <Button size="sm" className="gap-1">
        <Icon name="ShoppingCart" size={16} />
        В корзину
      </Button>
    </CardFooter>
  </Card>
);

const FeaturedTools = () => {
  const tools = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      name: "Перфоратор Bosch GBH 2-26",
      category: "Электроинструмент",
      price: 550,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      name: "Шуруповерт DeWalt DCD771",
      category: "Электроинструмент",
      price: 400,
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581147036308-97121bd243f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      name: "Бензопила Husqvarna 135",
      category: "Садовый инструмент",
      price: 650,
    }
  ];

  return (
    <div className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold">Популярные инструменты</h2>
          <Button variant="outline">Смотреть все</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <ToolCard 
              key={tool.id}
              image={tool.image}
              name={tool.name}
              category={tool.category}
              price={tool.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedTools;
