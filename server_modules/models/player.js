const utils = require('../utils')

const Player = function(id, nickname, avatarDimension) {
    this.id = id;
    this.nickname = nickname;
    this.score = 0; 
    this.status = 'online'; 
    this.avatar = utils.avatarUrl(avatarDimension); 
};

module.exports = {
    Player: Player
};