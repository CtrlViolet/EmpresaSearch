// Ruta para iniciar sesión como administrativo o alumno. Retorna un JWT.
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");
require("dotenv").config();

const router = express.Router();

// Ruta POST /api/login
router.post("/login", (req, res) => {
  const { tipo, usuario, contraseña } = req.body;

  if (!tipo || !usuario || !contraseña) {
    return res.status(400).json({ error: "Faltan datos" });
  }

  // Login de alumno
  if (tipo === "alumno") {
    // Validaciones: número de control y NIP
    if (!/^\d{8}$/.test(usuario) || !/^\d{4}$/.test(contraseña)) {
      return res.status(400).json({ error: "Formato inválido" });
    }

    const añoIngreso = parseInt(usuario.slice(0, 2), 10) + 2000;
    const añoActual = new Date().getFullYear();
    if (añoIngreso > añoActual) {
      return res.status(403).json({ error: "Número de control inválido (año futuro)" });
    }

    db.query(
      "SELECT * FROM alumno WHERE Numero_Control = ? AND NIP = ?",
      [usuario, contraseña],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });

        if (results.length > 0) {
          const alumno = results[0];
          const token = jwt.sign(
            { id: alumno.Numero_Control, tipo: "alumno", nombre: alumno.Nombre },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
          );

          res.json({
            mensaje: "Login exitoso",
            token,
            tipo: "alumno",
            nombre: alumno.Nombre,
            numero_control: alumno.Numero_Control
          });
        } else {
          res.status(401).json({ error: "Credenciales incorrectas" });
        }
      }
    );

  // Login de administrativo
  } else if (tipo === "administrativo") {
    if (usuario.length !== 13) {
      return res.status(400).json({ error: "El RFC debe tener 13 caracteres" });
    }

    db.query(
      "SELECT * FROM administrativo WHERE Usuario = ? AND Contraseña = ?",
      [usuario, contraseña],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Error de servidor" });

        if (results.length > 0) {
          const admin = results[0];
          const token = jwt.sign(
            { id: admin.idAdministrativo, tipo: "administrativo", nombre: admin.Nombre },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
          );

          res.json({
            mensaje: "Login exitoso",
            token,
            tipo: "administrativo",
            nombre: admin.Nombre,
            usuario: admin.Usuario,
            cargo: admin.Cargo
          });
        } else {
          res.status(401).json({ error: "Credenciales incorrectas" });
        }
      }
    );

  } else {
    res.status(400).json({ error: "Tipo de usuario no válido. Usa 'alumno' o 'administrativo'" });
  }
});

module.exports = router;

