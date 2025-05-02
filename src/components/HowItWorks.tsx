
import Icon from "@/components/ui/icon";

type StepProps = {
  icon: string;
  title: string;
  description: string;
};

const Step = ({ icon, title, description }: StepProps) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
      <Icon name={icon} size={32} className="text-primary" />
    </div>
    <h3 className="font-bold text-xl mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: "Search",
      title: "Выберите инструмент",
      description: "Просмотрите наш каталог и выберите нужный инструмент для вашего проекта."
    },
    {
      icon: "CalendarDays",
      title: "Забронируйте даты",
      description: "Укажите даты аренды и оформите заказ онлайн в несколько кликов."
    },
    {
      icon: "PackageOpen",
      title: "Получите инструмент",
      description: "Заберите инструмент в нашем пункте выдачи или закажите доставку."
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Step 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
