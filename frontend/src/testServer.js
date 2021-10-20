"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({
    port: 2006,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        // Below options specified as default values.
        concurrencyLimit: 10,
        threshold: 1024
    }
});
// 1. listen for socket connections
wss.on("connection", function (client) {
    var count = 0;
    var counter = 1;
    var prev = Math.floor(Math.random() * (10000 - 1 + 1) + 1);
    var date = Date.now();
    var val = (prev *= Math.random() * (1.0309278351 - 0.97) + 0.97)
    setInterval(function () {
        // 2. every second, emit a 'cpu' event to user
        client.send(JSON.stringify({
            points: [
                {
                    x: date,
                    y: count++
                },
            ]
        }));
        console.log(`Date ${date.today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()} : ${count}`);
    }, 1 * 1000);
});
