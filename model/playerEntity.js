const { v4: uuidv4 } = require('uuid');

class Player {
    
    constructor(balance){
        this.id = uuidv4();
        this.balance = balance;
    }
}

module.exports = Player;