import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend
    console.log("Logging in:", email, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-700 p-8 rounded-lg shadow-2xl backdrop-blur-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold font-mono text-white mb-2">
            <Shield className="text-neon-green" /> PhishGuard
          </Link>
          <h2 className="text-xl text-gray-300">Welcome Back</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-black/50 border border-gray-600 rounded p-3 text-white focus:border-neon-green outline-none transition"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2 flex justify-between">
              Password
              <a href="#" className="text-neon-green text-xs hover:underline">Forgot Password?</a>
            </label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full bg-black/50 border border-gray-600 rounded p-3 text-white focus:border-neon-green outline-none transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-neon-green text-black font-bold py-3 rounded hover:bg-green-400 hover:shadow-[0_0_10px_#39FF14] transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Don't have an account? <Link to="/signup" className="text-neon-green hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
