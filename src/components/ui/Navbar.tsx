
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary py-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🔨</span> ИнструментПро
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/catalog" className="text-white hover:text-gray-200 transition-colors">
            Каталог
          </Link>
          <Link to="/about" className="text-white hover:text-gray-200 transition-colors">
            О нас
          </Link>
          <Link to="/contacts" className="text-white hover:text-gray-200 transition-colors">
            Контакты
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="text-white">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="icon" className="text-white">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="text-primary bg-white hover:bg-gray-100">
              Войти
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-dark py-4 px-4 absolute top-full left-0 w-full">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/catalog" 
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Каталог
            </Link>
            <Link 
              to="/about" 
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              О нас
            </Link>
            <Link 
              to="/contacts" 
              className="text-white hover:text-gray-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Контакты
            </Link>
            <div className="flex justify-between mt-2">
              <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="icon" className="text-white">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="ml-2">Корзина</span>
                </Button>
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" size="icon" className="text-white">
                  <User className="h-5 w-5" />
                  <span className="ml-2">Профиль</span>
                </Button>
              </Link>
            </div>
            <Link to="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="outline" className="text-primary bg-white hover:bg-gray-100 w-full">
                Войти
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
