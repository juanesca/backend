const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const session = require("express-session");
const MySQLsession = require("express-mysql-session");
const passport = require("passport");
const flash = require("connect-flash");
const bodyParser = require("body-parser");

const { database } = require("./src/keys");

// Initializations
const app = express();
require("./src/lib/passport");

//Cors
app.use(cors({ origin: "*" }));
//añadir link del front al terminar el back

//Settings
app.set("port", process.env.PORT || 4001);

// Middlewares
app.use(morgan("dev"));
app.use(
  session({
    secret: "juanmysqlnodesession",
    resave: false,
    saveUninitialized: false,
    store: new MySQLsession(database),
  })
);
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

//Global Variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user;
  next();
});

//Routes
app.use("/user", require("./src/routes/usuario"));
app.use("/tiendas", require("./src/routes/tiendas"));

//Starting the server
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
