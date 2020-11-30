const { Router } = require("express");
const mysqlConnection = require("../db/db");
const router = Router();
const mySQLconnection = require("../db/db");

const { isLoggedIn } = require("../lib/auth");

// Tiendas
router.get("/", (req, res) => {
  mySQLconnection.query("SELECT * FROM tienda", (err, rows, field) => {
    if (!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

router.get("/:Categorias", (req, res) => {
  const { Categorias } = req.params;
  mySQLconnection.query(
    "SELECT * FROM tienda WHERE Categorias = ?",
    [Categorias],
    (err, rows, field) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.post("/add", isLoggedIn, (req, res) => {
  const { Direccion, Telefono, Categorias, nombre } = req.body;
  const newTienda = {
    Direccion,
    Telefono,
    Categorias,
    nombre,
    Cod_usuario: req.user.id,
  };
  if (req.user.tipo_usuario == 3) {
    mySQLconnection.query(
      "INSERT INTO tienda(Direccion,Telefono,Categorias,nombre,Cod_usuario) VALUES(?,?,?,?,?) ",
      [newTienda]
    );
  } else {
    res.redirect("");
  }
});

router.patch("/edit/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { Direccion, Telefono, Categorias, nombre } = req.body;
  const newTienda = {
    Direccion,
    Telefono,
    Categorias,
    nombre,
    Cod_usuario: req.user.id,
  };
  if (req.user.tipo_usuario == 3) {
    mySQLconnection.query("UPDATE tienda SET ? WHERE id = ?", [newTienda, id]);
  } else {
    res.redirect("");
  }
});

router.delete("/delete/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  if (req.user.tipo_usuario == 3) {
    mySQLconnection.query("UPDATE tienda SET ? WHERE id = ?", [newTienda, id]);
  } else {
    res.redirect("");
  }
});

//Productos
router.get("/:id/products", (req, res) => {
  const { id } = req.params;
  mySQLconnection.query(
    "SELECT * FROM producto WHERE Cod_tienda = ?",
    [id],
    (err, rows, field) => {
      if (!err) {
        res.json(rows);
      } else {
        console.log(err);
      }
    }
  );
});

router.post("/:id/products/add", async (req, res) => {
  const { id } = req.params;
  const { Costo, Caracteristicas, nombre } = req.body;
  const newProduct = {
    Costo,
    Caracteristicas,
    nombre,
    Cod_tienda: id,
  };
  await mySQLconnection.query(
    "INSERT INTO producto set ?",
    [newProduct],
    (err, results, fields) => {
      if (err) {
        console.error(err);
      } else {
        res.json({ message: "Se han actualizado los datos." });
      }
    }
  );
});

router.put("/:id/products/edit/:Id", async (req, res) => {
  const { id, Id } = req.params;
  const { Costo, Caracteristicas, nombre } = req.body;
  const editProduct = {
    Costo,
    Caracteristicas,
    nombre,
    Cod_tienda: id,
  };
  await mySQLconnection.query(
    "UPDATE producto SET ? WHERE Id = ?",
    [editProduct, Id],
    (err, results, fields) => {
      if (err) {
        console.error(err);
      } else {
        res.json({ message: "Se han actualizado los datos." });
      }
    }
  );
});

router.get("/:id/products/delete/:Id", (req, res) => {
  const { Id } = req.params;
  mySQLconnection.query("DELETE FROM producto WHERE Id = ?", [Id],(err, results, fields) => {
    if (err) {
      console.error(err);
    } else {
      res.json({ message: "Se han eliminado los datos." });
    }
  });
});

module.exports = router;
