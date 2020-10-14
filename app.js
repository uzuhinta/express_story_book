const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
//load config
dotenv.config({ path: "./config/config.env" });

//config passport
require("./config/passport")(passport);

//connect DB
connectDB();

const app = express();

//body parser
app.use(express.urlencoded({ extends: false }));
app.use(express.json());

//use morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//hadlebats helpers
const { formatDate, stripTags, truncate } = require("./helper/hbs");

//express handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: {
      formatDate,
      stripTags,
      truncate
    },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//use session
app.use(
  session({
    secret: "nguyen ba quan",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//use passport middleware
app.use(passport.initialize());
app.use(passport.session());

//use statid
app.use(express.static(path.join(__dirname, "public")));

// use router
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server is listenning in ${process.env.NODE_ENV} on port ${PORT}`)
);
