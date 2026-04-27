const { pool } = require('../config/db');

class Plant {
  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM plants ORDER BY name');
    return rows;
  }

  static async getById(id) {
    const [rows] = await pool.execute('SELECT * FROM plants WHERE id = ?', [id]);
    return rows[0];
  }

  static async getByCategory(category) {
    if (category === 'all') {
      return this.getAll();
    }
    const [rows] = await pool.execute('SELECT * FROM plants WHERE category = ? ORDER BY name', [category]);
    return rows;
  }

  static async search(keyword) {
    const [rows] = await pool.execute(
      'SELECT * FROM plants WHERE name LIKE ? OR family LIKE ? OR category LIKE ? OR description LIKE ? ORDER BY name',
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );
    return rows;
  }

  static async create(plant) {
    const { id, name, category, family, description, image, careLevel, waterFrequency, lightRequirements, soilType, growthSize, bloomingSeason, toxicity, propagation, benefits } = plant;
    const [result] = await pool.execute(
      'INSERT INTO plants (id, name, category, family, description, image, careLevel, waterFrequency, lightRequirements, soilType, growthSize, bloomingSeason, toxicity, propagation, benefits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, category, family, description, image, careLevel, waterFrequency, lightRequirements, soilType, growthSize, bloomingSeason, toxicity, propagation, benefits]
    );
    return result.insertId;
  }

  static async update(id, plant) {
    const { name, category, family, description, image, careLevel, waterFrequency, lightRequirements, soilType, growthSize, bloomingSeason, toxicity, propagation, benefits } = plant;
    const [result] = await pool.execute(
      'UPDATE plants SET name = ?, category = ?, family = ?, description = ?, image = ?, careLevel = ?, waterFrequency = ?, lightRequirements = ?, soilType = ?, growthSize = ?, bloomingSeason = ?, toxicity = ?, propagation = ?, benefits = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [name, category, family, description, image, careLevel, waterFrequency, lightRequirements, soilType, growthSize, bloomingSeason, toxicity, propagation, benefits, id]
    );
    return result.affectedRows;
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM plants WHERE id = ?', [id]);
    return result.affectedRows;
  }

  static async getCategories() {
    const [rows] = await pool.execute('SELECT DISTINCT category FROM plants ORDER BY category');
    return rows.map(row => row.category);
  }
}

module.exports = Plant;