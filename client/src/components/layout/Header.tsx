import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Droplets } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // Always track scroll (global), but use classNames to apply effects selectively
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // set initial state on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Sources", path: "/sources" },
    { name: "Pollutants", path: "/pollutants" },
    { name: "Treatment", path: "/treatment" },
    { name: "Success Stories", path: "/success" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-in-out ${
        // Header keeps global scroll-aware behavior
        isScrolled
          ? "bg-slate-50/90 dark:bg-gray-900/80 backdrop-blur-lg shadow-md"
          : "bg-transparent dark:bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 relative">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-2">
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
                      ? "text-blue-600"
                      : "text-gray-500 dark:text-gray-400"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    isScrolled ? "text-gray-800" : "text-gray-400"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300"
              aria-label={`Switch to ${
                theme === "light" ? "dark" : "light"
              } mode`}
            >
              {theme === "light" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ${
                    !isScrolled && isHomePage
                      ? "text-gray-200"
                      : "text-gray-800"
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={toggleMenu}
              className={`${
                !isScrolled && isHomePage ? "text-gray-200" : "text-gray-800"
              } dark:text-white p-2`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className={`md:hidden absolute top-full left-0 w-full
              ${
                // On Home: scroll-aware; On others: fixed bg-gray-50 (light) / dark:s late-900
                isHomePage
                  ? isScrolled
                    ? "bg-slate-50 dark:bg-slate-900"
                    : "bg-gray-900/40 dark:bg-slate-900/60"
                  : "bg-slate-50 dark:bg-slate-900"
              }
              backdrop-blur-md dark:border-gray-800 max-h-[80vh] overflow-y-auto shadow-lg z-2 rounded-b-lg sm:rounded-lg`}
          >
            <ul className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => {
                      const activeBg =
                        !isScrolled && isHomePage
                          ? "bg-blue-900/40"
                          : "bg-blue-400/40";

                      return `block px-4 py-4 font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? `${activeBg} dark:bg-blue-900/20 text-blue-600 backdrop-blur-md shadow-sm`
                          : `text-gray-500 dark:text-gray-400 ${
                              isHomePage && isScrolled
                                ? "hover:bg-slate-700/10"
                                : "dark:hover:bg-gray-900"
                            } hover:shadow-sm hover:backdrop-blur-md`
                      }`;
                    }}
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
