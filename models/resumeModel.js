
const db = require("../config/db");

module.exports = {
  insertResume: (resumeData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO resume (user_id, orginal_filename, file_extension, attachment_path)
        VALUES (?, ?, ?, ?)
      `;
      const values = [
        resumeData.user_id,
        resumeData.orginal_filename,
        resumeData.file_extension,
        resumeData.attachment_path
      ];

      db.query(sql, values, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  }
};
