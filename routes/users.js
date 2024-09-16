var express = require('express');
const connectToDatabase = require('../db/conn');
const { default: axios } = require('axios');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  
  try{
    const db = await connectToDatabase()

    let collection = await db.collection("users");
    // let newDocument = req.body;
    // newDocument.createdAt = new Date();
    let result =await collection.find({}).toArray();
    console.log({result})
    res.send(result).status(204);
  }catch(e){
    console.log(e);
  }
});

router.post('/login', async function(req, res, next) {
  const db = await connectToDatabase()
  let collection = await db.collection("users");
  let {email="",password=""} = req.body;
  console.log(req.body)
  const resp = await collection.findOne({email ,password});
  console.log(resp)
  if(resp){
    res.json(resp)
  }else{
    res.status(500).json({
      success: false,
      message: "User Not Found",
  });
  }

})

router.post('/logingoogle', async function(req, res, next) {
  const tokenResponse = req.body
  let user = {}
  await axios
  .get("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization:
        tokenResponse.token_type + " " + tokenResponse.access_token,
    },
  })
  .then(async (res) => {
    user = res.data
  })
  .catch((err) => console.log(err));

  console.log(user)
  const db = await connectToDatabase()
  let collection = await db.collection("users");
  console.log(user)
  const resp = await collection.findOne({...user});
  console.log(resp)
  if(resp){
    res.json(resp)
  }else{
    res.status(500).json({
      success: false,
      message: "User Not Found",
  });
  }

})

router.post('/signup',async function(req, res, next) {
  const db = await connectToDatabase()
  let collection = await db.collection("users");
  let newDocument = req.body;
  newDocument.date = new Date();
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
})

router.post('/signupgoogle',async (req,resp,next) => {
  const tokenResponse = req.body
  const user = await axios
  .get("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization:
        tokenResponse.token_type + " " + tokenResponse.access_token,
    },
  })
  .then(async (res) => {
    const result = await storeInDB(res);
    resp.send(result).status(204);
  })
  .catch((err) => console.log(err));
})

const storeInDB = async (res) => {
  const db = await connectToDatabase()
  let collection = await db.collection("users");
  let newDocument =res.data;
  newDocument.date = new Date();
  newDocument.firstName = newDocument.given_name
  newDocument.lastName = newDocument.family_name
  const resp = await collection.find({email : newDocument.email}).toArray();
  if(resp.length != 0){
    return {
      error :"User already present",
      alreadyPresent:true
    }
  }
  let result = await collection.insertOne(newDocument);
  return result;
}

module.exports = router;