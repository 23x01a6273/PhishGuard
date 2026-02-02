import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 w-full px-6 py-4 z-50 bg-deep-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold font-sans text-white flex items-center gap-2">
          <Shield className="text-neon-green" size={24} />
          <span>PhishGuard</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400 items-center">
          <Link to="/" className="hover:text-white transition">Features</Link>
          <Link to="/" className="hover:text-white transition">Pricing</Link>
          <Link to="/" className="hover:text-white transition">API</Link>
          
          <div className="flex gap-4 ml-4 items-center">
            <Link to="/login" className="text-white hover:text-neon-green transition">Log in</Link>
            <Link to="/signup" className="bg-neon-green text-black px-5 py-2 rounded-full font-bold hover:bg-green-400 transition text-xs">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-deep-black/95 backdrop-blur-md border-b border-gray-800 p-4 flex flex-col gap-4 text-center">
          <Link to="/" className="text-gray-300 hover:text-neon-green" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-neon-green" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <Link to="/login" className="text-gray-300 hover:text-neon-green" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/signup" className="text-neon-green font-bold" onClick={() => setIsOpen(false)}>Get Started</Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
