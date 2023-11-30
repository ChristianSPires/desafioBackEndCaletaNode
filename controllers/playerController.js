const pool = require("../db");

async function getBalance(req, res) {
  try {
    const playerId = req.params.playerId;

    // Consultando o saldo do jogador no banco de dados
    const result = await pool.query(
      "SELECT id, balance FROM players WHERE id = ?",
      [playerId]
    );

    // Verifica se o jogador foi encontrado
    if (result.length > 0) {
      const player = result[0];
      res.json({
        player: player.id,
        balance: player.balance,
      });
    } else {
      res.status(404).json({ code: "Player not found!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function placeBet(req, res) {
  try {
    const { player, value } = req.body;

    // Obtendo o saldo atual do jogador
    const balanceResult = await pool.query(
      "SELECT id, balance FROM players WHERE id = ?",
      [player]
    );

    if (balanceResult.length === 0) {
      return res.status(404).json({ code: "Player not found!" });
    }

    const currentBalance = balanceResult[0].balance;

    // Verificando se o jogador tem saldo suficiente para a aposta
    if (currentBalance < value) {
      return res.json({ code: "Insufficient funds" });
    }

    // Atualizando o saldo e registrando a transação no banco de dados
    const newBalance = currentBalance - value;
    await pool.query("UPDATE players SET balance = ? WHERE id = ?", [
      newBalance,
      player,
    ]);

    // Inserindo a transação e capturando o ID gerado
    const { insertId: txn } = await pool.query(
      "INSERT INTO transactions (playerId, type, value, canceled) VALUES (?, ?, ?, ?)",
      [player, "BET", value, false]
    );

    // Atualizando o saldo na tabela de jogadores
    await pool.query("UPDATE players SET balance = ? WHERE id = ?", [
      newBalance,
      player,
    ]);

    return res.json({ player, balance: newBalance, txn });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function win(req, res) {
  try {
    const { player, value } = req.body;

    // Obtendo o saldo atual do jogador
    const balanceResult = await pool.query(
      "SELECT id, balance FROM players WHERE id = ?",
      [player]
    );

    if (balanceResult.length === 0) {
      return res.status(404).json({ code: "Player not found!" });
    }

    const currentBalance = balanceResult[0].balance;

    // Atualizando o saldo e registrando a transação no banco de dados
    const newBalance = currentBalance + value;
    await pool.query("UPDATE players SET balance = ? WHERE id = ?", [
      newBalance,
      player,
    ]);

    const { insertId: txn } = await pool.query(
      "INSERT INTO transactions (playerId, type, value, canceled) VALUES (?, ?, ?, ?)",
      [player, "WIN", value, false]
    );

    return res.json({ player, balance: newBalance, txn });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

async function rollback(req, res) {
  try {
    const { player, txn, value } = req.body;

    // Verificando se a transação existe no banco de dados
    const result = await pool.query(
      "SELECT * FROM transactions WHERE playerId = ? AND id = ?",
      [player, txn]
    );

    if (result.length === 0) {
      return res.status(404).json({ code: "Transaction not found!" });
    }

    const transaction = result[0];

    const balanceResult = await pool.query(
      "SELECT balance FROM players WHERE id = ?",
      [player]
    );

    // Verificando se a transação já foi cancelada anteriormente
    if (transaction.canceled) {
      return res.json({ code: "OK", balance: balanceResult[0].balance });
    }

    // Verificando se a transação é do tipo WIN
    if (transaction.type === "WIN") {
      return res.json({ code: "Invalid" });
    }

    // Verificando se o saldo é suficiente para estornar a transação
    if (value > balanceResult) {
      return res.json({ code: "Insufficient funds to rollback" });
    }

    const currentBalance = balanceResult[0].balance;

    // Atualizando o saldo do jogador e marcando a transação como cancelada
    const newBalance = currentBalance + value;
    await pool.query("UPDATE players SET balance = ? WHERE id = ?", [
      newBalance,
      player,
    ]);

    await pool.query(
      "UPDATE transactions SET canceled = true WHERE playerId = ? AND id = ?",
      [player, txn]
    );

    return res.json({ code: "OK", balance: newBalance });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = { getBalance, placeBet, win, rollback };
