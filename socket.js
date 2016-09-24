var socketio = require('socket.io')
var ws = new WebSocket('ws://localhost:8888/');

var socket = socketio();
console.log(socket);
ws.onmessage = function(event) {
    addon.port.emit('message', event.data);
};
ws.onopen = function(event) {
    ws.send('connected packet');
};
