const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

exports.signup = async (req, res) => {
    try {
      //  Destructure the needed fields from req.body
      const { 
        password, 
        confirmPassword,
        ...restUserData // This will contain all other fields except password/confirmPassword
      } = req.body;
  
      // Check for existing user
      const existingUser = await userModel.findUserByEmail(restUserData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash the password from the request body
      const hashedPassword = await bcrypt.hash(password, 10);
  
      //  Create user data with hashed password
      const userData = {
        ...restUserData,
        password_hash: hashedPassword // Use the correct column name here
      };
  
      //  Create the user in database
      await userModel.createUser(userData);
      
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  exports.login = async (req, res) => {
    try {
      const user = await userModel.findUserByEmail(req.body.email);
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
  
      const validPassword = await bcrypt.compare(req.body.password, user.password_hash);
      if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });
  
      // Update last login
      await userModel.updateUser(user.id, { last_login: new Date() });
  
      const { password_hash, ...safeUser } = user;
      res.json({
        message: "Login successful",
        user: safeUser
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  