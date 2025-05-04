
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { bookingsApi, toolsApi, Tool } from "@/lib/api";
import { useApi } from "@/hooks/useApi";

interface BookingFormProps {
  toolId: number;
  onSuccess?: () => void;
}

const BookingForm = ({ toolId, onSuccess }: BookingFormProps) => {
  const [tool, setTool] = useState<Tool | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);
  const [isLoadingTool, setIsLoadingTool] = useState(true);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  
  const { toast } = useToast();
  
  const { execute: createBooking, isLoading: isCreatingBooking } = useApi(
    bookingsApi.create,
    { showSuccessToast: true }
  );

  // Загрузка информации об инструменте
  useEffect(() => {
    const fetchToolData = async () => {
      try {
        setIsLoadingTool(true);
        const toolData = await toolsApi.getById(toolId);
        setTool(toolData);
        
        // Загрузка существующих бронирований
        const bookings = await bookingsApi.getByToolId(toolId);
        
        // Создание массива недоступных дат
        const unavailableDates: Date[] = [];
        bookings.forEach(booking => {
          if (booking.status !== 'cancelled') {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const dates = getDatesBetween(start, end);
            unavailableDates.push(...dates);
          }
        });
        
        setDisabledDates(unavailableDates);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить информацию об инструменте",
        });
      } finally {
        setIsLoadingTool(false);
      }
    };
    
    fetchToolData();
  }, [toolId, toast]);

  // Обновление расчетов при изменении дат
  useEffect(() => {
    if (startDate && endDate) {
      // Расчет количества дней
      const days = calculateDaysDifference(startDate, endDate);
      setTotalDays(days);
      
      // Расчет стоимости
      if (tool) {
        setTotalPrice(days * tool.pricePerDay);
      }
      
      // Проверка доступности
      checkAvailability();
    } else {
      setTotalDays(0);
      setTotalPrice(0);
      setIsAvailable(null);
    }
  }, [startDate, endDate, tool]);

  // Функция для проверки доступности инструмента
  const checkAvailability = async () => {
    if (!startDate || !endDate || !tool) return;
    
    try {
      setIsCheckingAvailability(true);
      
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const result = await bookingsApi.checkAvailability(
        toolId,
        formattedStartDate,
        formattedEndDate
      );
      
      setIsAvailable(result.available);
    } catch (error) {
      setIsAvailable(false);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось проверить доступность инструмента",
      });
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !tool || !isAvailable) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, проверьте правильность заполнения формы",
      });
      return;
    }
    
    try {
      // В реальном приложении здесь создавался бы клиент или использовался существующий
      const customerId = 1; // Временно используем фиктивный ID клиента
      
      await createBooking({
        toolId,
        customerId,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        status: "pending",
        totalPrice
      });
      
      // Сброс формы
      setStartDate(undefined);
      setEndDate(undefined);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Ошибка уже обрабатывается в хуке useApi
    }
  };

  // Вспомогательные функции
  const getDatesBetween = (startDate: Date, endDate: Date) => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };
  
  const calculateDaysDifference = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 так как включаем начальный день
  };

  if (isLoadingTool) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tool) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-red-500">Инструмент не найден</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Бронирование инструмента</CardTitle>
        <CardDescription>
          {tool.name} - {tool.pricePerDay} ₽/день
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Дата начала</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP", { locale: ru })
                    ) : (
                      "Выберите дату"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={[
                      ...disabledDates,
                      { before: new Date() }
                    ]}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date">Дата окончания</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP", { locale: ru })
                    ) : (
                      "Выберите дату"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={[
                      ...disabledDates,
                      { before: startDate || new Date() }
                    ]}
                    locale={ru}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {startDate && endDate && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Срок аренды:</span>
                <span className="font-medium">{totalDays} дн.</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Итоговая стоимость:</span>
                <span className="text-primary">{totalPrice} ₽</span>
              </div>
              
              {isCheckingAvailability ? (
                <div className="mt-2 flex items-center text-blue-600">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Проверка доступности...
                </div>
              ) : isAvailable === true ? (
                <div className="mt-2 text-green-600">
                  Инструмент доступен в выбранные даты!
                </div>
              ) : isAvailable === false ? (
                <div className="mt-2 text-red-600">
                  Инструмент недоступен в выбранные даты
                </div>
              ) : null}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">ФИО</Label>
            <Input
              id="name"
              placeholder="Иванов Иван Иванович"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mail@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              placeholder="+7 (900) 123-45-67"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={!isAvailable || isCreatingBooking}
        >
          {isCreatingBooking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Оформление...
            </>
          ) : (
            "Забронировать"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookingForm;
