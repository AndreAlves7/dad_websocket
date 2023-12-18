const { randomBytes } = require("crypto");

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
httpServer.listen(8081, () => {
  console.log("listening on *:8081");
});

io.on("connection", (socket) => {
  console.log(`client ${socket.id} has connected`);

  socket.on("echo", (message) => {
    socket.emit("echo", message);
  });

  socket.on('loggedIn', function (user) {
    console.log(user.id + ' has logged in')
    socket.join(user.id)

    if (user.type == 'A') {
      socket.join('administrator')
    }
  })

  socket.on('loggedOut', function (user) {
    socket.leave(user.id)
    socket.leave('administrator')
  })

  socket.on('NewTransaction', function (transaction) {
    console.log(parseInt(transaction.payment_reference))

    //enviar para todos

    if(transaction.type == 'C'){
      //vcard
      socket.to(parseInt(transaction.vcard)).emit('NewTransaction', transaction)
    }else{
      socket.to(parseInt(transaction.payment_reference)).emit('NewTransaction', transaction)
    }

    //convert string to int
    
  })

});