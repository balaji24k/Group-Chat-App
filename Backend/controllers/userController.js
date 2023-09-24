const User = require("../models/User");
const bcrypt = require("bcrypt");

require("dotenv").config();

const isValidString = (string) => {
  if (string == null || string.length === 0) {
    return true;
  } else {
    return false;
  }
};

exports.signup = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    if (isValidString(name) || isValidString(email) || isValidString(mobile) || isValidString(password)){
      return res.status(400).json({success:false, error: "invaild inputs, please enter valid details" });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ where: { email: email } });
		console.log("exs email user",existingUser);
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already exists" });
    }
    // If email doesn't exist, create a new user
    const saltRounds = +process.env.BCRYPT_SALTROUNDS;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if(err) {
        return res.status(500).json({ success: false, error: "Hashing error" });
      }
      User.create({name, email, mobile, password: hash});
      res.status(200).json({ success: true, message: "Account Created Succesfully, please login"});
    })

  } catch (error) {
    res.status(400).json({ success: false, error: "Server error" });
  }
};


