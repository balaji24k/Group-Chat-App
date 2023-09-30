const Message = require("../models/Message");
const User = require("../models/User");
const { Op } = require("sequelize");
const Group = require('../models/Group');

exports.postMessage = async (user, groupId, messageContent) => {
  try {
    console.log("user mess",user)
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

    if (!groupWithMessages) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(groupWithMessages);
  } catch (error) {
    res.status(404).json({ message: "Something Went Wrong!" });
  }
};
