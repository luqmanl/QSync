import { WebSocketServer } from "ws";

let counter = 1;
let prev = Math.floor(Math.random() * (10000 - 1 + 1) + 1);

const wss = new WebSocketServer({
  port: 2000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

// 1. listen for socket connections
wss.on("connection", (client) => {
  let count = 0;
  setInterval(() => {
    // 2. every second, emit a 'cpu' event to user
    client.send(
      JSON.stringify({
        points: [
          {
            x: counter++,
            y: (prev *= Math.random() * (1.0309278351 - 0.97) + 0.97),
          },
        ],
      })
    );
    console.log(`sent ${count++}`);
  }, 10);
});
