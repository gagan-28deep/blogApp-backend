function protectRoute(req, res, next) {
  try {
    const cookies = req.cookies;
    const JWT = cookies.JWT;
    if (cookies.JWT) {
      console.log("protect Route Encountered");
      // you are logged In then it will
      // allow next fn to run
      let token = jwt.verify(JWT, secrets.JWTSECRET);
      console.log("Jwt decrypted", token);
      let userId = token.data;
      console.log("userId", userId);
      req.userId = userId;

      next();
    } else {
      res.send("You are not logged In Kindly Login");
    }
  } catch (err) {
    console.log(err);
    if (err.message == "invalid signature") {
      res.send("Token invalid kindly login");
    } else {
      res.send(err.message);
    }
  }
}
module.exports = protectRoute;
