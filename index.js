const express = require('express');
const app = express();
const authRoutes = require("./routes/authRoutes");
const route = require('./config/routes');
const apiRoutes = require('./routes/apiRoutes');
const port = 3000;

require('dotenv').config();
const cookieParser = require('cookie-parser');


require('./config/mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));


app.set('view engine', 'ejs');

const { attachUser } = require("./middleware/auth");
app.use(attachUser);

app.use(authRoutes);
app.use(route);
app.use(apiRoutes);

app.listen(port, () => console.log(`Server is on ${port}`));