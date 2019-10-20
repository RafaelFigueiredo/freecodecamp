let express = require("express");
let dns = require("dns");
var mongoose = require("mongoose");

// router
let r = express.Router();

// database
var db = mongoose.connection;

// <-- Database events
db.on("error", function(err) {
  console.log(err);
});
db.once("open", function() {
  console.log("Conectado ao MongoDB.");
  // Vamos adicionar nossos Esquemas, Modelos e consultas aqui
});

// <--- Connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

// URL Schema and model
let URLSchema = mongoose.Schema({
  original_url: { type: String, required: true }
});

let URL = mongoose.model("URL", URLSchema);
const error = { error: "invalid URL" };

r.get("/:url", function(req, res) {
  let url = req.params.url
  URL.findById(url, function(err, data){
    if (err){
      console.log(err)
      res.send(error)
      return
    }
    res.redirect(data.original_url)
  })
});

r.post("/new", function(req, res) {
  const error = { error: "invalid URL" };
  
  //remove https
  const REPLACE_REGEX = /^https?:\/\//i
  const url = req.body.url.replace(REPLACE_REGEX, '');
  
  //validate url
  dns.lookup(url, function(err, address, family) {
    if (err) {
      console.log(err)
      res.send(error);
      return;
    }

    let newURL = new URL({original_url: req.body.url})
    newURL.save(function(err, data){
      if(err){
        console.log(err)
        res.status(500)
        return
      }
      res.send({original_url: data.original_url,
                short_url: data.id})
    })
  });
});

module.exports = r;
