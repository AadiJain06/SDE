-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to bookmarks table
ALTER TABLE bookmarks ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_category_id ON bookmarks(category_id);

-- Insert some default categories
INSERT INTO categories (user_id, name, color) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Work', '#EF4444'),
  ('00000000-0000-0000-0000-000000000000', 'Personal', '#10B981'),
  ('00000000-0000-0000-0000-000000000000', 'Learning', '#F59E0B'),
  ('00000000-0000-0000-0000-000000000000', 'Entertainment', '#8B5CF6'),
  ('00000000-0000-0000-0000-000000000000', 'Shopping', '#EC4899');
