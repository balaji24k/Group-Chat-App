const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

const generateAccessToken = (id,name) => {
  return jwt.sign({userId: id, name : name}, process.env.JWT_AUTH_KEY);
}

exports.login = async(req, res, next) => {
  console.log("login>>>>>",req.body)
  const { email, password } = req.body;
  try {
    if (isValidString(email) || isValidString(password)){
      return res.json({success:false, error: "invaild inputs, please enter valid details"});
    }
    const user = await User.findOne({ where: { email } });
    console.log("ext user login>>>>>>", user)
    if(!user) {
      return res.status(404).json({success:false, error: "user does not exist, create account"})
    }
    const userData = user.dataValues;
    const hashPassword = userData.password;
    bcrypt.compare(password, hashPassword, (err, result) => {
      if(err) {
        return res.status(400).json({success:false, error: "something went wrong!"})
      }
      if (result) {
        return res.status(200).json({ 
          success: true, 
          message: "Loggedin Succesfully!", 
          name : userData.name,
          token: generateAccessToken(userData.id,userData.name)});
      }
      else {
        return res.status(400).json({success:false, error: "incorrect password!"})
      }
    }) 
  }
  catch(err) {
    res.status(400).json({error:err.message});
  }
};


