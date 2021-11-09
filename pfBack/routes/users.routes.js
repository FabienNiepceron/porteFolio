const router = require("express").Router();

const { json } = require("express");
const connection = require("../db-connection");

router.get("/", (req, res) => {
  const sql = "SELECT * FROM Utilisateur";
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ errorMessage: err.message });
    } else {
      res.status(200).json(result);
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM Utilisateur WHERE id=?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ errorMessage: err.message });
    } else if (result.length === 0) {
      res
        .status(404)
        .json({ errorMessage: `Utilisateur with id ${id} not found !` });
    } else {
      const user = result[0];
      user.password = "****";
      res.status(200).json(user);
    }
  });
});

router.post("/", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ errorMessage: "You must  provide all the informations" });
  } else {
    let sql = "INSERT INTO Utilisateur SET ?";
    connection.query(sql, [{ email, password }], (errOne, resultOne) => {
      if (errOne) {
        res.status(500).json({ errorMessage: errOne.message });
      } else {
        sql = "SELECT * FROM Utilisateur WHERE id=?";
        connection.query(sql, [resultOne.insertId], (errTwo, resultTwo) => {
          if (errTwo) {
            res.status(500).json({ errorMessage: err.message });
          } else {
            res.status(201).json(resultTwo[0]);
          }
        });
      }
    });
  }
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  if (!email && !password) {
    res
      .status(400)
      .json({ errorMessage: "You must  provide all the informations" });
  } else {
    let sql = "UPDATE Utilisateur SET ? WHERE id=?";
    connection.query(sql, [req.body, id], (errOne, resultOne) => {
      if (errOne) {
        res.status(500).json({ errorMessage: errOne.message });
      } else if (resultOne.affectdRows === 0) {
        res
          .status(400)
          .json({ errorMessage: `Utilisateur with id ${id} not found !` });
      } else {
        sql = "SELECT * FROM Utilisateur WHERE id=?";
        connection.query(sql, [id], (errTwo, resultTwo) => {
          if (errTwo) {
            res.status(500).json({ errorMessage: err.message });
          } else {
            const user = resultTwo[0];
            user.password = "****";
            res.status(200).json(user);
          }
        });
      }
    });
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Utilisateur WHERE id=?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ errorMessage: err.message });
    } else if (result.affectdRows === 0) {
      res
        .status(404)
        .json({ errorMessage: `Utilisateur with id ${id} not found !` });
    } else {
      res.sendStatus(204);
    }
  });
});

module.exports = router;
