const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const sequelize = require("./util/database");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);
app.use(bodyParser.json());

app.use("/user",userRoutes);
const PORT = process.env.PORT;

sequelize.sync()
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err)
    })




