const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
const express = require("express");
const app =express();

app.get("/data",(req,res)=>{
  admin
    .firestore()
    .collection("data")
    .get()
    .then((data) => {
      let value = []
      data.forEach((doc) => {
        value.push(doc.data())
      })
      return res.json(value)
    })
    .catch((error) => {
      res.status(500).json({ error: `Something ${error} went wrong` })
    })
})
exports.dataCreate = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: `Bad request` })
  } else {
    const dataFields = {
      autherFirstName: req.body.autherFirstName,
      autherLastName: req.body.autherLastName,
      autherId: req.body.autherId,
      createdAt: admin.firestore.Timestamp.fromDate(new Date()),
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
  }
})

//https://baseurl.com/api/

exports.api = functions.https.onRequest(app)