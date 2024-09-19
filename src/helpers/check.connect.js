'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 60 * 1000;

const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections: ${numConnections}`);
    return numConnections;
}

const checkOverload = () => {
    setInterval(() => {
        const numConnections = countConnect();
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnections > numCores * 5) {
            console.log('Overload connections');
        }
    }, _SECONDS);
}

module.exports = {
    countConnect,
    checkOverload
}