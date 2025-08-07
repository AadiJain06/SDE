'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Search, Filter, Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import AddBookmarkForm from '@/components/AddBookmarkForm';
import DraggableBookmarkList from '@/components/DraggableBookmarkList';
import DarkModeToggle from '@/components/DarkModeToggle';
import CategoryManager from '@/components/CategoryManager';
import { Category } from '@/lib/supabase';

interface Bookmark {
  id: number;
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags: string;
  category_id?: string;
  categories?: {
    id: string;
    name: string;
    color: string;
  };
  created_at: string;
}

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBookmarks();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Filter bookmarks based on search term, selected tag, and selected category
    let filtered = bookmarks;

    if (searchTerm) {
      filtered = filtered.filter(
        bookmark =>
          bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bookmark.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag) {
      filtered = filtered.filter(bookmark =>
        bookmark.tags.toLowerCase().includes(selectedTag.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(bookmark =>
        bookmark.category_id === selectedCategory
      );
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchTerm, selectedTag, selectedCategory]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        toast.error('Failed to fetch bookmarks');
      }
    } catch (error) {
      toast.error('An error occurred while fetching bookmarks');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/');
        toast.success('Logged out successfully');
      } else {
        toast.error('Failed to logout');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
    }
  };



  const handleBookmarkDelete = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handleBookmarkUpdate = (id: number, updates: Partial<Bookmark>) => {
    setBookmarks(bookmarks.map(bookmark =>
      bookmark.id === id ? { ...bookmark, ...updates } : bookmark
    ));
  };

  const handleBookmarksReorder = (reorderedBookmarks: Bookmark[]) => {
    setBookmarks(reorderedBookmarks);
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    bookmarks.forEach(bookmark => {
      if (bookmark.tags) {
        bookmark.tags.split(',').forEach(tag => {
          if (tag.trim()) tags.add(tag.trim());
        });
      }
    });
    return Array.from(tags);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header */}
      <header className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
              Link Saver Dashboard
            </h1>
                         <div className="flex items-center space-x-4">
               <DarkModeToggle />
               <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-secondary-600 hover:text-red-600 dark:text-secondary-400 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Add Bookmark Form */}
        <AddBookmarkForm onBookmarkAdded={fetchBookmarks} />

        {/* Category Management */}
        <CategoryManager 
          onCategorySelect={setSelectedCategory}
          selectedCategoryId={selectedCategory}
        />

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Bookmarks
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title, URL, or summary..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Tag
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All tags</option>
                  {getAllTags().map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedTag || selectedCategory) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedTag && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">
                  Tag: {selectedTag}
                </span>
              )}
              {selectedCategory && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                  Category: {selectedCategory}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                  setSelectedCategory('');
                }}
                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Bookmarks Grid */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">
            Your Bookmarks ({filteredBookmarks.length})
          </h2>
          
                     {filteredBookmarks.length === 0 ? (
             <div className="text-center py-12">
               <p className="text-secondary-600 dark:text-secondary-400">
                 {searchTerm || selectedTag 
                   ? 'No bookmarks match your search criteria.' 
                   : 'No bookmarks yet. Add your first bookmark above!'
                 }
               </p>
             </div>
           ) : (
             <DraggableBookmarkList
               bookmarks={filteredBookmarks}
               onDelete={handleBookmarkDelete}
               onUpdate={handleBookmarkUpdate}
               onBookmarksReorder={handleBookmarksReorder}
             />
           )}
        </div>
      </div>
    </div>
  );
} 