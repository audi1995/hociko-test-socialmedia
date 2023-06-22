const { default: mongoose } = require('mongoose');

const DB =process.env.DB_STRING

mongoose.connect(DB);




