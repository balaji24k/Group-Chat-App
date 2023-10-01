const Message = require("../models/Message");
const User = require("../models/User");
const { Op } = require("sequelize");
const Group = require('../models/Group');

require("dotenv").config();

const AWS = require('aws-sdk');

const uploadtoS3 = (data, fileName) => {
  const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: 'public-read'
  }

  console.log("in upload s3",data, fileName)
  return new Promise((resolve,reject) => {
    s3bucket.upload(params, (err,s3response) => {
      if(err) {
        console.log("something went wrong in uploading", err);
        reject(err);
      }
      else{
        console.log("success", s3response);
        resolve(s3response.Location);
      }
    });
  })
};

exports.saveFile = async (req, res, next) => {
  try {
    console.log("file>>>>>>>>>>",req.params.groupId);
    const file = req.files.file;
    // console.log("fileUrl",file.name)

    const fileUrl = await uploadtoS3(file.data, file.name);
    console.log("fileUrl",fileUrl);

    const messageResult = await Message.create({
      userName: req.body.userName,
      fileUrl,
      fileName: file.name,
      userId: req.user.id,
      groupId: req.params.groupId,
    });

    console.log("message result",messageResult)
    res.status(200).send({message:"success"})
  } catch (error) {
    
  }
}


exports.postMessage = async (user, groupId, messageContent, file) => {
  try {
    // console.log("file postMessage",file);
    const group = await Group.findByPk(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    const messageResult = await Message.create({
      userName: user.name,
      message: messageContent,
      userId: user.userId,
      groupId: groupId,
    });

    return messageResult;

  } catch (error) {
    console.error("Error in postMessage:", error.message);
    throw error; 
  }
};


exports.getMessages = async (req, res, next) => {
  try {
    const query = req.query;
    console.log("query>>>>>>>>>",query)
    const {latestChatId, groupId} = req.query;

    const groupWithMessages = await Group.findByPk(groupId, {
      include: [
        {
          model: Message,
          where: { id: { [Op.gt]: latestChatId } },
          order: [["id", "DESC"]],
          limit: 10,
        },
        {
          model: User,
          where: { id: req.user.id },
          through: {
            attributes: ['isAdmin'] 
          }
        }
      ], 
    });

    console.log(JSON.stringify(groupWithMessages, null, 2));


    if (!groupWithMessages) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(groupWithMessages);
  } catch (error) {
    res.status(404).json({ message: "Something Went Wrong!" });
  }
};
