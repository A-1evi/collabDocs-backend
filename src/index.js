const express = require("express");
const app = express()
const http = require("http");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const  { Server } = require("socket.io")
require("dotenv").config();
// const server= http.createServer(app);
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const documentRouters = require("./routes/document");

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(morgan('combined'));
app.use(helmet());
// app.use(errorHandler);


app.use("/api/auth", authRoutes);
app.use("/api/document",documentRouters);


const server = http.createServer(app); // Create HTTP server using the Express app

const io = new Server(server);

// Handle Socket.IO connections - Delegate logic to socketHandler
// Handle Socket.IO connections - Delegate logic to socketHandler
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socketHandler(io, socket); // Pass io and socket instances to the handler module
  
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, Reason: ${reason}`);
      // Perform cleanup if needed based on disconnect
    });
  });
  

connectDB()
.then(() =>{
    console.log("Database connected");
    server.listen(process.env.PORT, () =>{
        console.log(`Server is started at ${process.env.PORT}`);
    })
}).catch((error)=>{
    console.log("Problem in connection",error);
})




