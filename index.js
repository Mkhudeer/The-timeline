const express = require('express');
const app = express();
const route = require('./config/routes');
const apiRoutes = require('./routes/apiRoutes');
const port = 3000;

require('./config/mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'));

app.set('view engine', 'ejs');


app.use(route);
app.use(apiRoutes);

app.listen(port, () => console.log(`Server is on ${port}`));