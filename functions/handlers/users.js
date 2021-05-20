const { config } = require("../util/config")
const { db, admin } = require("../util/admin")

const firebase = require("firebase")

firebase.initializeApp(config)

const { validateSignUpData, validationsLoginData } = require("../util/validations")
exports.signUp = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    conformPassword: req.body.conformPassword,
    handle: req.body.handle,
  }

  const { valid, errors } = validateSignUpData(newUser)

  if (!valid) return res.status(400).json(errors)

  //signup process
  let token, userID
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: `handle Already in use` })
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then((data) => {
      console.log(data)
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
}

exports.logIn = (req, res) => {
  const creds = {
    email: req.body.email,
    password: req.body.password,
  }

  const { valid, errors } = validationsLoginData(creds)

  if (!valid) return res.status(400).json(errors)

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
      } else return res.status(500).json(error)
    })
}

exports.uploadImage = (req, res) => {
  const Busboy = require("busboy")
  const path = require("path")
  const os = require("os")
  const fs = require("fs")

  const busboy = new Busboy({ headers: req.headers })

  let imageFileName
  let imageToBeUploaded = {}
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname)
    console.log(filename)
    console.log(mimetype)

    const imageExtension = filename.split(".")[filename.split(".").length - 1]
    const imageFileName = `${Math.round(Math.random() * 100000000)}.${imageExtension}`
    const filepath = path.join(os.tempdir(), imageFileName)
    imageToBeUploaded = { filepath, mimetype }
    file.pipe(fs.createWriteStream(filepath))
  })
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded, filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(()=>{
        const imageUrl =`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/0${imageFileName}?alt=media`
        
      })
  })
}
