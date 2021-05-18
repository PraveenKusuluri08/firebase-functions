const functions = require("firebase-functions")

const app = require("express")()

const { logIn } = require("./handlers/users")

const {getallScreams,postAllScreams} = require("./handlers/screams")

//getData and postData route

app.get("/getData",getallScreams)

app.post("/postData",postAllScreams)

//logIn route
app.post("/logInData", logIn)


exports.api = functions.https.onRequest(app)
