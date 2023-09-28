const Group = require("../models/Group");
const User = require("../models/User");
const UserGroup = require("../models/UserGroup");

exports.createGroup = async (req, res, next) => {
  try {
    // Assuming you send the current user's ID and the group name from frontend
    const { groupName } = req.body;
    const user = req.user.dataValues;
    console.log("user created group>>>>>>", user);
    // Create the group
    const group = await Group.create({ groupName, createdBy: user.name });

    // Add the user to the group as an admin
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
    console.log("getGropus")
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

    const userGroups = userWithGroups.groups; // `groups` because User.belongsToMany(Group)
    res.status(200).json(userGroups);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
