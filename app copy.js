// const fs = require("fs").promises;

const { Server } = require("socket.io");

const io = new Server(3000, {
  /* options */
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("asdasd");
  socket.on("ping", () => {
    console.log("Ss");
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
    const board = generateBoard();
    socket.emit("generated-board", board);
  });

  //   socket.on("generateBoard", () => {
  //     function generateBoard(size = 10) {
  //       let board = [];
  //       let counter = 1;

  //       for (let rowIndex = 0; rowIndex < size; rowIndex++) {
  //         board[rowIndex] = [];
  //         for (let colIndex = 0; colIndex < size; colIndex++) {
  //           board[rowIndex][colIndex] = counter;
  //           counter++;
  //         }
  //         if (rowIndex % 2) board[rowIndex] = board[rowIndex].reverse();
  //       }
  //       return board.reverse();
  //     }
  //     const board = generateBoard();
  //     socket.emit("generated-board", board);
  //   });
});

// const roomSession = {
//   players: [
//     {
//       id: 1,
//       name: "player1",
//       color: "blue",
//       position: 1,
//     },
//     {
//       id: 2,
//       name: "player2",
//       color: "red",
//       position: 1,
//     },
//     {
//       id: 3,
//       name: "player3",
//       color: "green",
//       position: 1,
//     },
//     {
//       id: 4,
//       name: "player4",
//       color: "white",
//       position: 1,
//     },
//   ],
//   name: "Test room",
// };

// // const defaultBoard = generateBoard();

// // console.log(generateBoard());

// function randomDiceValue() {
//   let value = Math.floor(Math.random() * 12) + 1;
//   return value;
// }

// //move player
// function movePlayer(player, diceValue) {
//   let currentPosition = player.position;
//   let moveValue = currentPosition + diceValue;
//   currentPosition = moveValue;
//   player.position = currentPosition;
//   if (player.position >= 100) {
//     return "Winner";
//   } else {
//     return { player, diceValue };
//   }
// }

// const playerId = 0;

// do {
//   //   console.log(movePlayer(roomSession.players[playerId], randomDiceValue()));
//   //   console.log(roomSession.players[playerId]);
// } while (roomSession.players[playerId].position < 100);

// //reset players position
// function resetGame() {
//   roomSession.players.map((player) => {
//     player.position = 1;
//   });
//   return;
// }
// resetGame();

// // console.log(roomSession.players);

// io.listen(3000);

// const { Server } = require("socket.io");

// const io = new Server({
//   cors: {
//     origin: "*",
//   },
// });

// const roomSession = {
//   players: [
//     { id: 1, name: "player1", color: "blue", position: 1 },
//     { id: 2, name: "player2", color: "red", position: 1 },
//     { id: 3, name: "player3", color: "green", position: 1 },
//     { id: 4, name: "player4", color: "white", position: 1 },
//   ],
//   name: "Test room",
// };

// function generateBoard(size = 10) {
//   let board = [];
//   let counter = 1;

//   for (let rowIndex = 0; rowIndex < size; rowIndex++) {
//     board[rowIndex] = [];
//     for (let colIndex = 0; colIndex < size; colIndex++) {
//       board[rowIndex][colIndex] = counter;
//       counter++;
//     }
//     if (rowIndex % 2) board[rowIndex] = board[rowIndex].reverse();
//   }
//   return board.reverse();
// }

// // console.log(generateBoard());

// function randomDiceValue() {
//   return Math.floor(Math.random() * 12) + 1;
// }

// function movePlayer(player, diceValue) {
//   let currentPosition = player.position;
//   let moveValue = currentPosition + diceValue;
//   player.position = moveValue;
//   return { player, diceValue };
// }

// function resetGame() {
//   roomSession.players.forEach((player) => {
//     player.position = 1;
//   });
// }

// io.on("connection", (socket) => {
//   console.log(`Player connected: ${socket.id}`);

//   console.log(socket);
//   socket.on("rollDice", (playerId) => {
//     const player = roomSession.players.find((p) => p.id === playerId);
//     console.log(player);
//     if (player) {
//       const diceValue = randomDiceValue();
//       const result = movePlayer(player, diceValue);
//       console.log(result);

//       socket.emit("moveResult", result);
//       io.emit("updatePlayers", roomSession.players);

//       if (player.position >= 100) {
//         io.emit("gameOver", player);
//         resetGame();
//         io.emit("updatePlayers", roomSession.players);
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log(`Player disconnected: ${socket.id}`);
//   });

//   socket.emit("initialize", { board: generateBoard(), players: roomSession.players });
// });

// io.listen(3000);
