global.__rootdir = __dirname;

const server = require('./server_modules/server');
const socket = require('./server_modules/server_socket');

socket.serverSocket(server.server);