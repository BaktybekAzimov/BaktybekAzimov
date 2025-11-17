import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="font-primary text-3xl text-kelechek-primary group-hover:text-kelechek-dark transition-colors">
              KELECHEK
            </div>
            <div className={`font-primary text-4xl transition-colors ${
              isScrolled ? 'text-kelechek-primary' : 'text-white'
            }`}>
              27
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <Navigation />
          </div>

          {/* Language Switcher */}
          <div className="hidden lg:flex items-center space-x-2">
            <button className={`px-3 py-1 rounded font-medium text-sm transition-colors ${
              isScrolled
                ? 'text-kelechek-dark hover:bg-kelechek-bg'
                : 'text-white hover:bg-white/10'
            }`}>
              RU
            </button>
            <button className={`px-3 py-1 rounded font-medium text-sm transition-colors ${
              isScrolled
                ? 'text-kelechek-gray hover:bg-kelechek-bg'
                : 'text-white/70 hover:bg-white/10'
            }`}>
              EN
            </button>
            <button className={`px-3 py-1 rounded font-medium text-sm transition-colors ${
              isScrolled
                ? 'text-kelechek-gray hover:bg-kelechek-bg'
                : 'text-white/70 hover:bg-white/10'
            }`}>
              КЫ
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg transition-colors hover:bg-kelechek-bg"
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-colors ${
                isScrolled ? 'text-kelechek-dark' : 'text-white'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-kelechek-bg">
            <Navigation mobile />

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-center space-x-2 mt-4 pt-4 border-t border-kelechek-bg">
              <button className="px-4 py-2 rounded font-medium text-sm bg-kelechek-primary text-white">
                RU
              </button>
              <button className="px-4 py-2 rounded font-medium text-sm text-kelechek-gray hover:bg-kelechek-bg">
                EN
              </button>
              <button className="px-4 py-2 rounded font-medium text-sm text-kelechek-gray hover:bg-kelechek-bg">
                КЫ
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
