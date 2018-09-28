const config = require('./config.js');
const nflCrimeAPI = require('./nflCrimeAPI.js');
const verifySig = require('./verifySig.js');
const express = require('express');
const bodyParser = require('body-parser');

var app = express();
const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));
app.use(express.static(__dirname + '/public'));

app.listen(config.ServerPort, () => {
  console.log("Server running on port " + config.ServerPort);
});

app.post('/commands', (req,res) => {
  //request not coming from Slack
  if(!verifySig.validate(req)) {
    res.sendStatus(404);
    return;
  }

  var command = req.body.command;
  var message = {};

  //slack command /teamcrime
  if(command == '/teamcrime'){
    var team = req.body.text;
    if(team){
      let validTeam = /^[a-z]*$/.test(team);
      if(!validTeam){
        res.send("Not a valid team. Please enter a lowercase city abbreviated, like 'sea' or 'kc'.");
        return;
      }
      nflCrimeAPI.crimeByTeam(team, (errorMessage, results) => {
        if(errorMessage){
          message = {
            "response_type": "ephemeral", // private message
            "text": errorMessage
          };
        }
        else{
          message = {
            "response_type": "in_channel", // public to the channel
            "text": "Crime results: " + JSON.stringify(results.data)
          };
        }
        res.json(message);
      });
    }
    else{
      message = {
        "response_type": "ephemeral", // private message
        "text": "Please enter the team's city as a string, lowercase and abbreviated. For example, you would input 'sea' for the Seahawks."
      };
      res.json(message);
    }
  }
  //slack command /topplayerscrime
  else if(command == '/topplayerscrime'){
    const [startDate, endDate] = (req.body.text).split(' ');
    if(startDate){
      let validStartDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(startDate);
      let validEndDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/.test(endDate);
      if(!validStartDate){
        res.send("Not a valid start date. Please enter a value like 'YYYY-MM-DD'");
        return;
      }
      if(endDate & !validEndDate){
        res.send("Not a valid end date. Please enter a value like 'YYYY-MM-DD'");
        return;
      }
      nflCrimeAPI.topPlayers(startDate, endDate, (errorMessage, results) => {
        if(errorMessage){
          message = {
            "response_type": "ephemeral", // private message
            "text": errorMessage
          };
        }
        else{
          message = {
            "response_type": "in_channel", // public to the channel
            "text": "Crime results: " + JSON.stringify(results.data)
          };
        }
        res.json(message);
      });
    }
    else{
      message = {
        "response_type": "ephemeral", // private message
        "text": "Please enter the start and end date like 'YYYY-MM-DD', for example: '2018-01-01'."
      };
      res.json(message);
    }
  }
  //slack command /positioncrime
  else if(command == '/positioncrime'){
    var position = req.body.text;
    if(position){
      let validPosition = /^[a-z]*$/.test(position);
      if(!validPosition){
        res.send("Not a valid position. Please enter a lowercase position abbreviated, like 'rb' or 'wr'.");
        return;
      }
      nflCrimeAPI.crimeByPosition(position, (errorMessage, results) => {
        if(errorMessage){
          message = {
            "response_type": "ephemeral", // private message
            "text": errorMessage
          };
        }
        else{
          message = {
            "response_type": "in_channel", // public to the channel
            "text": "Crime results: " + JSON.stringify(results.data)
          };
        }
        res.json(message);
      });
    }
    else{
      message = {
        "response_type": "ephemeral", // private message
        "text": "Please enter an abbreviated position, for example: 'qb' or 'lb'."
      };
      res.json(message);
    }
  }
  else{
    res.sendStatus(404);
    return;
  }

});
