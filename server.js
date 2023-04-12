const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const settings = require('./settings.json');
const app = express();
const router = express.Router();


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if(settings.DEV) {
  app.use(logger('dev'));
}

const db = require('./db')(settings);

const users = require('./routes/users')(router, settings);

// append /api for our http requests
//app.use('/api', routes);
app.use(settings.USERS_PATH, users);

// launch our backend into a port
app.listen(settings.API_PORT, () => console.log(`Server listening on port ${settings.API_PORT}`));