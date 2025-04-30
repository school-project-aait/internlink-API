const db = require('../config/db');

class Category {
  static async getAllCategories() {
    const [rows] = await db.promise().query('SELECT * FROM categories');
    return rows;
  }

  static async getCategoryById(id) {
    const [rows] = await db.promise().query('SELECT * FROM categories WHERE category_id = ?', [id]);
    return rows[0];
  }
}

module.exports = Category;