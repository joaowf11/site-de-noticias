const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

io.on('connection', socket => {
  console.log('Novo usuário conectado.');

  socket.on('chat message', (msg) => {
    console.log('Mensagem recebida: ' + msg.text);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Usuário desconectado.');
  });
});

http.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});