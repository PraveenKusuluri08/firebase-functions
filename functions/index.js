const functions = require("firebase-functions")

const app = require("express")()

const { logIn,signUp } = require("./handlers/users")

//middleware 
const {FBAuth}=require("./util/FBAuth")
const {getallScreams,postAllScreams} = require("./handlers/screams")

//getData and postData route

app.get("/getData",getallScreams)

app.post("/postData",FBAuth,postAllScreams)

//logIn route
app.post("/logInData", logIn)
//signup route
app.post("/signupData",signUp)

exports.api = functions.https.onRequest(app)
