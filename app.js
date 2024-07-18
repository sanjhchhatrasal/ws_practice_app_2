const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const userModel = require("./models/user");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", function(socket){
    console.log("Connected to ws");
      socket.on("register", function(name) {
        userModel[socket.id] = name;
        socket.emit("register", name); 
    });

    socket.on("msg", function(data){
        io.emit("msg", {id: socket.id, text:data,  name: userModel[socket.id]});
    });
})


app.get("/", async (req, res) => {  
    res.render("name")
});


app.post("/send", async (req, res) => {
    let name = req.body.name;
    res.redirect(`/chat?name=${encodeURIComponent(name)}`)
})

app.get("/chat", (req, res) => {
    const name = req.query.name;
    res.render("index", { name });
});

server.listen(3000)