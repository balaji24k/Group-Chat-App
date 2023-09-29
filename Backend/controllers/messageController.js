const Message = require("../models/Message");
const User = require("../models/User");
const { Op } = require("sequelize");
const Group = require('../models/Group');

exports.postMessage = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const { groupId } = req.params;
    const { userName, message } = req.body;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const messageResult = await Message.create({
      userName,
      message,
      userId: currentUser.id,
      groupId: groupId,
    });

    res.status(201).json({
      message: "Message created successfully",
      data: messageResult,
    });
  } catch (error) {
    res.status(404).json({ message: "Something Went Wrong!" });
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
            attributes: ['isAdmin']  // This fetches the isAdmin attribute from UserGroup table
          }
        }
      ], 
    });

    if (!groupWithMessages) {
      return res.status(404).json({ message: "Group not found" });
    }

    // const groupMessages = groupWithMessages.dataValues.messages; // .Messages because of the relationship
    // console.log("group chats>>>>>>>>",groupMessages)
    res.status(200).json(groupWithMessages);
  } catch (error) {
    res.status(404).json({ message: "Something Went Wrong!" });
  }
};
