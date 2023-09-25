const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const sequelize = require("./util/database");
const Message = require('./models/Message');
const User = require('./models/User');

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require('./routes/messageRoutes');

require("dotenv").config();

const app = express();

app.use(
    cors({
        origin: 'http://localhost:3000',
    })
);
app.use(bodyParser.json());


app.use("/user",userRoutes);
app.use("/messages",messageRoutes);


//Relations
User.hasMany(Message);
Message.belongsTo(User);

const PORT = process.env.PORT;

sequelize.sync()
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err)
    })




