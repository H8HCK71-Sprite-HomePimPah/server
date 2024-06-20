const express = require("express");
const app = express();
const http = require("http");

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const roomSession = {
  players: [],
  name: "Test room",
  turn: 0,
};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  function getRandomColor() {
    const colors = ["blue", "red", "black", "white"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  socket.on("game:join", () => {
    const newPlayer = {
      id: socket.id,
      name: `player${roomSession.players.length + 1}`,
      color: getRandomColor(),
      position: 1,
    };
    console.log(newPlayer.name);

    if (roomSession.players.length < 2) {
      roomSession.players.push(newPlayer);
    }
    io.emit("players-position", roomSession.players);
    io.emit("current-turn", roomSession.turn);
    socket.emit("player-info", newPlayer);

    console.log(roomSession.players);
  });

  // console.log(roomSession.players);

  // Emit the new player's information to them

  // Broadcast the updated player list to all clients

  socket.on("generateBoard", () => {
    const board = generateBoard();
    io.emit("generated-board", board);
  });

  socket.on("dice", (callback) => {
    const playerIndex = roomSession.players.findIndex((player) => player.id === socket.id);
    if (playerIndex !== roomSession.turn) {
      socket.emit("error", "Not your turn");
      return;
    }

    const dice = randomDiceValue();
    callback(dice);
    // io.emit("dice/number", dice);
  });

  socket.on("maen", (dadu) => {
    console.log(dadu);
    const urutan = roomSession.turn;
    const currPlayer = roomSession.players[urutan];
    currPlayer.position += dadu;

    // io.emit("winner", () => {
    //   let winner = false;
    //   if (currPlayer.position >= 10) {
    //     winner = true;
    //     return winner;
    //   }
    // });

    roomSession.turn = (roomSession.turn + 1) % roomSession.players.length;
    console.log(roomSession);
    io.emit("players-position", roomSession.players);
    io.emit("current-turn", roomSession.turn);
  });

  socket.on("resetGame", () => {
    roomSession.players.forEach((player) => {
      player.position = 1;
    });
    roomSession.turn = 0;
    io.emit("resetGame/position", roomSession.players);
    io.emit("current-turn", roomSession.turn);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    roomSession.players = roomSession.players.filter((player) => player.id !== socket.id);

    // Adjust the turn if the current player disconnects
    if (roomSession.turn >= roomSession.players.length) {
      roomSession.turn = 0;
    }

    io.emit("players-position", roomSession.players);
    io.emit("current-turn", roomSession.turn);
  });

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", ({ message, room: target }) => {
    console.log("message received", message);
    let option = {
      message,
      from: socket?.user?.username || socket.id,
      created: new Date(),
    };
    console.log({ option, target });
    if (target) {
      socket.broadcast.to(target).emit("new-message", option);
      // io.emit.to(target).emit("new-message", option);
      // io.to(socket.id).emit("new-message", option);
    } else {
      // io.emit("new-message", option);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
  // New event handler to disconnect all users
  socket.on("disconnect-all", () => {
    // Get all connected sockets
    const connectedSockets = io.sockets.sockets;

    // Iterate through each socket and disconnect it
    connectedSockets.forEach((connectedSocket) => {
      connectedSocket.disconnect(true); // true parameter forces close
    });

    // Clear the roomSession
    roomSession.players = [];
    roomSession.turn = 0;
    io.emit("players-position", roomSession.players);
    io.emit("current-turn", roomSession.turn);
  });
});

function generateBoard(size = 10) {
  let board = [];
  let counter = 1;

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    board[rowIndex] = [];
    for (let colIndex = 0; colIndex < size; colIndex++) {
      board[rowIndex][colIndex] = counter;
      counter++;
    }
    if (rowIndex % 2) board[rowIndex] = board[rowIndex].reverse();
  }
  return board.reverse();
}

function randomDiceValue() {
  return Math.floor(Math.random() * 12) + 1;
}

io.listen(3000);
