const con = require("../config/db");

const Application = {
  // Create a new application
  createApplication: (data) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO applications
        (user_id, internship_id, university, degree, graduation_year, linkdIn, resume_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        data.user_id,
        data.internship_id,
        data.university,
        data.degree,
        data.graduation_year,
        data.linkdIn,
        data.resume_id,
      ];

      con.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  // Get all applications for a user
  getApplicationsByUser: (user_id) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT a.*, i.title AS internship_title, c.name AS company_name
        FROM applications a
        JOIN internships i ON a.internship_id = i.internship_id
        JOIN companies c ON i.company_id = c.company_id
        WHERE a.user_id = ?
        ORDER BY a.applied_at DESC
      `;
      con.query(sql, [user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Find a specific application by ID
  findApplicationById: (applicationId) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM applications WHERE application_id = ?`;
      con.query(sql, [applicationId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },
  getInternshipById: (internship_id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM internships WHERE internship_id = ?`;
      con.query(sql, [internship_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  // Update any fields of an application
  updateApplication: (applicationId, updateFields) => {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updateFields)
        .map((field) => `${field} = ?`)
        .join(", ");
      const values = Object.values(updateFields);

      const sql = `UPDATE applications SET ${fields} WHERE application_id = ?`;
      con.query(sql, [...values, applicationId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Change application status (admin use)
  updateStatus: (applicationId, status) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE applications SET status = ? WHERE application_id = ?`;
      con.query(sql, [status, applicationId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Delete (withdraw) an application
  deleteApplication: (applicationId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM applications WHERE application_id = ? AND user_id = ?`;
      con.query(sql, [applicationId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
};

module.exports = Application;
