const connectToDatabase = require("../db/conn");
const { default: axios } = require("axios");
var express = require('express');
const { ObjectId } = require("mongodb");
var router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const db = await connectToDatabase();
    const { email = "" } = req.query;
    console.log(req)
    let collection = await db.collection("tasks");

    let todos = await collection.find({email , status :"todo"}).toArray();
    let inProgress = await collection.find({email , status :"inprogress"}).toArray();
    let done = await collection.find({email , status :"done"}).toArray();
    // let result = await collection.find({}).toArray();
    let response ={
      todos,
      inProgress,
      done
    }
    res.send(response).status(204);
  } catch (e) {
    console.log(e);
  }
});

router.post('/add', async function(req, res, next) {
    const db = await connectToDatabase()
    let collection = await db.collection("tasks");
    let newDocument = req.body;
    newDocument.date = new Date();
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
})

router.post('/update', async function(req, res, next) {
  const db = await connectToDatabase()
  let collection = await db.collection("tasks");
  let newDocument = req.body;
  newDocument.updatedAt = new Date()
  console.log(newDocument)
  let result = await collection.findOneAndUpdate({_id : new ObjectId( newDocument._id) },{ $set : {
    status : newDocument.status
  }});
  res.send(result).status(204);
})


module.exports = router;