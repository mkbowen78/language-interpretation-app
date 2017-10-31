//Get data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

//arguments array
var nodeArgv = process.argv;
var command = process.argv[2];

//variable for movie or song
var name = "";
//use multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    name = name + "+" + nodeArgv[i];
  } else{
    name = name + nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    myTweets();
  break;

  case "spotify-this-song":
    if(name){
      spotifySong(name);
    } else{
      spotifySong("The Sign");
    }
  break;

  case "movie-this":
    if(name){
      omdbData(name);
    } else{
      omdbData("Mr. Nobody");
    }
  break;

  case "do-what-it-says":
    doStuffs();
  break;

  default:
    console.log("{Please enter one of the following commands: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function myTweets(){
  //gets last 20 available tweets
  var screenName = {screen_name: 'roshambowen'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){

      //Loops through tweets returned
      //Then display tweet date and text
      for(var i = 0; i<tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log("@roshambowen: " + tweets[i].text + " Created: " + date.substring(0, 19));
        console.log("-----------------------");

        //adds text to log.txt file
        fs.appendFile('log.txt', "@roshambowen: " + tweets[i].text + " Created: " + date.substring(0, 19));
        fs.appendFile('log.txt', "-----------------------");
      }
    } else {
      console.log('Error occurred');
    }
  });
}

function spotifySong(song){
  spotify.search({ type: 'track', query: song}, function(error, data) {
    if(!error){
      for(var i = 0; i < data.tracks.items.length; i++) {
        var songData = data.tracks.items[i];
        //artist or band
        console.log("Artist: " + songData.artists[0].name);
        //name of song
        console.log("Song: " + songData.name);
        //name of album
        console.log("Album: " + songData.album.name);
        //preview on spotify
        console.log("Preview URL: " + songData.preview_url);
        console.log("-----------------------");

        //adds text to log.txt
        fs.appendFile('log.txt', songData.artists[0].name);
        fs.appendFile('log.txt', songData.name);
        fs.appendFile('log.txt', songData.album.name);
        fs.appendFile('log.txt', songData.preview_url);
        fs.appendFile('log.txt', "-----------------------");
      }
    } else {
      console.log('Error occurred.');
    }
  });
}

function omdbData(movie){
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';

  request(omdbURL, function (error, response, body){
    if(!error && response.statusCode == 200){
      var body = JSON.parse(body);

      console.log("Title: " + body.Title);
      console.log("Release Year: " + body.Year);
      console.log("IMdB Rating: " + body.imdbRating);
      console.log("Country: " + body.Country);
      console.log("Language: " + body.Language);
      console.log("Plot: " + body.Plot);
      console.log("Actors: " + body.Actors);
      console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
      console.log("Rotten Tomatoes URL: " + body.tomatoURL);

      //adds text to log.txt
      fs.appendFile('log.txt', "Title: " + body.Title);
      fs.appendFile('log.txt', "Release Year: " + body.Year);
      fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating);
      fs.appendFile('log.txt', "Country: " + body.Country);
      fs.appendFile('log.txt', "Language: " + body.Language);
      fs.appendFile('log.txt', "Plot: " + body.Plot);
      fs.appendFile('log.txt', "Actors: " + body.Actors);
      fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + body.tomatoRating);
      fs.appendFile('log.txt', "Rotten Tomatoes URL: " + body.tomatoURL);

    } else{
      console.log('Error occurred.');
    }
    if(movie === "Mr. Nobody"){
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });

}

function doStuffs(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}
