# Caleta's application

## Overview

This Node.js application with Express and MariaDB implements a digital wallet system with endpoints for transaction rollback, balance retrieval, placing bets, and winning prizes.

## Installation

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Set up the environment variables:**

    Create a `.env` file in the root of the project with the following content:

    ```plaintext
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_DATABASE=digital_wallet
    PORT=8080
    ```

3. **Set up the MariaDB database:**

    - Ensure MariaDB is installed and running.
    - Create a database named `digital_wallet`.
    - Create a table name transactions
    - if you prefer, run docker!

4. **Run the application:**

    ```bash
    npm start
    ```

The application will be running on [http://localhost:8080/](http://localhost:8080/).

## Endpoints

### 1. Rollback Transaction

- **Endpoint:** `POST /rollback`
- **Description:** Cancel a previous bet transaction and return the amount to the digital wallet.
- **Request Example:**

    ```json
    {
      "player": 1,
      "txn": 3,
      "value": 10
    }
    ```

- **Response Example:**

    ```json
    {
      "code": "OK",
      "balance": 1995
    }
    ```

### 2. Get Wallet Balance

- **Endpoint:** `GET /balance/:player`
- **Description:** Retrieve the balance of the digital wallet for a specific player.
- **Request Example:**

    ```http
    GET /balance/1
    ```

- **Response Example:**

    ```json
    {
      "player": 1,
      "balance": 1000
    }
    ```

### 3. Place Bet

- **Endpoint:** `POST /bet`
- **Description:** Place a bet using the digital wallet of a player.
- **Request Example:**

    ```json
    {
      "player": 1,
      "value": 5
    }
    ```

- **Response Example:**

    ```json
    {
      "player": 1,
      "balance": 995,
      "txn": 1
    }
    ```

### 4. Win Prize

- **Endpoint:** `POST /win`
- **Description:** Win a prize using the digital wallet of a player.
- **Request Example:**

    ```json
    {
      "player": 1,
      "value": 1000
    }
    ```

- **Response Example:**

    ```json
    {
      "player": 1,
      "balance": 1995,
      "txn": 2
    }
    ```

## License

This project is licensed under the [MIT License](LICENSE).
