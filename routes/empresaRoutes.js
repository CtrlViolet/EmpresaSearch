const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

// Registrar empresa
router.post('/empresas', empresaController.registrarEmpresa);

// Editar empresa
router.put('/empresas/:id', empresaController.editarEmpresa);

// Eliminar empresa
router.delete('/empresas/:id', empresaController.eliminarEmpresa);

module.exports = router;
