var express = require("express");
const userController = require("../controllers/userController");

var router = express.Router();

router.get("/", userController.userList);
router.get("/:id", userController.userDetail);
router.get("/user/:email", userController.userDetailbyEmail);
router.get("/owner/:id", userController.userList);
router.post("/", userController.userStore);
router.delete("/:id", userController.userDelete);
router.put("/:id", userController.userUpdate);

module.exports = router;
