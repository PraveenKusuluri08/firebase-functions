const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.add =functions.https.onRequest((req,res)=>{
//   console.log("ARRAY SAMPLE")
//   var array=[1,4,54,21,41,14];
//   console.log(array);
//   var array1= array.filter(v =>v>=10)
//   res.send(array1)
// })
exports.hello=functions.https.onRequest((req,res)=>{
  console.log("Hello")
  res.send("Hello")
})
