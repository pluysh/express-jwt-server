const mongoose = require('mongoose');

const db = (settings) => {

    mongoose.connect(settings.DB_ROUTE,{
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    
    database = mongoose.connection;
    database.once('open', () => console.log(settings.DB_MSGS.open));
    database.on('error', console.error.bind(console, settings.DB_MSGS.error));
    return db;
}

module.exports = db;