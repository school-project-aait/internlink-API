const db = require("../config/db");

module.exports = {
  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM users WHERE email = ?", [email], 
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        });
    });
  },

  createUser: (userData) => {
    return new Promise((resolve, reject) => {
      db.query("INSERT INTO users SET ?", userData, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  },

  updateUser: (id, userData) => {
    return new Promise((resolve, reject) => {
      db.query("UPDATE users SET ? WHERE id = ?", [userData, id], 
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        });
    });
  },

  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }
};