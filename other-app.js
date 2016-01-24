var fs = require('fs'),
    __ = require('lodash'),
    synaptic = require('synaptic'),
    Converter = require('csvtojson').Converter;

var converter = new Converter({}), MVPs = [{ Player: 'Stephen Curry', Age: 26 },
                                           { Player: "Kevin Durant", Age: 25 },
                                           { Player: 'LeBron James', Age: 28 },
                                           { Player: "LeBron James", Age: 27 },
                                           { Player: "Derrick Rose", Age: 22 },
                                           { Player: "LeBron James", Age: 25 },
                                           { Player: "LeBron James", Age: 24 },
                                           { Player: "Kobe Bryant", Age: 29 },
                                           { Player: "Dirk Nowitzki", Age: 28 },
                                           { Player: "Steve Nash", Age: 31 }];

var playerAr = [], rawAr = [];
var ignoredStats = ['Rk', 'Player', 'Pos', 'Age', 'Tm', 'MVP', '2P','2PA','2P'];

converter.on('end_parsed', function(JSONarray){
  rawAr = cleanArray(JSONarray, MVPs);
  playerAr = cleanArray(JSONarray, MVPs).map(function(player){
    var input = Object.keys(player).filter(function(key){ return ignoredStats.indexOf(key) === -1; }).map(function(key){
      if(player[key] === ''){
        return 0;
      } else{
        return player[key];
      }
    });


    return { input: input, output: [player.MVP] };
  });
});




converter.fromFile("./stats.csv", function(err, result){

});

var cleanArray = function(result, MVPs){
  result = result.filter(function(player){ return player.Rk !== 'Rk'; }).filter(function(player){
    if(result.filter(function(player2){ return player2.Player === player.Player && player2.Age === player.Age; }).length > 1){
      return player.Tm === 'TOT';
    }else{
      return true;
    }
}).filter(function(player){ return player.GS >= 60; }).map(function(player){
    /*console.log(MVPs.filter(function(player2){ return player2.Player === player.Player && player2.Age === player.Age; }));*/
    if(MVPs.filter(function(player2){ return player2.Player === player.Player && player2.Age === player.Age; }).length > 0){
      player.MVP = 1;
    }else{
      player.MVP = 0;
    }

    return player;
  });

  return result;
}

var testPlayer = function(players, player){
  var temp_players = players.filter(function(play){ return play.Player == player.Player && play.Age == player.Age; });

  return Object.keys(temp_players[0]).filter(function(key){ return ignoredStats.indexOf(key) === -1; }).map(function(key){ return temp_players[0][key]; });
}

var params = {
};

var player = {
  Player: "Kobe Bryant",
  Age: 29
}, player2 = {
  Player: 'LeBron James',
  Age: 27
}, player3 = {
    Player: 'Derrick Rose',
    Age: 22
},
player4 = [71,71,42.0,10.7,25.5,.420,1.4,4.3,.320,.447,8.2,10.1,.814,0.7,3.1,3.8,4.6,2.5,0.3,3.3,2.1,31.1
];

var netJSON = JSON.parse(fs.readFileSync('./mvp.json'));
var net = synaptic.Network.fromJSON(netJSON);

setTimeout(function(){
  console.log(net.activate(testPlayer(rawAr, player)));
  console.log(net.activate(testPlayer(rawAr, player2)));
  console.log(net.activate(testPlayer(rawAr, player3)));
  console.log(net.activate(player4));

}, 5000);
