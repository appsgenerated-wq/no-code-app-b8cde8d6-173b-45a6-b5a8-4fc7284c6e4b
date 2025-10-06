import React, { useState, useEffect } from 'react';
import Manifest from '@mnfst/sdk';
import LandingPage from './screens/LandingPage';
import DashboardPage from './screens/DashboardPage';
import config from './constants.js';
import { testBackendConnection } from './services/apiService.js';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [currentScreen, setCurrentScreen] = useState(null); // Start as null to show loading state
  const [backendConnected, setBackendConnected] = useState(false);
  const manifest = new Manifest({ baseURL: config.BACKEND_URL, appId: config.APP_ID });

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🚀 [APP] Initializing application...');
      const connectionResult = await testBackendConnection();
      setBackendConnected(connectionResult.success);

      if (connectionResult.success) {
        console.log('✅ [APP] Backend connection successful.');
        try {
          const currentUser = await manifest.from('User').me();
          setUser(currentUser);
          setCurrentScreen('dashboard');
          console.log('👤 [APP] User is logged in:', currentUser.email);
        } catch (error) {
          setUser(null);
          setCurrentScreen('landing');
          console.log('👤 [APP] No active user session.');
        }
      } else {
        console.error('❌ [APP] Backend connection failed:', connectionResult.error);
        setCurrentScreen('landing'); // Show landing page even if backend fails
      }
    };

    initializeApp();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await manifest.login(email, password);
      const loggedInUser = await manifest.from('User').me();
      setUser(loggedInUser);
      setCurrentScreen('dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = async () => {
    await manifest.logout();
    setUser(null);
    setRecipes([]);
    setCurrentScreen('landing');
  };

  const loadRecipes = async () => {
    try {
      const response = await manifest.from('Recipe').find({
        include: ['owner'],
        sort: { createdAt: 'desc' },
      });
      setRecipes(response.data);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      const newRecipe = await manifest.from('Recipe').create(recipeData);
      // Refetch all recipes to get the new one with owner info included
      await loadRecipes();
    } catch (error) {
      console.error('Failed to create recipe:', error);
      alert(`Error creating recipe: ${error.message}`);
    }
  };
  
  const renderContent = () => {
    if (currentScreen === null) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className='text-gray-500'>Loading Recipe Hub...</p></div>;
    }
    if (currentScreen === 'dashboard' && user) {
      return (
        <DashboardPage
          user={user}
          recipes={recipes}
          onLogout={handleLogout}
          onLoadRecipes={loadRecipes}
          onCreateRecipe={createRecipe}
        />
      );
    }
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className='font-sans'>
      <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${backendConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
        <span className='text-xs text-gray-500'>{backendConnected ? 'API Connected' : 'API Disconnected'}</span>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
