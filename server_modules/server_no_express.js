const http = require('http');
const fs = require('fs');

function serveContent(response, type, content){
    response.writeHead(200, {'Content-Type': type});
    fs.createReadStream(content).pipe(response);
}

let server = http.createServer((req, res) => {
    switch(req.url) {
        case '/':
        case '/home':
            serveContent(res, 'text/html', `${ global.__rootdir }/views/index.html`);
            break;
        case '/game':
            serveContent(res, 'text/html', `${ global.__rootdir }/views/game.html`);
          break;
        default:
            serveContent(res, 'text/html', `${ global.__rootdir }/views/not_found.html`);
    }
});

let startServer = () => {
    try {
        let port = 3000;//TODO: get this values from config file
        let url = '127.0.0.1';//TODO: get this values from config file
        server.listen(port, url);
        console.log('Conexión exitosa');

        server.use(`${ global.__rootdir }/assets`, function (req, res, next) {
            console.log('Time Assets:', Date.now());
            next();
        });
    } catch (e) {
        console.error(e.message);
    }
};

module.exports = {
    server: server,
    startServer: startServer
}