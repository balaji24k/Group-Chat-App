const Group = require("../models/Group");
const User = require("../models/User");
const UserGroup = require("../models/UserGroup");

exports.createGroup = async (req, res, next) => {
  try {
    const { groupName } = req.body;
    const user = req.user.dataValues;
    const group = await Group.create({ groupName, createdBy: user.name });

    await UserGroup.create({
      userId: user.id,
      groupId: group.id,
      isAdmin: true,
    });

    res.json({ success: true, message: "Group created successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    console.log("getGropus");
    const currentUser = req.user.dataValues;
    const userWithGroups = await User.findByPk(currentUser.id, {
      include: [
        {
          model: Group,
          through: UserGroup,
          attributes: ["groupName", "createdBy"], // specify attributes you want to retrieve for Group
        },
      ],
    });

    if (!userWithGroups) {
      return res.status(404).json({ message: "User not in any groups" });
    }

    const userGroups = userWithGroups.groups;
    res.status(200).json(userGroups);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.addMember = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const mobile = req.body.mobile;

    const userToAdd = await User.findOne({ where: { mobile: mobile } });

    if (!userToAdd) {
      return res.status(400).json({
        success: false,
        message: "User not found with the given mobile number!",
      });
    }

    const isAlreadyMember = await UserGroup.findOne({
      where: { userId: userToAdd.id, groupId: groupId },
    });

    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        message: "User is already a member of the group!",
      });
    }

    await UserGroup.create({
      userId: userToAdd.id,
      groupId: groupId,
      isAdmin: false,
    });

    res.status(200).json({
      success: true,
      message: "User added to the group successfully!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getGroupMembers = async (req, res) => {
  const groupId = req.params.groupId;

  try {
    const groupWithMembers = await Group.findByPk(groupId, {
      include: [
        {
          model: User,
          through: { attributes: ["isAdmin"] },
        },
      ],
    });

    if (!groupWithMembers) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found!" });
    }

    res.status(200).json(groupWithMembers);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.makeMemberAdmin = async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const userIdToMakeAdmin = req.body.userId;
    console.log("make admin controller");

    const isAdmin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to make this change" });
    }

    const userGroupToUpdate = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: userIdToMakeAdmin,
      },
    });

    if (!userGroupToUpdate) {
      return res
        .status(404)
        .json({ message: "User is not a member of the group" });
    }

    userGroupToUpdate.isAdmin = true;
    await userGroupToUpdate.save();

    res
      .status(200)
      .json({ message: "User has been made an admin successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.toString() });
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const groupId = req.body.groupId;
    const userIdToRemove = req.body.userId;

    const isAdmin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: req.user.id,
        isAdmin: true,
      },
    });

    if (!isAdmin) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to remove members from this group",
        });
    }

    const userGroupToDelete = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: userIdToRemove,
      },
    });

    if (!userGroupToDelete) {
      return res
        .status(404)
        .json({ message: "User is not a member of the group" });
    }
    await userGroupToDelete.destroy();
    res
      .status(200)
      .json({ message: "User has been removed from the group successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.toString() });
  }
};
