// En tu archivo de rutas (por ejemplo, alumno.js o favoritos.js)
const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware para verificar el token y obtener el ID del alumno
router.use((req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = decoded; // Guardar la información del usuario en la petición
    next();
  });
});

// Ruta para agregar una empresa a favoritos
router.post("/favoritos/:idEmpresa", (req, res) => {
  const alumnoId = req.user.id; // Obtener el ID del alumno desde el token
  const empresaId = req.params.idEmpresa; // Obtener el ID de la empresa desde la URL

  // Verificar si la empresa ya está en favoritos
  db.query(
    "SELECT * FROM favoritos WHERE Alumno_ID = ? AND Empresa_ID = ?",
    [alumnoId, empresaId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error al verificar favoritos" });

      if (results.length > 0) {
        return res.status(400).json({ error: "La empresa ya está en tus favoritos" });
      }

      // Insertar la empresa en la tabla de favoritos
      db.query(
        "INSERT INTO favoritos (Alumno_ID, Empresa_ID) VALUES (?, ?)",
        [alumnoId, empresaId],
        (err) => {
          if (err) return res.status(500).json({ error: "Error al agregar a favoritos" });
          res.status(200).json({ mensaje: "Empresa agregada a favoritos" });
        }
      );
    }
  );
});

// Ruta para obtener los favoritos del alumno
router.get("/alumno/favoritos", (req, res) => {
  const alumnoId = req.user.id; // Obtener el ID del alumno desde el token

  db.query(
    "SELECT * FROM empresa WHERE ID IN (SELECT Empresa_ID FROM favoritos WHERE Alumno_ID = ?)",
    [alumnoId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error al obtener los favoritos" });
      res.status(200).json({ favoritos: results });
    }
  );
});

module.exports = router;
