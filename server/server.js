var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3030;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

var clients = {};


io.on('connection', (socket) => {
  console.log("User Connected - Socket: " + socket.id);

  socket.on('fetch-chats', () => fetchChats(socket));  
  socket.on('add-user', (data) => addUser(data, socket));
  socket.on('private-message', (message) => privateMessage(message, socket));
  socket.on('disconnect', (data) => disconnect(data, socket));
});

//fetching chats(initiated from the user)
function fetchChats(socket){
  // console.log(socket);
  //return chats as an object;
  let payload =  {
    'zoz-eyad': {
      id: 1, //Represents the ChatId
      name: 'Patriot Chat Development',
      participants: ['zoz', 'eyad']
    },
    'zoz-dhaynes': {
      id: 2,
      name: 'some other thing',
      participants: ['zoz', 'dhaynes']
    },
    'eyad-dhaynes': {
      id: 3,
      name: 'some third thing',
      participants: ['eyad', 'dhaynes']
    }
  };

  io.to(socket.id).emit('fetch-chats', payload);
}

//adding a user to the chatroom
function addUser(data, socket){
  console.log("netId: " + data.netid);
  clients[data.netid] = {
    socket: socket.id
  };
}

//Sending a private message
function privateMessage(message, socket){
  console.log(message.sender + " is Sending: " + message.text);
  console.log("clients: " + JSON.stringify(clients));
  console.log(message.destinations);
  message.destinations.forEach((client) => {

    //making sure we don't send to the sender
    if (client == message.sender) return;

    if (clients[client]){
      console.log(client);
      io.to(clients[client].socket).emit("add-message", message);      
    } else {
      console.log("user not defined!");
      // send that user a push notification
    }
  });
  // if (clients[message.destination]){
  //   io.sockets.connected[clients[message.destination].socket].emit("add-message", message);
  // } else {
  //   // console.log("User does not exist: " + user.netid);
  // }
}

//Removing the socket on disconnect
function disconnect(data, socket){
  for(var name in clients) {
    if(clients[name].socket === socket.id) {
      delete clients[name];
      break;
    }
  }	
}