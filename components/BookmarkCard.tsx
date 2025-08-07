'use client';

import { useState } from 'react';
import { ExternalLink, Trash2, Edit, Tag, Calendar, GripVertical } from 'lucide-react';
import toast from 'react-hot-toast';

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

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Bookmark>) => void;
}

export default function BookmarkCard({ bookmark, onDelete, onUpdate }: BookmarkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(bookmark.title);
  const [editedTags, setEditedTags] = useState(bookmark.tags);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(bookmark.id);
        toast.success('Bookmark deleted successfully');
      } else {
        toast.error('Failed to delete bookmark');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the bookmark');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editedTitle,
          tags: editedTags,
        }),
      });

      if (response.ok) {
        onUpdate(bookmark.id, {
          title: editedTitle,
          tags: editedTags,
        });
        setIsEditing(false);
        toast.success('Bookmark updated successfully');
      } else {
        toast.error('Failed to update bookmark');
      }
    } catch (error) {
      toast.error('An error occurred while updating the bookmark');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-secondary-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-secondary-200 dark:border-secondary-700">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <GripVertical className="w-4 h-4 text-secondary-400 cursor-grab active:cursor-grabbing" />
              <img
                src={bookmark.favicon}
                alt="Favicon"
                className="w-6 h-6 rounded"
                onError={(e) => {
                  e.currentTarget.src = '/default-favicon.ico';
                }}
              />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white"
                />
              ) : (
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white line-clamp-2">
                  {bookmark.title}
                </h3>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-secondary-600 hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 text-secondary-600 hover:text-accent-600 dark:text-secondary-400 dark:hover:text-accent-400 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-secondary-600 hover:text-red-600 dark:text-secondary-400 dark:hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm break-all"
          >
            {bookmark.url}
          </a>
        </div>

        <div className="mb-4">
          <p className="text-secondary-700 dark:text-secondary-300 text-sm leading-relaxed">
            {bookmark.summary}
          </p>
        </div>

        {isEditing ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={editedTags}
              onChange={(e) => setEditedTags(e.target.value)}
              placeholder="Enter tags separated by commas"
              className="w-full px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-secondary-700 dark:text-white text-sm"
            />
          </div>
        ) : (
          <div className="mb-4 space-y-2">
            {bookmark.categories && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: bookmark.categories.color }}
                />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  {bookmark.categories.name}
                </span>
              </div>
            )}
            {bookmark.tags && (
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-secondary-500" />
                <div className="flex flex-wrap gap-1">
                  {bookmark.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-secondary-100 dark:bg-secondary-700 text-secondary-700 dark:text-secondary-300 text-xs rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(bookmark.created_at)}</span>
          </div>
          {isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 