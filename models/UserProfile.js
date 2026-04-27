const { pool } = require('../config/db');

class UserProfile {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM user_profiles');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM user_profiles WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(profile) {
    const { id, username, bio, avatar, createdWorks, likedWorks, favorites, totalLikes } = profile;
    const [result] = await pool.execute(
      'INSERT INTO user_profiles (id, username, bio, avatar, createdWorks, likedWorks, favorites, totalLikes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, username, bio, avatar, createdWorks || 0, likedWorks || 0, favorites || 0, totalLikes || 0]
    );
    return result.insertId;
  }

  static async update(id, profile) {
    const { username, bio, avatar, createdWorks, likedWorks, favorites, totalLikes } = profile;
    const [result] = await pool.execute(
      'UPDATE user_profiles SET username = ?, bio = ?, avatar = ?, createdWorks = ?, likedWorks = ?, favorites = ?, totalLikes = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [username, bio, avatar, createdWorks, likedWorks, favorites, totalLikes, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM user_profiles WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async incrementCreatedWorks(userId) {
    const [result] = await pool.execute('UPDATE user_profiles SET createdWorks = createdWorks + 1 WHERE id = ?', [userId]);
    return result.affectedRows;
  }

  static async incrementLikedWorks(userId) {
    const [result] = await pool.execute('UPDATE user_profiles SET likedWorks = likedWorks + 1 WHERE id = ?', [userId]);
    return result.affectedRows;
  }

  static async incrementFavorites(userId) {
    const [result] = await pool.execute('UPDATE user_profiles SET favorites = favorites + 1 WHERE id = ?', [userId]);
    return result.affectedRows;
  }

  static async incrementTotalLikes(userId) {
    const [result] = await pool.execute('UPDATE user_profiles SET totalLikes = totalLikes + 1 WHERE id = ?', [userId]);
    return result.affectedRows;
  }
}

module.exports = UserProfile;