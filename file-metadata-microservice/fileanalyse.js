const express = require("express")
const multer = require("multer")


const r = express.Router()

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


r.post('/', upload.single('upfile'), function (req, res) {
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  })
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})



module.exports = r