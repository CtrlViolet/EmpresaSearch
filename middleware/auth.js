const jwt = require("jsonwebtoken");
require("dotenv").config();

//Verifica que el token JWT sea válido y lo decodifica.

function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ mensaje: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, tipo, nombre, ... }
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
}

// Permite solo acceso a usuarios administrativos
function soloAdministrativo(req, res, next) {
  if (req.usuario?.tipo !== "administrativo") {
    return res.status(403).json({ mensaje: "Acceso denegado: solo administradores" });
  }
  next();
}

// Permite solo acceso a alumnos

function soloAlumno(req, res, next) {
  if (req.usuario?.tipo !== "alumno") {
    return res.status(403).json({ mensaje: "Acceso denegado: solo alumnos" });
  }
  next();
}

module.exports = {
  verificarToken,
  soloAdministrativo,
  soloAlumno
};
