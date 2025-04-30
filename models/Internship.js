const con = require("../config/db");

const Internship = {
  createInternship: (data) => {
    return new Promise((resolve, reject) => {
      // First, handle the company creation/lookup
      const companySql = `
        INSERT INTO companies (name, category_id) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE company_id=LAST_INSERT_ID(company_id)
      `;
      
      con.query(companySql, [data.company_name, data.category_id], (err, companyResult) => {
        if (err) return reject(err);

        // Then create the internship with the company_id
        const internshipSql = `
          INSERT INTO internships 
          (title, description, deadline, is_active, status, company_id, category_id, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          data.title,
          data.description || '',
          data.deadline,
          data.is_active !== undefined ? data.is_active : true,
          data.status || 'open',
          companyResult.insertId,
          data.category_id,
          data.created_by
        ];

        con.query(internshipSql, values, (err, result) => {
          if (err) reject(err);
          else resolve(result.insertId);
        });
      });
    });
  },

  getAllInternships: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          i.internship_id,
          i.title,
          i.description,
          DATE_FORMAT(i.deadline, '%Y-%m-%d') as deadline,
          i.is_active,
          i.status,
          c.name as company_name,
          cat.category_name,
          u.name as created_by_name,
          DATE_FORMAT(i.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
          DATE_FORMAT(i.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
        FROM internships i
        JOIN companies c ON i.company_id = c.company_id
        JOIN categories cat ON i.category_id = cat.category_id
        JOIN users u ON i.created_by = u.id
        ORDER BY i.created_at DESC
      `;
      con.query(sql, (err, results) => {
        if (err) {
          console.error('Error fetching all internships:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  getInternshipById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          i.internship_id,
          i.title,
          i.description,
          DATE_FORMAT(i.deadline, '%Y-%m-%d') as deadline,
          i.is_active,
          i.status,
          c.name as company_name,
          cat.category_name,
          u.name as created_by_name,
          i.company_id,
          i.category_id,
          i.created_by,
          DATE_FORMAT(i.created_at, '%Y-%m-%d %H:%i:%s') as created_at,
          DATE_FORMAT(i.updated_at, '%Y-%m-%d %H:%i:%s') as updated_at
        FROM internships i
        JOIN companies c ON i.company_id = c.company_id
        JOIN categories cat ON i.category_id = cat.category_id
        JOIN users u ON i.created_by = u.id
        WHERE i.internship_id = ?
      `;
      con.query(sql, [id], (err, result) => {
        if (err) {
          console.error(`Error fetching internship ${id}:`, err);
          reject(err);
        } else {
          resolve(result[0] || null);
        }
      });
    });
  },

  updateInternship: (id, data) => {
    return new Promise((resolve, reject) => {
      // Handle company update if company_name is provided
      const handleCompany = (callback) => {
        if (!data.company_name) return callback(null, null);
        
        const companySql = `
          INSERT INTO companies (name, category_id) 
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE company_id=LAST_INSERT_ID(company_id)
        `;
        con.query(companySql, [data.company_name, data.category_id], (err, result) => {
          if (err) return callback(err);
          callback(null, result.insertId);
        });
      };

      handleCompany((err, companyId) => {
        if (err) return reject(err);

        // Prepare fields for update
        const fields = [];
        const values = [];
        
        const allowedFields = [
          'title', 'description', 'deadline', 'is_active', 
          'status', 'category_id'
        ];
        
        allowedFields.forEach(field => {
          if (data[field] !== undefined) {
            fields.push(`${field} = ?`);
            values.push(data[field]);
          }
        });

        // Add company_id if we have it
        if (companyId !== null) {
          fields.push('company_id = ?');
          values.push(companyId);
        }
        
        if (fields.length === 0) {
          return reject(new Error('No valid fields provided for update'));
        }
        
        values.push(id);
        
        const sql = `
          UPDATE internships 
          SET ${fields.join(', ')}
          WHERE internship_id = ?
        `;
        
        con.query(sql, values, (err, result) => {
          if (err) reject(err);
          else resolve(result.affectedRows > 0);
        });
      });
    });
  },

  deleteInternship: (id) => {
    return new Promise((resolve, reject) => {
      con.query("DELETE FROM internships WHERE internship_id = ?", [id], (err, result) => {
        if (err) reject(err);
        else resolve(result.affectedRows > 0);
      });
    });
  }
};

module.exports = Internship;