
import { useState, useEffect } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/Footer";
import CatalogFilter from "@/components/CatalogFilter";
import CatalogToolList from "@/components/CatalogToolList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolProps } from "@/components/ToolCard";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Catalog = () => {
  const [tools, setTools] = useState<ToolProps[]>([]);
  const [filteredTools, setFilteredTools] = useState<ToolProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("popular");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      const mockTools: ToolProps[] = [
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
        {
          id: 7,
          name: "Мойка высокого давления Karcher K5",
          description: "Мощная мойка высокого давления для эффективной очистки различных поверхностей.",
          pricePerDay: 1300,
          image: "https://images.unsplash.com/photo-1621610086302-b8e3d5e666a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          category: "Клининговое оборудование",
          available: true
        },
        {
          id: 8,
          name: "Бензопила STIHL MS 180",
          description: "Компактная и легкая бензопила для домашнего использования и садовых работ.",
          pricePerDay: 1100,
          image: "https://images.unsplash.com/photo-1643229901819-5347c7cd3118?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          category: "Садовая техника",
          available: false
        },
        {
          id: 9,
          name: "Плиткорез RUBI TX-700",
          description: "Профессиональный ручной плиткорез для прямой и диагональной резки керамической плитки.",
          pricePerDay: 800,
          image: "https://images.unsplash.com/photo-1621972750749-0e99a13a6270?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
          category: "Строительное оборудование",
          available: true
        }
      ];

      setTools(mockTools);
      setFilteredTools(mockTools);
      setIsLoading(false);
    }, 1000);
  }, []);

  const applyFilters = (
    toolList: ToolProps[],
    query: string,
    categories: string[],
    priceRange: [number, number],
    onlyAvailable: boolean
  ) => {
    return toolList.filter(tool => {
      // Поиск по названию и описанию
      const matchesSearch = 
        query === "" || 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase());
      
      // Фильтр по категориям
      const matchesCategory = 
        categories.length === 0 || 
        categories.includes(tool.category);
      
      // Фильтр по цене
      const matchesPrice = 
        tool.pricePerDay >= priceRange[0] && 
        tool.pricePerDay <= priceRange[1];
      
      // Фильтр по доступности
      const matchesAvailability = 
        !onlyAvailable || 
        tool.available;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });
  };

  const handleFilterChange = (filters: any) => {
    const filtered = applyFilters(
      tools,
      searchQuery,
      filters.categories,
      filters.priceRange,
      filters.availability
    );
    setFilteredTools(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = applyFilters(
      tools,
      searchQuery,
      [], // Категории
      [0, 5000], // Ценовой диапазон
      false // Только доступные
    );
    setFilteredTools(filtered);
  };

  const handleSort = (value: string) => {
    setSortOption(value);
    
    let sorted = [...filteredTools];
    switch (value) {
      case "price-asc":
        sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // По умолчанию популярные (по ID в нашем случае)
        sorted.sort((a, b) => a.id - b.id);
    }
    
    setFilteredTools(sorted);
  };

  const clearSearch = () => {
    setSearchQuery("");
    const filtered = applyFilters(
      tools,
      "",
      [], // Категории
      [0, 5000], // Ценовой диапазон
      false // Только доступные
    );
    setFilteredTools(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Каталог инструментов</h1>
        
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Найти инструмент..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button type="submit">Поиск</Button>
          </form>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Найдено инструментов: {filteredTools.length}
          </div>
          
          <div className="flex gap-3 items-center">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter size={16} />
                    <span>Фильтры</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                  <h2 className="text-xl font-bold mb-6">Фильтры</h2>
                  <CatalogFilter onFilter={handleFilterChange} />
                </SheetContent>
              </Sheet>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:inline">Сортировать:</span>
              <Select value={sortOption} onValueChange={handleSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="По популярности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">По популярности</SelectItem>
                  <SelectItem value="price-asc">Сначала дешевые</SelectItem>
                  <SelectItem value="price-desc">Сначала дорогие</SelectItem>
                  <SelectItem value="name">По названию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="hidden md:block">
            <CatalogFilter onFilter={handleFilterChange} />
          </div>
          <div className="lg:col-span-3">
            <CatalogToolList tools={filteredTools} isLoading={isLoading} />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Catalog;
