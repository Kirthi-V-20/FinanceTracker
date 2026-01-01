import React, { useState, useEffect } from 'react';
import { getCategories, createCategory } from '../api/categoryService';
import { Plus, Tag, Loader2 } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Failed to load categories");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setIsLoading(true);
    try {
      await createCategory({ name: newCategory });
      setNewCategory(''); 
      loadCategories();   
    } catch (err) {
      alert("Error adding category. Make sure you are logged in!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900">Budget Categories</h2>
        <p className="text-slate-500 text-sm">Organize your spending by groups</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              placeholder="Ex: Food, Rent, Entertainment..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-violet-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-violet-700 transition-all flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {fetching ? (
          <p className="text-slate-500">Loading your categories...</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.ID || cat.id || cat.name} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm hover:border-violet-200 transition-all">
              <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center text-violet-600">
                <Tag size={20} />
              </div>
              <span className="font-semibold text-slate-700">{cat.name}</span>
            </div>
          ))
        )}
        {!fetching && categories.length === 0 && (
          <p className="text-slate-400 text-sm italic">No categories added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;