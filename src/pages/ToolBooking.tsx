
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { toolsApi, Tool } from "@/lib/api";
import BookingForm from "@/components/BookingForm";
import ToolAvailabilityCalendar from "@/components/ToolAvailabilityCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ToolBooking = () => {
  const { id } = useParams<{ id: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTool = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const toolData = await toolsApi.getById(Number(id));
        setTool(toolData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить информацию об инструменте",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTool();
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto py-12">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Инструмент не найден</h2>
          <p className="mt-2 text-gray-500">
            Возможно, инструмент был удален или у вас неверная ссылка.
          </p>
          <Button asChild className="mt-6">
            <Link to="/catalog">Вернуться в каталог</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/catalog">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Назад в каталог
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md overflow-hidden mb-4 aspect-square bg-gray-100">
                <img
                  src={tool.image || "https://source.unsplash.com/300x300/?tool"}
                  alt={tool.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-2xl font-bold">{tool.name}</h1>
              <p className="text-primary text-xl font-semibold mt-2">
                {tool.pricePerDay} ₽/день
              </p>

              <Separator className="my-4" />

              <div className="text-sm text-gray-600">
                <p className="mb-4">{tool.description}</p>
                <p>
                  <strong>Категория:</strong> {tool.category}
                </p>
                <p className="mt-2">
                  <strong>Статус:</strong>{" "}
                  <span
                    className={
                      tool.available ? "text-green-600" : "text-red-600"
                    }
                  >
                    {tool.available ? "Доступен" : "Недоступен"}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="booking">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="booking" className="flex-1">
                Бронирование
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex-1">
                Календарь доступности
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="booking">
              <BookingForm 
                toolId={tool.id} 
                onSuccess={() => {
                  toast({
                    title: "Бронирование создано",
                    description: "Ваше бронирование успешно создано и ожидает подтверждения",
                  });
                }}
              />
            </TabsContent>
            
            <TabsContent value="calendar">
              <ToolAvailabilityCalendar toolId={tool.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ToolBooking;
