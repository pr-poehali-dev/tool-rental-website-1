
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package2, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  path: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  path,
  active,
  onClick
}) => {
  return (
    <Link 
      to={path} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-gray-600 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
};

const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из админ-панели",
    });
    // В реальном приложении здесь будет логика выхода
  };

  const sidebarContent = (
    <>
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🔨</span>
          <span className="font-bold text-xl">ИнструментПро</span>
        </Link>
        
        <p className="text-xs text-gray-500 mb-4">АДМИН-ПАНЕЛЬ</p>
        
        <div className="space-y-1 mb-6">
          <SidebarItem 
            icon={<LayoutDashboard size={18} />} 
            text="Дашборд" 
            path="/admin" 
            active={isActive("/admin")}
            onClick={() => setMobileOpen(false)}
          />
          
          <Collapsible open={catalogOpen} onOpenChange={setCatalogOpen}>
            <CollapsibleTrigger className="w-full">
              <div className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md transition-colors",
                (isActive("/admin/tools") || isActive("/admin/categories")) 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:bg-gray-100"
              )}>
                <div className="flex items-center gap-3">
                  <Package2 size={18} />
                  <span>Каталог</span>
                </div>
                <ChevronDown size={16} className={cn(
                  "transition-transform",
                  catalogOpen && "transform rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pl-7 mt-1 space-y-1">
                <SidebarItem 
                  icon={<span className="w-5 h-5 flex items-center justify-center">•</span>} 
                  text="Инструменты" 
                  path="/admin/tools" 
                  active={isActive("/admin/tools")}
                  onClick={() => setMobileOpen(false)}
                />
                <SidebarItem 
                  icon={<span className="w-5 h-5 flex items-center justify-center">•</span>} 
                  text="Категории" 
                  path="/admin/categories" 
                  active={isActive("/admin/categories")}
                  onClick={() => setMobileOpen(false)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          <SidebarItem 
            icon={<ShoppingCart size={18} />} 
            text="Заказы" 
            path="/admin/orders" 
            active={isActive("/admin/orders")}
            onClick={() => setMobileOpen(false)}
          />
          
          <SidebarItem 
            icon={<Users size={18} />} 
            text="Клиенты" 
            path="/admin/customers" 
            active={isActive("/admin/customers")}
            onClick={() => setMobileOpen(false)}
          />
          
          <SidebarItem 
            icon={<Settings size={18} />} 
            text="Настройки" 
            path="/admin/settings" 
            active={isActive("/admin/settings")}
            onClick={() => setMobileOpen(false)}
          />
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900" 
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-3" />
          Выйти
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white z-30 border-b p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-gray-700"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🔨</span>
          <span className="font-bold">ИнструментПро</span>
        </Link>
        <div className="w-10" /> {/* Для центрирования логотипа */}
      </div>
      
      {/* Mobile Sidebar */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-20 bg-black/50 transition-opacity",
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className={cn(
          "fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl transition-transform",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <ScrollArea className="h-full pt-14">
            {sidebarContent}
          </ScrollArea>
        </div>
      </div>
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 bg-white border-r h-screen sticky top-0">
        <ScrollArea className="h-full flex flex-col">
          {sidebarContent}
        </ScrollArea>
      </div>
    </>
  );
};

export default AdminSidebar;
