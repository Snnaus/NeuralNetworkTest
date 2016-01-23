var fs = require('fs'),
    __ = require('lodash'),
    synaptic = require('synaptic'),
    Converter = require('csvtojson').Converter;

var converter = new Converter({}), MVPs = [{ Player: 'Stephen Curry', Age: 26 },
                                           { Player: "Kevin Durant", Age: 25 },
                                           { Player: 'Lebron James', Age: 28 },
                                           { Player: "Lebron James", Age: 27 },
                                           { Player: "Derrick Rose", Age: 22 },
                                           { Player: "Lebron James", Age: 25 },
                                           { Player: "Lebron James", Age: 24 },
                                           { Player: "Kobe Bryant", Age: 29 },
                                           { Player: "Dirk Nowitzki", Age: 28 },
                                           { Player: "Steve Nash", Age: 31 }];

var playerAr = [], net = new synaptic.Architect.Perceptron(17,5,1), rawAr = [];
var ignoredStats = ['Rk', 'Player', 'Pos', 'Age', 'Tm', 'MVP', 'FG' ,'FGA','3P','3PA','2P','2PA','2P'];

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
  }).filter(function(player){ return player.GS >= 65; }).map(function(player){
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
  players = players.filter(function(play){ return play.Player == player.Player && play.Age == player.Age; });

  return Object.keys(players[0]).filter(function(key){ return ignoredStats.indexOf(key) === -1; }).map(function(key){ return players[0][key]; });
}

var params = {
};

var player = {
  Player: "Kobe Bryant",
  Age: 31
};
var player2 = {
  Player: 'Lebron James',
  Age: 25
};

setTimeout(function(){
  console.log(net.trainer.train(playerAr, params));
  console.log(net.activate(testPlayer(rawAr, player)));
  fs.writeFile('mvp.json', net.toJSON());
  console.log(net.activate(testPlayer(rawAr, player2)));

}, 5000);
