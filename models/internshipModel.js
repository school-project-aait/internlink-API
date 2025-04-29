const con = require("../config/db");

const Internship = {
  createInternship: (data) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO internships 
        (title, description, deadline, is_active, status, company_id, category_id, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.title,
        data.description,
        data.deadline,
        data.is_active,
        data.status,
        data.company_id,
        data.category_id,
        data.created_by
      ];
      con.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getAllInternships: () => {
    return new Promise((resolve, reject) => {
      con.query("SELECT * FROM internships", (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  getInternshipById: (id) => {
    return new Promise((resolve, reject) => {
      con.query("SELECT * FROM internships WHERE internship_id = ?", [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });
  },

  updateInternship: (id, data) => {
    return new Promise((resolve, reject) => {
      const sql = `
        UPDATE internships 
        SET title = ?, description = ?, deadline = ?, is_active = ?, status = ?, company_id = ?, category_id = ?, created_by = ?
        WHERE internship_id = ?
      `;
      const values = [
        data.title,
        data.description,
        data.deadline,
        data.is_active,
        data.status,
        data.company_id,
        data.category_id,
        data.created_by,
        id
      ];
      con.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  deleteInternship: (id) => {
    return new Promise((resolve, reject) => {
      con.query("DELETE FROM internships WHERE internship_id = ?", [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};

module.exports = Internship;
