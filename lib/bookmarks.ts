import { getDatabase } from './database';

export interface Bookmark {
  id: number;
  user_id: number;
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags: string;
  created_at: string;
}

export const createBookmark = async (
  userId: number,
  url: string,
  title: string,
  favicon: string,
  summary: string,
  tags: string = ''
): Promise<Bookmark> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.run(
      'INSERT INTO bookmarks (user_id, url, title, favicon, summary, tags) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, url, title, favicon, summary, tags],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        db.get(
          'SELECT * FROM bookmarks WHERE id = ?',
          [this.lastID],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row as Bookmark);
          }
        );
      }
    );
  });
};

export const getBookmarksByUserId = async (userId: number): Promise<Bookmark[]> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.all(
      'SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as Bookmark[]);
      }
    );
  });
};

export const getBookmarkById = async (id: number, userId: number): Promise<Bookmark | null> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.get(
      'SELECT * FROM bookmarks WHERE id = ? AND user_id = ?',
      [id, userId],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row as Bookmark | null);
      }
    );
  });
};

export const updateBookmark = async (
  id: number,
  userId: number,
  updates: Partial<Pick<Bookmark, 'title' | 'summary' | 'tags'>>
): Promise<Bookmark | null> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const values = [...Object.values(updates), id, userId];
    
    db.run(
      `UPDATE bookmarks SET ${setClause} WHERE id = ? AND user_id = ?`,
      values,
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        if (this.changes === 0) {
          resolve(null);
          return;
        }
        
        db.get(
          'SELECT * FROM bookmarks WHERE id = ?',
          [id],
          (err, row) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(row as Bookmark);
          }
        );
      }
    );
  });
};

export const deleteBookmark = async (id: number, userId: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.run(
      'DELETE FROM bookmarks WHERE id = ? AND user_id = ?',
      [id, userId],
      function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      }
    );
  });
};

export const getBookmarksByTag = async (userId: number, tag: string): Promise<Bookmark[]> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.all(
      'SELECT * FROM bookmarks WHERE user_id = ? AND tags LIKE ? ORDER BY created_at DESC',
      [userId, `%${tag}%`],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows as Bookmark[]);
      }
    );
  });
}; 