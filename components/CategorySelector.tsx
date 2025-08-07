'use client';

import { useState, useEffect, useRef } from 'react';
import { Category } from '@/lib/supabase';
import { Plus, Folder, ChevronDown, ChevronRight } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategoryId?: string;
  onCategoryChange: (categoryId?: string) => void;
  className?: string;
}

export default function CategorySelector({ 
  selectedCategoryId, 
  onCategoryChange, 
  className = '' 
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        console.log('CategorySelector - Fetched categories:', data.categories);
        setCategories(data.categories || []);
      } else {
        console.error('Failed to fetch categories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
  console.log('CategorySelector - Categories:', categories);
  console.log('CategorySelector - Selected category ID:', selectedCategoryId);
  console.log('CategorySelector - Selected category:', selectedCategory);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-gray-500" />
                     <span className="text-sm text-gray-900 dark:text-white">
             {selectedCategory ? (
               <span className="flex items-center gap-2">
                 <div 
                   className="w-3 h-3 rounded-full" 
                   style={{ backgroundColor: selectedCategory.color }}
                 />
                 {selectedCategory.name}
               </span>
             ) : (
               'Select Category'
             )}
           </span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-2">
            <button
              onClick={() => {
                onCategoryChange(undefined);
                setIsOpen(false);
              }}
              className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400">No Category</span>
            </button>
            
            {loading ? (
              <div className="p-2 text-sm text-gray-500 dark:text-gray-400">Loading categories...</div>
            ) : categories.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 dark:text-gray-400">No categories found</div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    console.log('CategorySelector - Clicked category:', category);
                    onCategoryChange(category.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-900 dark:text-white">{category.name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
