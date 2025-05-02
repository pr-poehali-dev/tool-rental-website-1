
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CatalogFilterProps {
  onFilter: (filters: FilterState) => void;
}

interface FilterState {
  categories: string[];
  priceRange: [number, number];
  availability: boolean;
}

const CatalogFilter: React.FC<CatalogFilterProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 5000],
    availability: false,
  });

  const categories = [
    "Электроинструмент",
    "Строительное оборудование",
    "Садовая техника",
    "Измерительные приборы",
    "Сварочное оборудование",
    "Клининговое оборудование"
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    const updatedFilters = {
      ...filters,
      categories: updatedCategories
    };
    
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const updatedFilters = {
      ...filters,
      priceRange: [value[0], value[1]] as [number, number]
    };
    
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const handleAvailabilityChange = (checked: boolean) => {
    const updatedFilters = {
      ...filters,
      availability: checked
    };
    
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      categories: [],
      priceRange: [0, 5000],
      availability: false
    };
    
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters} 
          className="text-sm text-primary"
        >
          Сбросить
        </Button>
      </div>
      
      <Separator className="mb-4" />
      
      <Accordion type="multiple" defaultValue={["categories", "price", "availability"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">Категории</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">Цена в день</AccordionTrigger>
          <AccordionContent>
            <div className="mt-2">
              <Slider
                defaultValue={[0, 5000]}
                min={0}
                max={5000}
                step={100}
                value={[filters.priceRange[0], filters.priceRange[1]]}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              <div className="flex justify-between">
                <span className="text-sm">{filters.priceRange[0]} ₽</span>
                <span className="text-sm">{filters.priceRange[1]} ₽</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="availability">
          <AccordionTrigger className="text-base font-medium">Доступность</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="availability" 
                checked={filters.availability}
                onCheckedChange={(checked) => 
                  handleAvailabilityChange(checked as boolean)
                }
              />
              <Label 
                htmlFor="availability"
                className="text-sm cursor-pointer"
              >
                Только доступные
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Separator className="my-4" />
      
      <Button className="w-full" onClick={() => onFilter(filters)}>
        Применить фильтры
      </Button>
    </div>
  );
};

export default CatalogFilter;
