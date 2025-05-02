
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
            Профессиональный инструмент <br />
            <span className="text-yellow-300">в аренду</span>
          </h1>
          <p className="text-xl mb-8 text-white/90">
            Получите доступ к профессиональному инструменту без необходимости покупки.
            Экономьте деньги и пространство с нашим сервисом проката.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalog">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 text-lg">
                Выбрать инструмент
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 text-lg">
                Как это работает
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="absolute right-0 bottom-0 opacity-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="450" height="450" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
