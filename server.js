import app from "./app.js"
import http from  "http"
import db from "./config/db.js"
import {Server} from "socket.io"
import { setupSocket } from "./socket/socket.js"

// variables
const port = process.env.PORT || 3000

// create server
const server = http.createServer(app)

// socket server
const io = new Server(server,{
cors:{
    origin:["http://localhost:5173" , "http://127.0.0.1:5173" ,"http://127.0.0.1:5174" ],
    credentials: true
}
})

//setup socket handlers
setupSocket(io)

// DB
db()

server.listen(port, ()=>{
   console.log(`localhost running on ${port}`) 
})