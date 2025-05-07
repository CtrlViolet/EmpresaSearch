const express = require("express");
const db = require("../db");
const { verificarToken, soloAdministrativo } = require("../middleware/auth");
const { enviarCorreoAlumno } = require("../utils/email");

const router = express.Router();

//Crear una nueva empresa
 
router.post("/empresa", verificarToken, soloAdministrativo, (req, res) => {
  const {
    Nombre,
    Estado,
    Ciudad,
    Ubicacion,
    Sector,
    Carrera_Destino,
    Plazas_Disponibles
  } = req.body;

  const idAdministrativo = req.usuario.id;

  if (!Nombre || !Estado || !Ciudad || !Ubicacion || !Sector || !Carrera_Destino || Plazas_Disponibles == null) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const query = `
    INSERT INTO empresa 
    (Nombre, Estado, Ciudad, Ubicacion, Sector, Carrera_Destino, Plazas_Disponibles, idAdministrativo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [Nombre, Estado, Ciudad, Ubicacion, Sector, Carrera_Destino, Plazas_Disponibles, idAdministrativo],
    (err, result) => {
      if (err) {
        console.error("Error al crear empresa:", err);
        return res.status(500).json({ mensaje: "Error al crear empresa" });
      }

      // Enviar correo a todos los alumnos
      const alumnosQuery = "SELECT Correo FROM alumno";
      db.query(alumnosQuery, (err, alumnos) => {
        if (!err) {
          alumnos.forEach(a => {
            enviarCorreoAlumno(
              a.Correo,
              "Nueva empresa disponible",
              `Se ha registrado una nueva empresa: ${Nombre}`
            );
          });
        }
      });

      res.status(201).json({ mensaje: "Empresa creada exitosamente", idEmpresa: result.insertId });
    }
  );
});

//Obtener todas las empresas
 
router.get("/empresa", verificarToken, soloAdministrativo, (req, res) => {
  db.query("SELECT * FROM empresa", (err, results) => {
    if (err) {
      console.error("Error al obtener empresas:", err);
      return res.status(500).json({ mensaje: "Error al obtener empresas" });
    }

    res.json(results);
  });
});

//Obtener una empresa por ID
 
router.get("/empresa/:id", verificarToken, soloAdministrativo, (req, res) => {
  const idEmpresa = req.params.id;

  db.query("SELECT * FROM empresa WHERE idEmpresa = ?", [idEmpresa], (err, results) => {
    if (err) {
      console.error("Error al obtener empresa:", err);
      return res.status(500).json({ mensaje: "Error al obtener empresa" });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }

    res.json(results[0]);
  });
});

//Actualizar empresa
 
router.put("/empresa/:id", verificarToken, soloAdministrativo, (req, res) => {
  const idEmpresa = req.params.id;
  const campos = req.body;

  if (!Object.keys(campos).length) {
    return res.status(400).json({ mensaje: "No se enviaron campos para actualizar" });
  }

  const setSql = Object.keys(campos).map((key) => `${key} = ?`).join(", ");
  const valores = Object.values(campos);

  const query = `UPDATE empresa SET ${setSql} WHERE idEmpresa = ?`;

  db.query(query, [...valores, idEmpresa], (err, result) => {
    if (err) {
      console.error("Error al actualizar empresa:", err);
      return res.status(500).json({ mensaje: "Error al actualizar empresa" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }

    // Notificar a alumnos si se activan plazas
    if ("Plazas_Disponibles" in campos && campos.Plazas_Disponibles > 0) {
      const favQuery = `
        SELECT a.Correo, e.Nombre
        FROM favoritos f
        JOIN alumno a ON f.Numero_Control = a.Numero_Control
        JOIN empresa e ON e.idEmpresa = f.idEmpresa
        WHERE f.idEmpresa = ?
      `;

      db.query(favQuery, [idEmpresa], (err2, rows) => {
        if (!err2) {
          rows.forEach((row) => {
            enviarCorreoAlumno(
              row.Correo,
              "¡Tu empresa favorita tiene plazas disponibles!",
              `La empresa "${row.Nombre}" que marcaste como favorita ahora tiene plazas disponibles.`
            );
          });
        }
      });
    }

    res.json({ mensaje: "Empresa actualizada exitosamente" });
  });
});

//Eliminar empresa
 
router.delete("/empresa/:id", verificarToken, soloAdministrativo, (req, res) => {
  const idEmpresa = req.params.id;

  db.query("DELETE FROM empresa WHERE idEmpresa = ?", [idEmpresa], (err, result) => {
    if (err) {
      console.error("Error al eliminar empresa:", err);
      return res.status(500).json({ mensaje: "Error al eliminar empresa" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Empresa no encontrada" });
    }

    res.json({ mensaje: "Empresa eliminada exitosamente" });
  });
});

module.exports = router;

