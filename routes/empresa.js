// routes/empresa.js
// CRUD para la tabla empresa, accesible solo por administradores autenticados

const express = require("express");
const db = require("../db");
const verificarTokenAdmin = require("../middleware/auth");

const router = express.Router();

/**
 * Crear una nueva empresa
 * POST /api/empresa
 */
router.post("/empresa", verificarTokenAdmin, (req, res) => {
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

    db.query(query, [Nombre, Estado, Ciudad, Ubicacion, Sector, Carrera_Destino, Plazas_Disponibles, idAdministrativo], (err, result) => {
        if (err) {
            console.error("Error al crear empresa:", err);
            return res.status(500).json({ mensaje: "Error al crear empresa" });
        }

        res.status(201).json({ mensaje: "Empresa creada exitosamente", idEmpresa: result.insertId });
    });
});

/**
 * Obtener todas las empresas
 * GET /api/empresa
 */
router.get("/empresa", verificarTokenAdmin, (req, res) => {
    db.query("SELECT * FROM empresa", (err, results) => {
        if (err) {
            console.error("Error al obtener empresas:", err);
            return res.status(500).json({ mensaje: "Error al obtener empresas" });
        }

        res.json(results);
    });
});

/**
 * Obtener una empresa por ID
 * GET /api/empresa/:id
 */
router.get("/empresa/:id", verificarTokenAdmin, (req, res) => {
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

/**
 * Actualizar una empresa por ID
 * PUT /api/empresa/:id
 */
router.put("/empresa/:id", verificarTokenAdmin, (req, res) => {
    const idEmpresa = req.params.id;
    const {
        Nombre,
        Estado,
        Ciudad,
        Ubicacion,
        Sector,
        Carrera_Destino,
        Plazas_Disponibles
    } = req.body;

    const query = `
        UPDATE empresa SET 
        Nombre = ?, Estado = ?, Ciudad = ?, Ubicacion = ?, 
        Sector = ?, Carrera_Destino = ?, Plazas_Disponibles = ?
        WHERE idEmpresa = ?
    `;

    db.query(query, [Nombre, Estado, Ciudad, Ubicacion, Sector, Carrera_Destino, Plazas_Disponibles, idEmpresa], (err, result) => {
        if (err) {
            console.error("Error al actualizar empresa:", err);
            return res.status(500).json({ mensaje: "Error al actualizar empresa" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Empresa no encontrada" });
        }

        res.json({ mensaje: "Empresa actualizada exitosamente" });
    });
});

/**
 * Eliminar una empresa por ID
 * DELETE /api/empresa/:id
 */
router.delete("/empresa/:id", verificarTokenAdmin, (req, res) => {
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

