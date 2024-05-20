const { createServer } = require('http');
const next = require('next');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const secretKey = process.env.JWT_SECRET_KEY

mongoose.connect('mongodb://localhost:27017/task-manager', {});

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = new WebSocket.Server({ server });

    io.on('connection', (socket, request) => {

        const authorizationHeader = request.headers['authorization']
        
        if (!authorizationHeader) {
            socket.close(1008, 'Unauthorized');
        }

        try {

            const decoded = jwt.verify(authorizationHeader, secretKey);
            socket.userId = decoded.userId;

            socket.on(decoded.userId, message => {
                console.log(`Received message => ${message}`);
                wss.emit('message', message + ' from server');
            });

            socket.on('close', () => {
                console.log('Client from room' + decoded.userId + ' disconnected');
            });

        } catch (error) {
            console.error(error);
            socket.close(1008, 'Invalid token');
        }

    });

    server.listen(port, err => {
        if (err) {
            throw err;
        }
        console.log('> Ready on http://localhost:'+port);
    });

    module.exports.io = io;
});



