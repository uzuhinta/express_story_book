const path = require('path');
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db')
const router = require('./routes/index')
//load config
dotenv.config({ path: "./config/config.env" });

//connect DB
connectDB();


const app = express();

//use morgan
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//express handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main' ,extname: '.hbs'}));
app.set('view engine', '.hbs');

//use statid
app.use(express.static(path.join(__dirname, 'public')));

// use router
app.use('/', router);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server is listenning in ${process.env.NODE_ENV} on port ${PORT}`)
);
