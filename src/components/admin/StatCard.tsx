
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  iconColor?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  iconColor = "bg-primary/10 text-primary",
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h4 className="text-2xl font-bold mt-1 mb-2">{value}</h4>
            {description && <p className="text-sm text-gray-500">{description}</p>}
            
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <span 
                  className={cn(
                    "text-xs font-medium flex items-center",
                    trend === "up" && "text-green-600",
                    trend === "down" && "text-red-600",
                    trend === "neutral" && "text-gray-600"
                  )}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {trendValue}
                </span>
                <span className="text-xs text-gray-500">по сравнению с прошлым месяцем</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            iconColor
          )}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
