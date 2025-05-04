
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { bookingsApi, Booking } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface ToolAvailabilityCalendarProps {
  toolId: number;
}

const ToolAvailabilityCalendar = ({ toolId }: ToolAvailabilityCalendarProps) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const data = await bookingsApi.getByToolId(toolId);
        setBookings(data);

        // Создаем массив занятых дат
        const unavailableDates: Date[] = [];
        data.forEach((booking) => {
          if (booking.status !== "cancelled") {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            const datesBetween = getDatesBetween(startDate, endDate);
            unavailableDates.push(...datesBetween);
          }
        });

        setBookedDates(unavailableDates);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить данные о бронировании",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [toolId, toast]);

  // Вспомогательная функция для получения всех дат в промежутке
  const getDatesBetween = (startDate: Date, endDate: Date) => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

  // Функция для стилизации календаря
  const calendarStyles = (date: Date) => {
    const isBooked = bookedDates.some(
      (bookedDate) => format(bookedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

    return {
      className: isBooked ? "bg-red-100 text-red-800 opacity-70" : "",
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Календарь доступности</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div>
            <div className="mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-red-100 border border-red-300"></div>
                <span>Занятые даты</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-4 w-4 rounded-full bg-white border"></div>
                <span>Доступные даты</span>
              </div>
            </div>
            <Calendar
              mode="multiple"
              selected={bookedDates}
              disabled={{ before: new Date() }}
              locale={ru}
              modifiers={{
                booked: bookedDates,
              }}
              modifiersStyles={{
                booked: { background: "#FEE2E2", color: "#991B1B" },
              }}
              styles={calendarStyles}
              className="rounded-md border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToolAvailabilityCalendar;
