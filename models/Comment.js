const { pool } = require('../config/db');

class Comment {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM comments ORDER BY date DESC');
    return rows;
  }

  static async getByPostId(postId) {
    const [rows] = await pool.execute('SELECT * FROM comments WHERE postId = ? ORDER BY date DESC', [postId]);
    return rows;
  }

  static async getByPlantId(plantId) {
    const [rows] = await pool.execute('SELECT * FROM comments WHERE plantId = ? ORDER BY date DESC', [plantId]);
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM comments WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(comment) {
    const { postId, plantId, userId, content } = comment;
    const [result] = await pool.execute(
      'INSERT INTO comments (postId, plantId, userId, content) VALUES (?, ?, ?, ?)',
      [postId, plantId, userId, content]
    );
    return result.insertId;
  }

  static async update(id, content) {
    const [result] = await pool.execute(
      'UPDATE comments SET content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [content, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = Comment;