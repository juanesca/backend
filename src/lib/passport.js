const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const MySQLConnection = require("../db/db");
const helpers = require("../lib/helpers");

passport.use(
  "local.signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      await MySQLConnection.query(
        "SELECT * FROM usuario_registrado WHERE username = ?",
        [username]
      );
      if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(
          password,
          user.password
        );
        if (validPassword) {
          done(
            null,
            user,
            req.flash("success", `Bienvenido ${user.nombre_completo}`)
          );
        } else {
          done(null, false, req.flash("message", `Contraseña incorrecta`));
        }
      } else {
        return done(null, false, req.flash("message", "El nombre no existe"));
      }
    }
  )
);

passport.use(
  "local.signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, res, username, password, done) => {
      const { Telefono, Direccion, tipo_usuario } = req.body;
      let newUser = {
        username,
        password,
        tipo_usuario,
        Telefono,
        Direccion,
      };
      newUser.password = await helpers.encryptPassword(password);
      const result = await MySQLConnection.query(
        "INSERT INTO usuario_registrado(username,password,tipo_usuario,Telefono,Direccion) VALUES(?,?,?,?,?)",
        [newUser],
        (err, results, fields) => {
          if (err) {
            console.error(err);
          } else {
            res.json({ message: `Bienvenid@ ${newUser.username}` });
          }
        }
      );
      newUser.id = result.insertId;
      return done(null, newUser);
      /*const result = await MySQLconnection.query(
        "INSERT INTO usuario_registrado(username,password,Telefono,tipo_usuario,Direccion) VALUES(?,?,?,?,?)",
        [newUser],
        (err, results, fields) => {
          if (err) {
            console.error(err);
          } else {
            res.json({ message: `Bienvenid@ ${newUser.username}` });
          }
        }
      );
      newUser.id = result.insertId;
      return done(null, newUser);*/
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const rows = await MySQLConnection.query(
    "SELECT * FROM usuario_registrado WHERE id = ?",
    [id]
  );
  done(null, rows);
});
