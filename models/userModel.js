const db = require("../config/db");

module.exports = {
  // fetch the user for profile
  findUserById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT id, email, name, birth_date, role FROM users WHERE id = ?",
        [id],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  findUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
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
      db.query(
        "UPDATE users SET ? WHERE id = ?",
        [userData, id],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  },
  deleteUser: (id) => {
    return new Promise((resolve, reject) => {
      console.log("Deleting user with ID:", id);

      // Ensure id is treated as a number
      // const userId = parseInt(id, 10);

      // Simple query without backticks
      db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
        if (err) {
          console.error("SQL Error:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  // deleteUser: (id) => {
  //   return new Promise((resolve, reject) => {
  //     console.log("Deleting user with ID:", id);
  //     db.query("DELETE FROM `users` WHERE id = ?", [id], (err, results) => {
  //       if (err) reject(err);
  //       resolve(results);
  //     });
  //   });
  // }
};
