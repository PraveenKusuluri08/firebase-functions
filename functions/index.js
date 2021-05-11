const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const express = require("express")
const app = express()

app.get("/dataFb", (req, res) => {
  admin
    .firestore()
    .collection("data")
    .orderBy("createdAt", "desc")
    .get()  
    .then((data) => {
      let value = []
      data.forEach((doc) => {
        value.push({
          autherId: doc.data().autherId,
          autherFirstName: doc.data().autherFirstName,
          autherLastName: doc.data().autherLastName,
          createdAt:new Date().toISOString(),
        })
      })
      return res.json(value)
    })
    .catch((error) => {
      res.status(500).json({ error: `Something ${error} went wrong` })
    })
})
app.post("/dataFb", (req, res) => {
  const dataFields = {
    autherFirstName: req.body.autherFirstName,
    autherLastName: req.body.autherLastName,
    autherId: req.body.autherId,
    createdAt: new Date().toISOString(),
  }
  admin
    .firestore()
    .collection("data")
    .add(dataFields)
    .then((doc) => {
      res.json({ message: `Document ${doc.id} is created successfully` })
    })
    .catch((error) => {
      res.status(500).json({ error: `Document is failed to create` })
    })
})

//https://baseurl.com/api/

exports.api = functions.https.onRequest(app)
