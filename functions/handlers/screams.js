const { db } = require("../util/admin")


//getScreams
exports.getallScreams = (req, res) => {
  db.collection("data")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let dataValues = []
      data.forEach((doc) => {
        dataValues.push({
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: new Date().toISOString(),
        })
      })
      return res.json(dataValues)
    })
    .catch((error) => {
      res.status(500).json({ message: error.message })
    })
}
//post screams
exports.postAllScreams = (req, res) => {
  const newData = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  }
  db.collection("data")
    .add(newData)
    .then((doc) => {
      res.json({ message: `Documnent ${doc.id} created Suucessfully` })
    })
    .catch((error) => {
      return res.status(500).json({ error: error.message })
    })
}
