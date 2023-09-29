const expense = require("express");
const router = expense.Router();

const groupController = require("../controllers/groupController");

const auth = require('../middlewares/auth');

router.post("/",auth.authenticate, groupController.createGroup);

router.get("/",auth.authenticate, groupController.getGroups);

router.get("/getGroupMembers/:groupId",auth.authenticate, groupController.getGroupMembers);

router.post("/addMember/:groupId",auth.authenticate, groupController.addMember);

router.post("/makeAdmin",auth.authenticate, groupController.makeMemberAdmin);

router.post("/removeMember",auth.authenticate, groupController.removeMember);


module.exports = router;