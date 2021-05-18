const {admin}= require("./admin")

module.exports= (req, res, next) => {
  let idToken
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    idToken = req.headers.authorization.split("Bearer ")[1]
  } else {
    console.error(error)
    return status(403).json({ error: "Unauthorised" })
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      console.log(decodedToken)
     req.user={handle:decodedToken.uid}
      // return db.collection("users").where("userId", "==", decodedToken.uid ).limit(1).get()  
      return next()
    })
    .catch((error) => {
      console.error(error)
      return res.status(403).json(error)
    })
}