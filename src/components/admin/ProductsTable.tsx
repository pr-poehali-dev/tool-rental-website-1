
import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolProps } from "@/components/ToolCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Edit, Trash2, MoreHorizontal, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const products: ToolProps[] = [
  {
    id: 1,
    name: "Перфоратор Bosch GBH 2-26 DRE",
    description: "Профессиональный перфоратор для бурения отверстий в бетоне, кирпиче и камне.",
    pricePerDay: 800,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    category: "Электроинструмент",
    available: true
  },
  {
    id: 2,
    name: "Шуруповерт Makita DDF484Z",
    description: "Аккумуляторный шуруповерт для работы с крепежом и сверления отверстий.",
    pricePerDay: 500,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    category: "Электроинструмент",
    available: true
  },
  {
    id: 3,
    name: "Бетономешалка Prorab ECM 200",
    description: "Надежная бетономешалка объемом 200 литров для строительных работ.",
    pricePerDay: 1200,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    category: "Строительное оборудование",
    available: false
  },
  {
    id: 4,
    name: "Сварочный аппарат Ресанта САИ 250",
    description: "Инверторный сварочный аппарат для ручной дуговой сварки.",
    pricePerDay: 900,
    image: "https://images.unsplash.com/photo-1612544428738-8f5272aace34?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    category: "Сварочное оборудование",
    available: true
  },
  {
    id: 5,
    name: "Газонокосилка Husqvarna LC 140",
    description: "Бензиновая газонокосилка для ухода за газоном на небольших и средних участках.",
    pricePerDay: 1000,
    image: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    category: "Садовая техника",
    available: true
  },
  {
    id: 6,
    name: "Лазерный нивелир Bosch GLL 3-80",
    description: "Профессиональный лазерный нивелир с 3 лазерными плоскостями для точных строительных работ.",
    pricePerDay: 1500,
    image: "https://images.unsplash.com/photo-1607974108257-8d167c2f6fad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    category: "Измерительные приборы",
    available: true
  },
];

const ProductsTable = () => {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const handleEdit = (id: number) => {
    toast({
      title: "Редактирование",
      description: `Открыто редактирование инструмента ID: ${id}`,
    });
  };

  const handleDelete = (id: number) => {
    toast({
      title: "Удаление",
      description: `Инструмент ID: ${id} удален`,
      variant: "destructive",
    });
  };

  const handleAddProduct = () => {
    toast({
      title: "Новый инструмент",
      description: "Открыта форма добавления нового инструмента",
    });
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Инструменты</CardTitle>
        <Button onClick={handleAddProduct}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Поиск инструмента..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Фото</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Цена/день</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    <div className="h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate font-medium">{product.name}</div>
                    <div className="truncate text-xs text-gray-500">
                      {product.description}
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.pricePerDay} ₽</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.available ? "default" : "destructive"}
                    >
                      {product.available ? "Доступен" : "Недоступен"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Редактировать
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductsTable;
