'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import BookmarkCard from './BookmarkCard';
import toast from 'react-hot-toast';

interface Bookmark {
  id: number;
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags: string;
  created_at: string;
}

interface DraggableBookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<Bookmark>) => void;
  onBookmarksReorder: (bookmarks: Bookmark[]) => void;
}

export default function DraggableBookmarkList({
  bookmarks,
  onDelete,
  onUpdate,
  onBookmarksReorder,
}: DraggableBookmarkListProps) {
  const [items, setItems] = useState<Bookmark[]>(bookmarks);

  useEffect(() => {
    setItems(bookmarks);
  }, [bookmarks]);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    onBookmarksReorder(newItems);

    // Show success message
    toast.success('Bookmarks reordered successfully');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600 dark:text-secondary-400">
          No bookmarks yet. Add your first bookmark above!
        </p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="bookmarks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((bookmark, index) => (
              <Draggable
                key={bookmark.id}
                draggableId={bookmark.id.toString()}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`transition-transform duration-200 ${
                      snapshot.isDragging ? 'scale-105 shadow-xl' : ''
                    }`}
                  >
                    <BookmarkCard
                      bookmark={bookmark}
                      onDelete={onDelete}
                      onUpdate={onUpdate}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
} 