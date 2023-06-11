var sid = "AC4c2fdf899f01572dd080b7b25d863d1c";
var auth_token = "b8e85e11265835bf1542845aae355023";

var twilio = require("twilio")(sid, auth_token);

twilio.messages
  .create({
    from: "+12542764206",
    to: "+918593053613",
    body: "this is a testing message",
  })
  .then(function(res) {console.log("message has sent!")})
  .catch(function(err)  {
    console.log(err);
  });