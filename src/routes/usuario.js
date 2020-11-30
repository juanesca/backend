const { Router } = require("express");
const router = Router();

const passport = require("passport");
const MySQLConnection = require("../db/db");
const helpers = require("../lib/helpers");

router.get("/:id", (req, res) => {
  const { id } = req.params;
  MySQLConnection.query(
    "SELECT * FROM usuario_registrado WHERE Id = ?",
    [id],
    (err, rows, field) => {
      if (!err) {
        res.json(rows[0]);
      } else {
        console.log(err);
      }
    }
  );
});

router.post(
  "/signin",

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
          user
        );
      } else {
        done(null, false);
      }
    } else {
      return done(null, false);
    }
  }
);

router.post("/signup", (req, res, next) => {
  const { Telefono, Direccion, tipo_usuario, username, password } = req.body;
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
});

router.get("/logout", (req, res) => {
  req.logOut();
});

router.post("/:id/extraInfo", (req, res) => {
  const { id } = req.params;
  const { Foto_perfil, Cod_cupones, Favoritos, Mas_comprados } = req.body;

  let DATOS = [Foto_perfil, Cod_cupones, Favoritos, Mas_comprados];

  MySQLConnection.query(
    "UPDATE usuario_registrado set ? WHERE id = ? ",
    [DATOS, id],
    (err, results, fields) => {
      if (err) {
        console.error(err);
      } else {
        res.json({ message: "Se han actualizado los datos." });
      }
    }
  );
});

module.exports = router;
