const request = require('request');
const config = require('./config');

var crimeByTeam = (team, callback) => {

  var teamURLComponent = encodeURIComponent(team);

  request({url: config.crimeAPIURI+ `/team/topCrimes/${teamURLComponent}` ,
  json: true},
  (error, response, body) => {
    if(error){
      callback('Unable to connect to NFL crime data servers.');
    }
    else if (body.length === 0) {
      callback('Unable to find that information in the database.');
    }
    else{
      callback(undefined, {
        data: body
      });
    }
  });
};

var topPlayers = (startDate, endDate, callback) => {

  var startURLComponent = encodeURIComponent(startDate);
  var endURLComponent = encodeURIComponent(endDate);

  if(endURLComponent === 'undefined' | !endURLComponent){
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    endURLComponent = encodeURIComponent(year + '-' + month + '-' + day)
  }

  request({url: config.crimeAPIURI+ `/player?start_date=${startURLComponent}&end_date=${endURLComponent}` ,
  json: true},
  (error, response, body) => {
    if(error){
      callback('Unable to connect to NFL crime data servers.');
    }
    else if (body.length === 0) {
      callback('Unable to find that information in the database.');
    }
    else{
      callback(undefined, {
        data: body
      });
    }
  });
};

var crimeByPosition = (position, callback) => {

  var positionURLComponent = encodeURIComponent(position);

  request({url: config.crimeAPIURI+ `/position/arrests/${positionURLComponent}` ,
  json: true},
  (error, response, body) => {
    if(error){
      callback('Unable to connect to NFL crime data servers.');
    }
    else if (body.length === 0) {
      callback('Unable to find that information in the database.');
    }
    else{
      callback(undefined, {
        data: body
      });
    }
  });
};

module.exports.crimeByTeam = crimeByTeam;
module.exports.topPlayers = topPlayers;
module.exports.crimeByPosition = crimeByPosition;
