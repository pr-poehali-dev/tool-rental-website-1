
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🔨</span> ИнструментПро
            </h3>
            <p className="text-gray-300 mb-4">
              Профессиональные инструменты в аренду для любых задач. Качество и надежность по доступным ценам.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="text-gray-300 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Правила аренды
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <address className="not-italic text-gray-300">
              <p className="mb-2">г. Москва, ул. Строителей, 15</p>
              <p className="mb-2">+7 (495) 123-45-67</p>
              <p>info@instrumentpro.ru</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} ИнструментПро. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
