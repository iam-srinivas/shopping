require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const app = express()
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")


// DB CONNECTION
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to Database")
}).catch((e) => {
    console.log("error", e)
})


// MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// ROUTES
app.use("/api", authRoutes)
app.use("/api", userRoutes)

// PORT
const port = process.env.PORT || 8000

// STARTING SERVER
app.listen(port, () => {
    console.log("Server is Running")
})