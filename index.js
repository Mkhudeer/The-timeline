const express = require('express');
const app = express();
const route = require('./config/routes');
const port = 3000;

require('./config/mongoose');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static('public'));

app.set('view engine', 'ejs');
// app.use((req, res, next) => {
//   console.log("REQ:", req.method, req.url);
//   next();
// });

app.use(route);

app.listen(port, () => console.log(`Server is on ${port}`));