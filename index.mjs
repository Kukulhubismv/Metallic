import { execSync } from 'child_process';
import fs from 'fs';
import createBareServer from '@tomphttp/bare-server-node';
import http from 'http';
import express from 'express';
const app = express();
const server = http.createServer();
const port = process.env.PORT || config.port
import path from 'path';
const __dirname = path.resolve();

app.use(express.static("build"));

app.use(function(req, res) {
    res.status(200);
    res.sendFile(__dirname + "/build/index.html");
});

const bareServer = createBareServer('/bare/', {
	logErrors: false,
	localAddress: undefined,
	project: {
		name: 'Metallic',
		repository: 'https://github.com/Nebelung-dev/Metallic',
	},
});

server.on('request', (req, res) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeRequest(req, res);
	} else {
		app(req, res);
	}
});

server.on('upgrade', (req, socket, head) => {
	if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	} else {
		socket.end();
	}
});

server.on('listening', () => {
	console.log('Metallic running on port ' + port);
});

server.listen(port);
