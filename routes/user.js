var express = require("express");
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const role = require("../helpers/roles");

var router = express.Router();

router.get("/", userController.userList);
router.get("/:id", userController.userDetail);
router.get("/user/:email", userController.userDetailbyEmail);
router.get("/owner/:id", userController.userList);
router.post("/", userController.userStore);
router.delete(
	"/:id",
	auth.protect,
	auth.restrictTo(role.owner, role.admin),
	userController.userDelete,
);
router.put("/:id", userController.userUpdate);

module.exports = router;
