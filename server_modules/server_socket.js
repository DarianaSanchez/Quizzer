const socket = require('socket.io');
const api = require('./api_helper');
const player = require('./models/player');

let players = [];
let questions = [];
let questionCounter = 0;

async function getCurrentQuestion(){
   if (questions.length == 0) {
      questions = await api.getTriviaQuestions();
      return questions[questionCounter];
   } else {
      return questions[questionCounter];
   }
}

function updateScores(playerAnswer, playerId){
   if (questions[questionCounter].correctAnswer === playerAnswer){
      let buzzerPlayer = players.find(function(element) {
         return element.id === playerId;
      });

      buzzerPlayer.score += 1;
   }
}

function playerOut(playerId) {
   players = players.filter(function (element) {
      return element.id != playerId;
   });
}

function resetScores(){
   players = players.map(function (element) {
      element.score = 0;
      return element;
   });
}

function getWinner(){
   if (players.length == 1){
      return players[0].score > 0 ? players[0].nickname : null;
   }

   return players.reduce(function (prev, next, index, array) {
      if (index === array.length-1)
         if (prev.score <= 0 && next.score <= 0) return "";
      return (prev.score > next.score ? prev.nickname : next.nickname);
   });
}

let setupSocket = function(server){
   let serverSocket = socket(server);

   serverSocket.on('connection', function(socket) {
      console.log('Socket connected. Welcome!'); 

      // Emit event to all sockets when a new player joins the game
      socket.on('newUser', async function(){
         serverSocket.sockets.emit('welcome', {
            currentQuestion: api.dummyQuestion,
            scoreboard: players
         }); 
      });

      // Emit event to all sockets when a new player joins the game
      socket.on('joinGame', async function(data){
         players.push(new player.Player(socket.id, data, 48));
         const currentQuestion = await getCurrentQuestion();

         serverSocket.sockets.emit('startPlaying', currentQuestion);  
         serverSocket.sockets.emit('playerJoined', players);               
      });

      // Emit event when a player is selecting to notify the rest
      socket.on('selecting', function(){
         socket.broadcast.emit('selecting', socket.id);
      });

      // Emit event to all sockets when one player presses the buzzer
      socket.on('buzzer', async function(data){
         updateScores(data, socket.id);
         questionCounter += 1;

         if (questionCounter < questions.length){
            const currentQuestion = await getCurrentQuestion();

            serverSocket.sockets.emit('buzzer', {
               currentQuestion: currentQuestion,
               scoreboard: players
            });
         } else {
            questions = [];
            questionCounter = 0;
            serverSocket.sockets.emit('gameOver', {
               scoreboard: players,
               winner: getWinner()
            });
         }
      });

      socket.on('startOver', async function(){
         resetScores();
         questions = [];
         const currentQuestion = await getCurrentQuestion();
         
         serverSocket.sockets.emit('newGame', {
            currentQuestion: currentQuestion,
            scoreboard: players
         });
      });

      socket.on('disconnect', function () {
         playerOut(socket.id);
         serverSocket.sockets.emit('playerGone', players);
       });
   });
};

module.exports = {
   serverSocket: setupSocket
};