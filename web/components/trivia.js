const app_script = new Vue({
    el: '#main-container',
    data: {
        clientSocket: null,
        currentQuestion: null,
        questionAnswer: null,
        scoreboard: [],
        myPlayer: {
            id: null,
            nickname: '',
            score: 0,
            status: 'online',
            avatar: ''
        }
    },
    computed: {
        canAnswer: function(){
            return this.currentQuestion && this.currentQuestion.id !== -1;
        }
    },
    methods: {
        initSocket: function() {
            this.clientSocket = io("http://localhost:3000/");
            this.clientSocket.emit('newUser');
        },
        setupSocket: function() {
            //Listening to the list of active players
            this.clientSocket.on('welcome', (data) => {
                this.currentQuestion = data.currentQuestion;
                this.scoreboard = data.scoreboard;
            });

            //Listening to when other players join to display it on the scoreboard
            this.clientSocket.on('playerJoined', (data) => {
                this.scoreboard = data;
                this.myPlayer = this.scoreboard.find(p => p.id === this.clientSocket.id);
            });

            //Listening to when other players join
            this.clientSocket.on('startPlaying', (data) => {
                if (data != undefined){
                    this.currentQuestion = data;
                }
            });

            //Listening to when other player are selecting
            this.clientSocket.on('selecting', (data) => {
                this.displaySelecting(data);
            });

            //Listening other players' buzzers
            this.clientSocket.on('buzzer', (data) => {
                this.scoreboard = data.scoreboard;
                this.currentQuestion = data.currentQuestion;
                this.myPlayer.score = this.scoreboard.find(p => p.id === this.clientSocket.id).score;
            });

            //Listening to when a player goes off
            this.clientSocket.on('playerGone', (data) => {
                this.scoreboard = data;
            });

            //Listening to when game is over
            this.clientSocket.on('gameOver', (data) => {
                this.scoreboard = data.scoreboard;
                modal_script.winner.nickname = data.winner;
                modal_script.showModal = true;
            });

            this.clientSocket.on('newGame', (data) => {
                this.scoreboard = data.scoreboard;
                this.currentQuestion = data.currentQuestion;
                this.myPlayer.score = 0;
            });
        },
        joinGame: function() {
            // this.myPlayer.id = this.clientSocket.id;
            // this.myPlayer.nickname = this.$refs.myPlayerNickname.value;
            this.clientSocket.emit('joinGame', this.$refs.myPlayerNickname.value);
        },
        notifySelecting: function() {
            this.clientSocket.emit('selecting');
        },
        displaySelecting: function(playerId) {
            const playerSelecting = this.scoreboard.find(p => p.id === playerId);
            const playerStatus = playerSelecting.status;

            playerSelecting.status = "is selecting... ";
            setTimeout(function () { playerSelecting.status = playerStatus }, 3000);
        },
        pressBuzzer: function() {
            this.clientSocket.emit('buzzer', this.questionAnswer);
        },
        startNewGame: function() {
            this.clientSocket.emit('startOver');
        }
    }
});

const modal_script = new Vue({
    el: '#modal-template',
    data: {
        showModal: false,
        winner: {
            nickname: null
        }
    },
    methods:{
        startOver: function() {
            this.winner.nickname = null;
            this.showModal = false;
            app_script.startNewGame();
        }
    }
});

app_script.initSocket();
app_script.setupSocket();