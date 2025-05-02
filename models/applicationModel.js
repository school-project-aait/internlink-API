const db = require("../config/db");

module.exports = {
  createApplication: (applicationData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO applications 
        (user_id, internship_id, university, degree, graduation_year, linkdIn, resume_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        applicationData.user_id,
        applicationData.internship_id,
        applicationData.university,
        applicationData.degree,
        applicationData.graduation_year,
        applicationData.linkdIn,
        applicationData.resume_id
      ];
      
      db.query(sql, values, (err, result) => {
        if (err) reject(err);
        resolve(result.insertId);
      });
    });
  },

  getApplicationsByUser: (userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          a.*, 
          i.title AS internship_title,
          i.company_name,
          i.requirements,
          i.deadline
        FROM applications a
        JOIN internships i ON a.internship_id = i.internship_id
        WHERE a.user_id = ?
        ORDER BY a.applied_at DESC
      `;
      db.query(sql, [userId], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },
  

  updateApplication: (applicationId, userId, updates) => {
    return new Promise((resolve, reject) => {
      // First, fetch the internship deadline for this application
      const deadlineCheckSql = `
        SELECT i.deadline 
        FROM applications a
        JOIN internships i ON a.internship_id = i.internship_id
        WHERE a.application_id = ? AND a.user_id = ?
      `;
  
      db.query(deadlineCheckSql, [applicationId, userId], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(false); // Application not found or unauthorized
  
        const deadline = new Date(results[0].deadline);
        const currentDate = new Date();
  
        // Check if deadline has passed
        if (currentDate > deadline) {
          return reject(new Error("Cannot update application after the internship deadline."));
        }
  
        // Proceed with update if deadline is valid
        const allowedFields = ['university', 'degree', 'graduation_year', 'linkdIn', 'resume_id'];
        const validUpdates = {};
        
        Object.keys(updates).forEach(key => {
          if (allowedFields.includes(key)) {
            validUpdates[key] = updates[key];
          }
        });
  
        if (Object.keys(validUpdates).length === 0) {
          return reject(new Error("No valid fields to update"));
        }
  
        const updateSql = `
          UPDATE applications 
          SET ?
          WHERE application_id = ? AND user_id = ?
        `;
        
        db.query(updateSql, [validUpdates, applicationId, userId], (err, result) => {
          if (err) reject(err);
          resolve(result.affectedRows > 0);
        });
      });
    });
  }, 

  deleteApplication: (applicationId, userId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM applications 
        WHERE application_id = ? AND user_id = ?
      `;
      db.query(sql, [applicationId, userId], (err, result) => {
        if (err) reject(err);
        resolve(result.affectedRows > 0);
      });
    });
  },

  checkExistingApplication: (userId, internshipId) => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT application_id 
        FROM applications 
        WHERE user_id = ? AND internship_id = ?
      `;
      db.query(sql, [userId, internshipId], (err, results) => {
        if (err) reject(err);
        resolve(results.length > 0);
      });
    });
  }
};