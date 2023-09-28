const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const sequelize = require("./util/database");

const Message = require('./models/Message');
const User = require('./models/User');
const Group = require('./models/Group');
const UserGroup = require('./models/UserGroup');

const userRoutes = require("./routes/userRoutes");
const messageRoutes = require('./routes/messageRoutes');
const groupRoutes = require('./routes/gropRoutes');

require("dotenv").config();

const app = express();

app.use(
    cors({
        // origin: 'http://localhost:3000',
    })
);
app.use(bodyParser.json());


app.use("/user",userRoutes);
app.use("/messages",messageRoutes);
app.use("/groups",groupRoutes);

//Relations
User.hasMany(Message);
Message.belongsTo(User);

Group.hasMany(Message);
Message.belongsTo(Group);

User.belongsToMany(Group, {through : UserGroup});
Group.belongsToMany(User, {through : UserGroup});

const PORT = process.env.PORT;

sequelize.sync()
    .then(result => {
        app.listen(PORT);
    })
    .catch(err => {
        console.log(err)
    })




