const express = require("express");
const db = require("../db");
require("dotenv").config();

const router = express.Router();

// Ruta para obtener empresas con filtros
router.get("/filtrado", (req, res) => {
  const { estado, ciudad, sector, plazas_disponibles, carrera_destino } = req.query;
  
  let query = "SELECT * FROM empresa WHERE 1=1";
  const params = [];

  if (estado) {
    query += " AND Estado = ?";
    params.push(estado);
  }

  if (ciudad) {
    query += " AND Ciudad = ?";
    params.push(ciudad);
  }

  if (sector) {
    query += " AND Sector = ?";
    params.push(sector);
  }

  if (plazas_disponibles === "si") {
    query += " AND Plazas_Disponibles > 0";
  }

  if (carrera_destino) {
    query += " AND Carrera_Destino = ?";
    params.push(carrera_destino);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error al obtener empresas:", err);
      return res.status(500).json({ error: "Error al obtener empresas" });
    }

    res.json(results);
  });
});

module.exports = router;
