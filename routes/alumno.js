// routes/alumno.js
const express = require("express");
const db = require("../db");
const ExcelJS = require("exceljs");
const { verificarToken, soloAlumno } = require("../middleware/auth");

const router = express.Router();

/**
 * Obtener empresas favoritas del alumno
 */
router.get("/favoritos", verificarToken, soloAlumno, (req, res) => {
  const numeroControl = req.usuario.id;

  const query = `
    SELECT e.idEmpresa, e.Nombre, e.Estado, e.Ciudad, e.Ubicacion, e.Sector
    FROM empresa e
    JOIN favoritos f ON e.idEmpresa = f.idEmpresa
    WHERE f.Numero_Control = ?
  `;

  db.query(query, [numeroControl], (err, results) => {
    if (err) {
      console.error("Error al obtener favoritos:", err);
      return res.status(500).json({ mensaje: "Error al obtener favoritos" });
    }

    res.json(results);
  });
});

/**
 * Eliminar una empresa de favoritos
 */
router.delete("/favoritos/:idEmpresa", verificarToken, soloAlumno, (req, res) => {
  const numeroControl = req.usuario.id;
  const idEmpresa = req.params.idEmpresa;

  const query = "DELETE FROM favoritos WHERE Numero_Control = ? AND idEmpresa = ?";

  db.query(query, [numeroControl, idEmpresa], (err, result) => {
    if (err) {
      console.error("Error al eliminar favorito:", err);
      return res.status(500).json({ mensaje: "Error al eliminar favorito" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Empresa no estaba en favoritos" });
    }

    res.json({ mensaje: "Empresa eliminada de favoritos" });
  });
});

/**
 * Exportar empresas a Excel
 */
router.get("/empresa/exportar", verificarToken, soloAlumno, (req, res) => {
  const query = "SELECT * FROM empresa";
  db.query(query, async (err, empresas) => {
    if (err) {
      console.error("Error al obtener empresas:", err);
      return res.status(500).json({ mensaje: "Error al generar archivo" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Empresas");

    worksheet.columns = [
      { header: "ID", key: "idEmpresa", width: 10 },
      { header: "Nombre", key: "Nombre", width: 30 },
      { header: "Estado", key: "Estado", width: 15 },
      { header: "Ciudad", key: "Ciudad", width: 15 },
      { header: "Ubicacion", key: "Ubicacion", width: 25 },
      { header: "Sector", key: "Sector", width: 20 },
      { header: "Carrera Destino", key: "Carrera_Destino", width: 25 },
      { header: "Plazas Disponibles", key: "Plazas_Disponibles", width: 20 },
      { header: "ID Administrativo", key: "idAdministrativo", width: 20 }
    ];

    empresas.forEach((empresa) => {
      worksheet.addRow(empresa);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=empresas.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  });
});

module.exports = router;
