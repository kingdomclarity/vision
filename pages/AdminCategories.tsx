import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Flag, Plus, Edit2, Trash2, X, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  priority: number;
  is_active: boolean;
};

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [error, setError] = useState('');

  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('priority', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!editingCategory?.name) {
      setError('Category name is required');
      return;
    }

    try {
      const categoryData = {
        ...editingCategory,
        id: editingCategory.id || editingCategory.name.toLowerCase().replace(/\s+/g, '-'),
        priority: editingCategory.priority || 0,
        is_active: editingCategory.is_active ?? true
      };

      const { error } = await supabase
        .from('categories')
        .upsert(categoryData);

      if (error) throw error;

      await loadCategories();
      setEditingCategory(null);
      setError('');
    } catch (error: any) {
      console.error('Error saving category:', error);
      setError(error.message);
    }
  }

  async function handleDeleteCategory(id: string) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }

  async function handleReorder(id: string, direction: 'up' | 'down') {
    const currentIndex = categories.findIndex(c => c.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const updatedCategories = [...categories];
    const temp = updatedCategories[currentIndex].priority;
    updatedCategories[currentIndex].priority = updatedCategories[newIndex].priority;
    updatedCategories[newIndex].priority = temp;

    try {
      const { error } = await supabase
        .from('categories')
        .upsert([
          updatedCategories[currentIndex],
          updatedCategories[newIndex]
        ]);

      if (error) throw error;
      await loadCategories();
    } catch (error) {
      console.error('Error reordering categories:', error);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Flag className="h-8 w-8 text-gold-500" />
          <h1 className="text-3xl font-medium">Categories</h1>
        </div>
        <button
          onClick={() => setEditingCategory({})}
          className="flex items-center gap-2 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
        >
          <Plus className="h-5 w-5" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Order</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((category, index) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => handleReorder(category.id, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(category.id, 'down')}
                      disabled={index === categories.length - 1}
                      className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{category.name}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {category.description}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    category.is_active
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {category.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="p-2 text-gray-600 hover:text-gray-900"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Category Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium">
                {editingCategory.id ? 'Edit Category' : 'New Category'}
              </h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Lucide icon name)
                </label>
                <input
                  type="text"
                  value={editingCategory.icon || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500/20 focus:border-gold-500"
                  placeholder="e.g., Music"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingCategory.is_active ?? true}
                    onChange={(e) => setEditingCategory({ ...editingCategory, is_active: e.target.checked })}
                    className="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setError('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}