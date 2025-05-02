
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/Footer";
import ToolCard, { ToolProps } from "@/components/ToolCard";
import { Link } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";

const Index = () => {
  // Имитация данных для инструментов
  const featuredTools: ToolProps[] = [
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
    }
  ];

  // Категории инструментов
  const categories = [
    { name: "Электроинструмент", icon: "🔌" },
    { name: "Строительное оборудование", icon: "🧱" },
    { name: "Садовая техника", icon: "🌱" },
    { name: "Измерительные приборы", icon: "📏" },
    { name: "Сварочное оборудование", icon: "⚡" },
    { name: "Клининговое оборудование", icon: "🧹" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Инструменты для любых задач</h1>
            <p className="text-xl mb-8">
              Профессиональное оборудование в аренду — экономьте на покупке, платите только за использование.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/catalog">
                <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-6 text-lg font-medium">
                  Каталог инструментов
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-6 text-lg font-medium">
                  О нашем сервисе
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Найти инструмент..."
              className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </section>
      
      {/* Featured Tools */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Популярные инструменты</h2>
            <Link to="/catalog" className="text-primary flex items-center hover:underline">
              Все инструменты <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Категории инструментов</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Link to="/catalog" key={index} className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Как работает аренда</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">1</div>
              <h3 className="text-xl font-semibold mb-2">Выберите инструмент</h3>
              <p className="text-gray-600">Найдите нужный инструмент в нашем каталоге и добавьте его в корзину.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">2</div>
              <h3 className="text-xl font-semibold mb-2">Оформите заказ</h3>
              <p className="text-gray-600">Укажите даты аренды, способ оплаты и доставки.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">3</div>
              <h3 className="text-xl font-semibold mb-2">Получите и используйте</h3>
              <p className="text-gray-600">Заберите инструмент в пункте выдачи или получите его с доставкой.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Готовы начать проект?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            У нас есть все необходимые инструменты для вашей работы. Арендуйте сейчас и экономьте!
          </p>
          <Link to="/catalog">
            <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-6 text-lg font-medium">
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
