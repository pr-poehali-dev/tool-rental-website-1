
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  LogOut,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{name: string, email: string, avatar?: string} | null>(null);
  const [notifications, setNotifications] = useState<{id: number, message: string, time: string}[]>([]);
  const { toast } = useToast();

  // API интеграция для получения пользователя
  const { execute: getCurrentUser, isLoading: isLoadingUser } = useApi(
    authApi.getCurrentUser,
    { showErrorToast: false }
  );

  // API интеграция для выхода
  const { execute: logout } = useApi(
    authApi.logout,
    { showSuccessToast: true }
  );

  // Загрузка информации о пользователе
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // В реальном приложении здесь был бы API-запрос
        // Для демонстрации используем мок данных
        const userData = await getCurrentUser();
        setUser(userData || {
          name: "Администратор",
          email: "admin@instrumentpro.ru",
          avatar: "https://source.unsplash.com/100x100/?portrait"
        });
      } catch (error) {
        // Для демо используем мок данные даже при ошибке
        setUser({
          name: "Администратор",
          email: "admin@instrumentpro.ru"
        });
      }
    };

    loadUserData();

    // Демо-уведомления
    setNotifications([
      { 
        id: 1, 
        message: "Новый заказ #2593 требует подтверждения", 
        time: "5 минут назад" 
      },
      { 
        id: 2, 
        message: "Инструмент 'Перфоратор Bosch' возвращен клиентом", 
        time: "1 час назад" 
      },
      { 
        id: 3, 
        message: "Платеж по заказу #2590 подтвержден", 
        time: "2 часа назад" 
      }
    ]);
  }, [getCurrentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      // Обработка ошибок уже в хуке useApi
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6 lg:h-[60px]">
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle menu</span>
      </Button>

      {/* Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>

      {/* User and notifications */}
      <div className="flex items-center gap-2">
        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.length > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  variant="destructive"
                >
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Уведомления</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-3 px-4 text-center text-sm text-muted-foreground">
                Нет новых уведомлений
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="cursor-pointer py-3 px-4"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer flex justify-center">
              <p className="text-xs font-medium">Показать все уведомления</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name} />}
                <AvatarFallback>{user?.name?.charAt(0) || "A"}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
            {user && (
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Профиль</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Настройки</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
