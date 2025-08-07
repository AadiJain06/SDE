import { supabase, Category } from './supabase';

export interface CategoryInput {
  user_id: string;
  name: string;
  color?: string;
  parent_id?: string;
}

export const createCategory = async (
  userId: string,
  name: string,
  color: string = '#3B82F6',
  parentId?: string
): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([
      {
        user_id: userId,
        name,
        color,
        parent_id: parentId
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw new Error(error.message);
  }

  return data;
};

export const getCategoriesByUserId = async (userId: string): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .or(`user_id.eq.${userId},user_id.eq.00000000-0000-0000-0000-000000000000`)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const getCategoryById = async (id: string, userId: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};

export const updateCategory = async (
  id: string,
  userId: string,
  updates: Partial<Pick<Category, 'name' | 'color' | 'parent_id'>>
): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return data;
};

export const deleteCategory = async (id: string, userId: string): Promise<boolean> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

export const getCategoryTree = async (userId: string): Promise<Category[]> => {
  const categories = await getCategoriesByUserId(userId);
  
  // Build tree structure
  const categoryMap = new Map<string, Category & { children?: Category[] }>();
  const rootCategories: (Category & { children?: Category[] })[] = [];

  // Create map of all categories
  categories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Build tree structure
  categories.forEach(category => {
    if (category.parent_id && categoryMap.has(category.parent_id)) {
      const parent = categoryMap.get(category.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(categoryMap.get(category.id)!);
    } else {
      rootCategories.push(categoryMap.get(category.id)!);
    }
  });

  return rootCategories;
};
