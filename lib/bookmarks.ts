import { supabase, Bookmark } from './supabase';

export interface BookmarkInput {
  user_id: string;
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags?: string;
}

export const createBookmark = async (
  userId: string,
  url: string,
  title: string,
  favicon: string,
  summary: string,
  tags: string = '',
  categoryId?: string
): Promise<Bookmark> => {
  console.log('Creating bookmark with user ID:', userId);
  const { data, error } = await supabase
    .from('bookmarks')
    .insert([
      {
        user_id: userId,
        url,
        title,
        favicon,
        summary,
        tags,
        category_id: categoryId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating bookmark:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getBookmarksByUserId = async (userId: string): Promise<Bookmark[]> => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      *,
      categories (
        id,
        name,
        color
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const getBookmarkById = async (id: string, userId: string): Promise<Bookmark | null> => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};

export const updateBookmark = async (
  id: string,
  userId: string,
  updates: Partial<Pick<Bookmark, 'title' | 'summary' | 'tags' | 'category_id'>>
): Promise<Bookmark | null> => {
  const { data, error } = await supabase
    .from('bookmarks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select(`
      *,
      categories (
        id,
        name,
        color
      )
    `)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};

export const deleteBookmark = async (id: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export const getBookmarksByTag = async (userId: string, tag: string): Promise<Bookmark[]> => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .ilike('tags', `%${tag}%`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}; 