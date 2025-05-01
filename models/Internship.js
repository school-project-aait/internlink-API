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
  getInternshipById: async (id) => {
    try {
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
      const [result] = await con.promise().query(sql, [id]);
      return result[0] || null;
    } catch (err) {
      console.error(`Error fetching internship ${id}:`, err);
      throw err;
    }
  },

  updateInternship: (id, data) => {
    return new Promise((resolve, reject) => {
      // First get the existing internship to preserve category_id
      con.query(
        'SELECT category_id FROM internships WHERE internship_id = ?', 
        [id], 
        async (err, [existingInternship]) => {
          if (err) return reject(err);
          if (!existingInternship) return reject(new Error('Internship not found'));
  
          // Handle company update if company_name is provided
          let companyId = null;
          if (data.company_name) {
            try {
              const [companyResult] = await con.promise().query(
                `INSERT INTO companies (name, category_id) 
                 VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE company_id=LAST_INSERT_ID(company_id)`,
                [data.company_name, existingInternship.category_id] // Use existing category_id
              );
              companyId = companyResult.insertId;
            } catch (error) {
              return reject(error);
            }
          }
  
          // Prepare fields for update
          const fields = [];
          const values = [];
          
          const allowedFields = [
            'title', 'description', 'deadline', 'is_active', 
            'status', 'category_id' // Can still update category if needed
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
          
          const sql = `UPDATE internships SET ${fields.join(', ')} WHERE internship_id = ?`;
          
          con.query(sql, values, (err, result) => {
            if (err) reject(err);
            else resolve(result.affectedRows > 0);
          });
        }
      );
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