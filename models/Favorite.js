const { pool } = require('../config/db');

class Favorite {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM favorites');
    return rows;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.execute('SELECT * FROM favorites WHERE userId = ?', [userId]);
    return rows;
  }

  static async getByPlantId(plantId) {
    const [rows] = await pool.execute('SELECT * FROM favorites WHERE plantId = ?', [plantId]);
    return rows;
  }

  static async getByUserIdAndPlantId(userId, plantId) {
    const [rows] = await pool.execute('SELECT * FROM favorites WHERE userId = ? AND plantId = ?', [userId, plantId]);
    return rows[0];
  }

  static async create(favorite) {
    const { userId, plantId } = favorite;
    const [result] = await pool.execute(
      'INSERT INTO favorites (userId, plantId) VALUES (?, ?)',
      [userId, plantId]
    );
    return result.insertId;
  }

  static async deleteById(id) {
    const [result] = await pool.execute('DELETE FROM favorites WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async deleteByUserIdAndPlantId(userId, plantId) {
    const [result] = await pool.execute('DELETE FROM favorites WHERE userId = ? AND plantId = ?', [userId, plantId]);
    return result.affectedRows;
  }

  static async getFavoritePlants(userId) {
    const [rows] = await pool.execute(`
      SELECT p.* FROM plants p
      JOIN favorites f ON p.id = f.plantId
      WHERE f.userId = ?
      ORDER BY f.createdAt DESC
    `, [userId]);
    return rows;
  }
}

module.exports = Favorite;