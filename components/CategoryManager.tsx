'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/supabase';
import { Plus, Folder, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const categoryColors = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', 
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

interface CategoryManagerProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategoryId?: string;
}

export default function CategoryManager({ onCategorySelect, selectedCategoryId }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3B82F6' });
  const [editingCategory, setEditingCategory] = useState({ name: '', color: '#3B82F6' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        toast.success('Category created successfully!');
        setNewCategory({ name: '', color: '#3B82F6' });
        setIsAdding(false);
        fetchCategories();
      } else {
        toast.error('Failed to create category');
      }
    } catch (error) {
      toast.error('An error occurred while creating the category');
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editingCategory.name.trim()) {
      toast.error('Please enter a category name');
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingCategory),
      });

      if (response.ok) {
        toast.success('Category updated successfully!');
        setIsEditing(null);
        fetchCategories();
      } else {
        toast.error('Failed to update category');
      }
    } catch (error) {
      toast.error('An error occurred while updating the category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Bookmarks in this category will be moved to "No Category".')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Category deleted successfully!');
        fetchCategories();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the category');
    }
  };

  const startEditing = (category: Category) => {
    setIsEditing(category.id);
    setEditingCategory({ name: category.name, color: category.color });
  };

  return (
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
       <div className="flex items-center justify-between mb-6">
         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
           Manage Categories
         </h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {isAdding && (
                 <div className="mb-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
           <div className="flex items-center justify-between mb-4">
             <h4 className="font-medium text-gray-900 dark:text-white">Add New Category</h4>
             <button
               onClick={() => setIsAdding(false)}
               className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
             >
               <X className="w-4 h-4" />
             </button>
           </div>
          <div className="space-y-4">
                         <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                 Category Name
               </label>
               <input
                 type="text"
                 value={newCategory.name}
                 onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                 placeholder="Enter category name"
                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
               />
             </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-2">
                {categoryColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newCategory.color === color ? 'border-secondary-900 dark:border-white' : 'border-secondary-300 dark:border-secondary-600'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Add Category
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedCategoryId === category.id 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
            }`}
            onClick={() => onCategorySelect?.(category.id)}
          >
                         <div className="flex items-center space-x-3">
               <div 
                 className="w-4 h-4 rounded-full" 
                 style={{ backgroundColor: category.color }}
               />
               <Folder className="w-4 h-4 text-gray-500 dark:text-gray-400" />
               {isEditing === category.id ? (
                 <input
                   type="text"
                   value={editingCategory.name}
                   onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                   className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   onClick={(e) => e.stopPropagation()}
                 />
               ) : (
                 <span className="text-gray-900 dark:text-white">{category.name}</span>
               )}
             </div>
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              {isEditing === category.id ? (
                <>
                                   <button
                   onClick={() => handleUpdateCategory(category.id)}
                   className="p-1 text-green-600 hover:text-green-700"
                 >
                   <span className="text-sm text-green-600 hover:text-green-700">Save</span>
                 </button>
                 <button
                   onClick={() => setIsEditing(null)}
                   className="p-1 text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                 >
                   <span className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">Cancel</span>
                 </button>
                </>
              ) : (
                <>
                                     <button
                     onClick={() => startEditing(category)}
                     className="p-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                   >
                     <Edit className="w-4 h-4" />
                   </button>
                   <button
                     onClick={() => handleDeleteCategory(category.id)}
                     className="p-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
