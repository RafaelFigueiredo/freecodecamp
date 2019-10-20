var app = require("express")

var r = app.Router()

var handleTimestamp = function(req, res){
  let dateString = req.params.date_string
  
  if (dateString =="" || dateString == undefined){
    let date = new Date()
    res.json({unix: date.getTime(),
              utc: date.toUTCString(),
            })
  }
  
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
  
  
  if(isNaN(date.getTime())){
    res.json({error: "Invalid Date",})
    return
  }
  
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  })
}

r.get("/:date_string?", handleTimestamp)

module.exports = r