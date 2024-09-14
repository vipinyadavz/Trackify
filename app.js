const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", (socket) => {
    socket.on("send-location", (data) => {
        io.emit("received-location", { id: socket.id, ...data });
    });
    console.log("connected to socketIo");
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
