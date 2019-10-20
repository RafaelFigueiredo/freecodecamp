var express = require("express")

var r = express.Router()


r.get("/", function(req, res){
  res.json({
    ipaddress: req.ip, 
    language: req.header('accept-language'),
    software: req.header('user-agent')})
})



module.exports = r