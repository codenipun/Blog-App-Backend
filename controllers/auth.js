import { db } from "../db.js";
import bcrypt from "bcryptjs";

export const register = (req, res) => {
  // check existing user (registered phone number, email)
  // check for unique username
  // store password in hash

  const q = `SELECT * FROM users WHERE email=? OR username=?`;

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.json(err);

    if (data.length) return res.status(409).json("user already exist !");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(q, [values], (err, data) => {
      if (err) return res.json(err);

      return res.status(200).json("User has been created");
    });
  });
};

export const login = (req, res) => {
    // Check user exist or not

    const q = "SELECT * FROM users WHERE username=?";

    db.query(q, [req.body.username], (err, data)=>{
        if(err) res.json(err);
        if(data.length===0) res.status(404).json("User not Found !!");

        //Check Password
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);

        if(!isPasswordCorrect) return res.status(400).json("Invalid Username or Password");

        
    })

};

export const logout = (req, res) => {};

export const getAllUser = (req, res) => {
    const q = "SELECT * FROM users";

    db.query(q, (err, data) => {
        if (err) {
            console.error("Error retrieving users:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        // Assuming data is an array of user objects retrieved from the database
        res.json(data);
    });
};