const expense = require("express");
const router = expense.Router();

const messageController = require("../controllers/messageController");

const auth = require('../middlewares/auth');

router.post("/",auth.authenticate, messageController.postMessage);

module.exports = router;