const expense = require("express");
const router = expense.Router();

const groupController = require("../controllers/groupController");

const auth = require('../middlewares/auth');

router.post("/",auth.authenticate, groupController.createGroup);

router.get("/",auth.authenticate, groupController.getGroups);


module.exports = router;