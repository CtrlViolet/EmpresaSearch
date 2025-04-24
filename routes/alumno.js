// routes/alumno.js
const express = require("express");
const db = require("../db");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");

const router = express.Router();

/**
 * Middleware para verificar token de alumno
 */
function verificarTokenAlumno(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ mensaje: "Token no proporcionado" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.tipo !== "alumno") {
            return res.status(403).json({ mensaje: "Acceso denegado: solo alumnos" });
        }
        req.usuario = decoded;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
}

/**
 * Marcar empresa como favorita
 * POST /api/favoritos/:idEmpresa
 */
router.post("/favoritos/:idEmpresa", verificarTokenAlumno, (req, res) => {
    const numeroControl = req.usuario.usuario;
    const idEmpresa = req.params.idEmpresa;

    const query = "INSERT INTO favoritos (Numero_Control, idEmpresa) VALUES (?, ?)";
    db.query(query, [numeroControl, idEmpresa], (err, result) => {
        if (err) {
            console.error("Error al guardar favorito:", err);
            return res.status(500).json({ mensaje: "Error al guardar favorito" });
        }
        res.status(201).json({ mensaje: "Empresa marcada como favorita" });
    });
});

/**
 * Obtener empresas favoritas del alumno
 * GET /api/favoritos
 */
router.get("/favoritos", verificarTokenAlumno, (req, res) => {
    const numeroControl = req.usuario.usuario;

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
 * DELETE /api/favoritos/:idEmpresa
 */
router.delete("/favoritos/:idEmpresa", verificarTokenAlumno, (req, res) => {
    const numeroControl = req.usuario.usuario;
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
 * GET /api/empresa/exportar
 */
router.get("/empresa/exportar", verificarTokenAlumno, (req, res) => {
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
