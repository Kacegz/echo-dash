const router = require("express").Router();
const userController = require("../controllers/userController");
function verifyToken(req, res, next) {
  const bearerToken = req.headers["authorization"];
  if (typeof bearerToken !== "undefined") {
    const token = bearerToken.split(" ")[1];
    req.token = token;
    next();
  }
}
router.get("/", userController.getUsers);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/user", verifyToken, userController.checkUser);

module.exports = router;
