import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Droplets } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sources', path: '/sources' },
    { name: 'Pollutants', path: '/pollutants' },
    { name: 'Treatment', path: '/treatment' },
    { name: 'Success Stories', path: '/success' },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md' 
          : 'bg-transparent dark:bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <NavLink 
            to="/" 
            className="flex items-center space-x-2"
          >
            <Droplets className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              AquaAware India
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) => 
                  `font-medium transition-all duration-300 hover:text-blue-600 ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-black dark:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-black dark:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => 
                      `block px-4 py-2 font-medium rounded-md transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                          : 'text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;