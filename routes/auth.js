const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simulación de datos en la base de datos
const alumnos = [
    { Numero_Control: '23200889', NIP: '1234' },
];

const administrativos = [
    { Usuario: 'admin', Contraseña: 'admin123' },
];

// Login para alumnos
router.post('/login/alumno', (req, res) => {
    const { Numero_Control, NIP } = req.body;
    const alumno = alumnos.find(a => a.Numero_Control === Numero_Control && a.NIP === NIP);

    if (!alumno) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ role: 'alumno', Numero_Control }, process.env.JWT_SECRET);
    res.json({ token });
});

// Login para administrativos
router.post('/login/administrativo', (req, res) => {
    const { Usuario, Contraseña } = req.body;
    const admin = administrativos.find(a => a.Usuario === Usuario && a.Contraseña === Contraseña);

    if (!admin) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ role: 'administrativo', Usuario }, process.env.JWT_SECRET);
    res.json({ token });
});

module.exports = router;
