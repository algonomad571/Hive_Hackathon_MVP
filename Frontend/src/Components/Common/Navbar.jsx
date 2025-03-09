import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 h-16 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            {/* <img src="/logo.png" alt="HiveQuant " className="h-8 w-auto" /> */}
            <span className="text-xl font-bold text-white">HiveQuant </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/features">Features</NavLink>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/premium">Premium</NavLink>
            <Link
              to="/simulator"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium relative group"
            >
              <span>AI Assistant</span>
              <span className="absolute bottom-0 left-0 w-full h-px bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>

            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <button className="px-4 py-2 rounded-full text-white hover:text-yellow-400 transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 transition-all">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/about">About</MobileNavLink>
              <MobileNavLink to="/features">Features</MobileNavLink>
              <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
              <MobileNavLink to="/premium">Premium</MobileNavLink>
              <MobileNavLink to="/simulator">AI Assistant</MobileNavLink>
              
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/login">
                  <button className="w-full px-4 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-300 hover:text-white transition-colors duration-200 relative group"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-200"
  >
    {children}
  </Link>
);

export default Navbar;