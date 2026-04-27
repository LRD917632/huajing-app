const { pool } = require('../config/db');

class DiaryPost {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM diary_posts ORDER BY date DESC');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM diary_posts WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByAuthor(author) {
    const [rows] = await pool.execute('SELECT * FROM diary_posts WHERE author = ? ORDER BY date DESC', [author]);
    return rows;
  }

  static async getByPlantId(plantId) {
    const [rows] = await pool.execute('SELECT * FROM diary_posts WHERE plantId = ? ORDER BY date DESC', [plantId]);
    return rows;
  }

  static async create(post) {
    const { author, title, content, image, plantId } = post;
    const [result] = await pool.execute(
      'INSERT INTO diary_posts (author, title, content, image, plantId) VALUES (?, ?, ?, ?, ?)',
      [author, title, content, image, plantId]
    );
    return result.insertId;
  }

  static async update(id, post) {
    const { title, content, image, plantId } = post;
    const [result] = await pool.execute(
      'UPDATE diary_posts SET title = ?, content = ?, image = ?, plantId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, image, plantId, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM diary_posts WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async addLike(postId) {
    const [result] = await pool.execute('UPDATE diary_posts SET likes = likes + 1 WHERE id = ?', [postId]);
    return result.affectedRows;
  }

  static async removeLike(postId) {
    const [result] = await pool.execute('UPDATE diary_posts SET likes = likes - 1 WHERE id = ? AND likes > 0', [postId]);
    return result.affectedRows;
  }
}

module.exports = DiaryPost;