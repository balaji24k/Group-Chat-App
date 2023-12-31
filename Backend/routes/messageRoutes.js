const expense = require("express");
const router = expense.Router();

const messageController = require("../controllers/messageController");

const auth = require('../middlewares/auth');

router.post("/:groupId",auth.authenticate, messageController.saveFile);

router.get("/",auth.authenticate, messageController.getMessages);


module.exports = router;