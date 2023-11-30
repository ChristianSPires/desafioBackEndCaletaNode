const { v4: uuidv4 } = require('uuid');

class Transaction {

    constructor(player, value, type, canceled) {
        this.id = uuidv4();
        this.playerId = player.id;
        this.value = value;
        this.type = type;
        this.canceled = canceled;
    }
}

module.exports = Transaction;