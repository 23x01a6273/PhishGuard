import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Check, X } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Integrate with backend
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Grid_paper.svg')] opacity-5 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-700 p-8 rounded-lg shadow-2xl backdrop-blur-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold font-mono text-white mb-2">
            <Shield className="text-neon-green" /> PhishGuard
          </Link>
          <h2 className="text-xl text-gray-300">Create Account</h2>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-black/50 border border-gray-600 rounded p-3 text-white focus:border-neon-green outline-none transition"
              placeholder="John Doe"
              required
            />
          </div>

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
            <label className="block text-gray-400 text-sm mb-2">Password</label>
            <input 
              type="password"
              className="w-full bg-black/50 border border-gray-600 rounded p-3 text-white focus:border-neon-green outline-none transition"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Password Strength Indicator (Visual only for now) */}
            <div className="flex gap-1 mt-2 h-1">
              <div className="flex-1 bg-red-500 rounded-full"></div>
              <div className="flex-1 bg-yellow-500 rounded-full"></div>
              <div className="flex-1 bg-gray-700 rounded-full"></div>
              <div className="flex-1 bg-gray-700 rounded-full"></div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-neon-green text-black font-bold py-3 rounded hover:bg-green-400 hover:shadow-[0_0_10px_#39FF14] transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Already have an account? <Link to="/login" className="text-neon-green hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
