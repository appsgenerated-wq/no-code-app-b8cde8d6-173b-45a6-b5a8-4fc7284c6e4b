import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, recipes, onLogout, onLoadRecipes, onCreateRecipe }) => {
  const [newRecipe, setNewRecipe] = useState({ 
    title: '', 
    description: '', 
    ingredients: '', 
    instructions: '', 
    prepTime: 30, 
    cookTime: 60, 
    difficulty: 'Medium' 
  });
  const [isFormVisible, setFormVisible] = useState(false);

  useEffect(() => {
    onLoadRecipes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    const dataToSubmit = { 
        ...newRecipe, 
        prepTime: parseInt(newRecipe.prepTime, 10),
        cookTime: parseInt(newRecipe.cookTime, 10)
    };
    await onCreateRecipe(dataToSubmit);
    setNewRecipe({ title: '', description: '', ingredients: '', instructions: '', prepTime: 30, cookTime: 60, difficulty: 'Medium' });
    setFormVisible(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user.name}!
            </h1>
            <p className="text-gray-600">Your personal recipe dashboard.</p>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href={`${config.BACKEND_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Admin Panel
            </a>
            <button 
              onClick={onLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>
        
        <div className="mb-8">
            <button 
                onClick={() => setFormVisible(!isFormVisible)}
                className='bg-indigo-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-all shadow'
            >
                {isFormVisible ? 'Cancel' : '+ Add New Recipe'}
            </button>
        </div>

        {isFormVisible && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 animate-fade-in-down">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create a New Recipe</h2>
            <form onSubmit={handleCreateRecipe} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className='col-span-1 md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                    <input type="text" name="title" placeholder="e.g., Classic Lasagna" value={newRecipe.title} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className='col-span-1 md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                    <textarea name="description" placeholder="A brief summary of your recipe" value={newRecipe.description} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" rows="2"></textarea>
                </div>
                 <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Ingredients</label>
                    <textarea name="ingredients" placeholder="1 cup flour..." value={newRecipe.ingredients} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4"></textarea>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Instructions</label>
                    <textarea name="instructions" placeholder="Step 1: Mix flour..." value={newRecipe.instructions} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" rows="4"></textarea>
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Prep Time (minutes)</label>
                    <input type="number" name="prepTime" value={newRecipe.prepTime} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                 <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Cook Time (minutes)</label>
                    <input type="number" name="cookTime" value={newRecipe.cookTime} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Difficulty</label>
                    <select name="difficulty" value={newRecipe.difficulty} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </div>
                <div className="col-span-1 md:col-span-2 flex justify-end">
                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors shadow">Save Recipe</button>
                </div>
            </form>
            </div>
        )}

        <main>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Your Recipes</h2>
          {recipes.length === 0 ? (
            <div className='text-center py-12 bg-white rounded-lg shadow-md'>
                <p className="text-gray-500">You haven't created any recipes yet.</p>
                <p className='text-gray-400 text-sm mt-1'>Click '+ Add New Recipe' to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {recipe.photo && <img src={recipe.photo.thumbnail.url} alt={recipe.title} className='w-full h-48 object-cover' />}
                  <div className="p-4">
                    <div className='flex justify-between items-start'>
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{recipe.title}</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{recipe.difficulty}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>
                    <div className='flex text-sm text-gray-600 mt-4 space-x-4'>
                        <span>Prep: <strong>{recipe.prepTime}m</strong></span>
                        <span>Cook: <strong>{recipe.cookTime}m</strong></span>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 pt-2 border-t border-gray-100">By {recipe.owner?.name || 'Unknown'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
