import React, { useState } from 'react';
import config from '../constants.js';

const LandingPage = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@manifest.build');
  const [password, setPassword] = useState('admin');

  const handleDemoLogin = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="absolute top-0 left-0 right-0 p-4">
         <div className="max-w-7xl mx-auto flex justify-between items-center">
           <h1 className='text-xl font-bold text-gray-800'>Recipe Hub</h1>
           <a 
             href={`${config.BACKEND_URL}/admin`} 
             target="_blank"
             rel="noopener noreferrer"
             className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
           >
             Admin Panel
           </a>
         </div>
      </header>
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Find and Share Amazing Recipes
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Your personal cookbook in the cloud. Create, organize, and discover delicious recipes from a community of food lovers.
          </p>
          <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Try the Demo</h3>
            <form onSubmit={handleDemoLogin} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Email address"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Password"
                    required
                />
                <button 
                    type="submit"
                    className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg"
                >
                    Login & Explore
                </button>
                <p className='text-xs text-gray-500 pt-2'>Use the pre-filled admin credentials or sign up for a new account in the Admin Panel.</p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
