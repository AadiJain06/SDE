'use client';

import { useState } from 'react';
import { Plus, Link, Tag } from 'lucide-react';
import toast from 'react-hot-toast';
import CategorySelector from './CategorySelector';

interface AddBookmarkFormProps {
  onBookmarkAdded: () => void;
}

export default function AddBookmarkForm({ onBookmarkAdded }: AddBookmarkFormProps) {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url.trim(), 
          tags: tags.trim(),
          categoryId 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Bookmark added successfully!');
        setUrl('');
        setTags('');
        setCategoryId(undefined);
        onBookmarkAdded();
      } else {
        toast.error(data.error || 'Failed to add bookmark');
      }
    } catch (error) {
      toast.error('An error occurred while adding the bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Add New Bookmark
        </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL
          </label>
          <div className="relative">
            <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (optional)
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tags help you organize and filter your bookmarks
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category (optional)
          </label>
          <CategorySelector
            selectedCategoryId={categoryId}
            onCategoryChange={setCategoryId}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Organize bookmarks into folders for better management
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Plus className="w-5 h-5 mr-2" />
              Add Bookmark
            </>
          )}
        </button>
      </form>
    </div>
  );
} 