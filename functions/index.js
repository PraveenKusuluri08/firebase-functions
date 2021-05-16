const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()

const app = require("express")()

const config = {
  apiKey: "AIzaSyAEbo6HXlNIuojRfhLgEeH7VAmD0HZ0DuE",
  authDomain: "fbfunctions-399d6.firebaseapp.com",
  projectId: "fbfunctions-399d6",
  storageBucket: "fbfunctions-399d6.appspot.com",
  messagingSenderId: "1067254125484",
  appId: "1:1067254125484:web:4aea7414f2e16cebf72009",
}

const firebase = require("firebase")
firebase.initializeApp(config)

const db = admin.firestore()

//get
app.get("/dataFb", (req, res) => {
  db.collection("data")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let value = []
      data.forEach((doc) => {
        value.push({
          autherId: doc.data().autherId,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: new Date().toISOString(),
        })
      })
      return res.json(value)
    })
    .catch((error) => {
      res.status(500).json({ error: `Something ${error} went wrong` })
    })
})

const FBAuth = (req, res, next) => {
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

// //create
app.post("/dataFb", FBAuth, (req, res) => {
  const dataFields = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
  }
  db.collection("data")
    .add(dataFields)
    .then((doc) => {
      res.json({ message: `Document ${doc.id} is created successfully` })
    })
    .catch((error) => {
      res.status(500).json({ error: `Document is failed to create` })
    })
})

const isEmail = (email) => {
  const exp =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (email.match(exp)) return true
  else return false
}

const isEmpty = (string) => {
  if (string.trim() === "") return true
  else return false
}

//signup route
app.post("/signUp", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    conformPassword: req.body.conformPassword,
    handle: req.body.handle,
  }

  //validations
  let errors = {}
  if (isEmpty(newUser.email)) {
    errors.email = "Email should not be empty"
  } else if (!isEmail(newUser.email)) {
    errors.email = "Email must be valid"
  }
  if (isEmpty(newUser.password)) errors.password = "should not be empty"

  if (newUser.password !== newUser.conformPassword)
    errors.conformPassword = "Password must be match"

  if (isEmpty(newUser.handle)) errors.handle = "should not be empty"

  if (Object.keys(errors).length > 0) return res.status(400).json(errors)

  //signup process
  let token, userID
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      // if (doc.exists) {
      //   return res.status(400).json({ handle: `handle Already in use` })
      // } else {
      return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      // }
    })
    .then((data) => {
      userID = data.user.uid
      return data.user.getIdToken()
    })
    //for the users collection in firestore
    .then((idToken) => {
      token = idToken
      const userCredientials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userID,
      }
      return db.doc(`/users/${newUser.handle}`).set(userCredientials)
    })
    .then(() => {
      return res.status(201).json({ token })
    })
    .catch((error) => {
      if (error.code === `auth/email-already-in-use`) {
        return res.status(400).json({ error: "Email already in use" })
      } else {
        return res.status(500).json({ error: error.code })
      }
    })
})

//logIn route
app.post("/signIn", (req, res) => {
  const creds = {
    email: req.body.email,
    password: req.body.password,
  }

  //validations
  let errors = {}
  if (isEmpty(creds.email)) {
    errors.email = "Email Should not be empty"
  }
  if (!isEmail(creds.email)) {
    errors.email = "Email must be valid"
  }

  if (isEmpty(creds.password)) {
    errors.password = "Password Should not be empty"
  }
  if (Object.keys(errors).length > 0) return res.status(400).json(errors)

  firebase
    .auth()
    .signInWithEmailAndPassword(creds.email, creds.password)
    .then((data) => {
      return data.user.getIdToken()
    })
    .then((token) => {
      return res.status(200).json({ token })
    })
    .catch((error) => {
      if (error.code === "auth/wrong-password") {
        return res.status(403).json({ general: "Wrong credentials!!! Try again" })
      } else return res.status(500).json({ error: error.code })
    })
})

exports.api = functions.https.onRequest(app)
