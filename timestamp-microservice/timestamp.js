var app = require("express")

var r = app.Router()

var handleTimestamp = function(req, res){
  let dateString = req.params.date_string
  
  var filterInt = function (value) {
    if(/^([0-9]*)$/.test(value)){
      return Number(value);
    }
    return NaN;
  }
  
  let timestamp = filterInt(dateString)
  let date = null
  
  if (isNaN(timestamp)){
    date = new Date(dateString)
  }else{
    date = new Date(timestamp)
  }
  
  
  if(date == undefined){
    res.json({error: "Invalid Date",})
    return
  }
  
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  })
}

r.get("/:date_string", handleTimestamp)

module.exports = r