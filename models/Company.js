const db = require('../config/db');

class Company {
  static async getAllCompanies() {
    const [rows] = await db.promise().query('SELECT * FROM companies');
    return rows;
  }

  static async getCompaniesByCategory(categoryId) {
    const [rows] = await db.promise().query('SELECT * FROM companies WHERE category_id = ?', [categoryId]);
    return rows;
  }

  static async getCompanyById(id) {
    const [rows] = await db.promise().query('SELECT * FROM companies WHERE company_id = ?', [id]);
    return rows[0];
  }
}

module.exports = Company;