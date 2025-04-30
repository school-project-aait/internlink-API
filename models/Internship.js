const db = require('../config/db');

class Internship {
  static async createInternship(internshipData) {
    const { title, description, deadline, company_id, category_id, created_by } = internshipData;
    const [result] = await db.promise().query(
      'INSERT INTO internships (title, description, deadline, company_id, category_id, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, deadline, company_id, category_id, created_by]
    );
    return result.insertId;
  }

  static async getAllInternships() {
    const [rows] = await db.promise().query(`
      SELECT i.*, c.name as company_name, cat.category_name 
      FROM internships i
      JOIN companies c ON i.company_id = c.company_id
      JOIN categories cat ON i.category_id = cat.category_id
    `);
    return rows;
  }

  static async getInternshipById(id) {
    const [rows] = await db.promise().query(`
      SELECT i.*, c.name as company_name, cat.category_name 
      FROM internships i
      JOIN companies c ON i.company_id = c.company_id
      JOIN categories cat ON i.category_id = cat.category_id
      WHERE i.internship_id = ?
    `, [id]);
    return rows[0];
  }
  static async updateInternship(id, updateData) {
    const validFields = ['title', 'description', 'deadline', 'company_id', 'category_id', 'is_active', 'status'];
    const fieldsToUpdate = {};
    
    // Filter only valid fields
    Object.keys(updateData).forEach(key => {
      if (validFields.includes(key)) {
        fieldsToUpdate[key] = updateData[key];
      }
    });
  
    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error('No valid fields provided for update');
    }
  
    const setClause = Object.keys(fieldsToUpdate)
      .map(key => `${key} = ?`)
      .join(', ');
  
    const values = Object.values(fieldsToUpdate);
    values.push(id);
  
    const [result] = await db.promise().query(
      `UPDATE internships SET ${setClause} WHERE internship_id = ?`,
      values
    );
  
    return result.affectedRows > 0;
  }
  static async deleteInternship(id) {
    const [result] = await db.promise().query(
      'DELETE FROM internships WHERE internship_id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Internship;