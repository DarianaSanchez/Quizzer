const express = require('express');
const config = require('../config.json');
const app = express();

const routes = [
    { path: '/', view: `${ global.__rootdir }/web/views/index.html` },
    { path: '/home', view: `${ global.__rootdir }/web/views/index.html` },
    { path: '/game', view: `${ global.__rootdir }/web/views/game.html` },
    { path: null, view: `${ global.__rootdir }/web/views/not_found.html` }
];

function setupRoutes(routes){
    for(const value of routes){
        if (value.path !== null && value.path !== undefined){
            app.get(value.path, function(req, res){
                res.sendFile(value.view);
            });
        }
    }

    const not_found = routes[routes.length-1];
    app.use(function(req, res, next) {
        res.status(404).sendFile(not_found.view);
    });
}

const port = config.app.node_port;
const url = config.app.node_url;

const server = app.listen(port, url, function(){
    console.log('Conexión exitosa');
    
    app.use(express.static('web'));
    setupRoutes(routes);
});

module.exports = {
    server: server
}