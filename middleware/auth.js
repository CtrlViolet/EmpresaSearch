// auth.js
// Middleware para verificar que el usuario esté autenticado como administrativo.

const jwt = require("jsonwebtoken");
require("dotenv").config();

// Verifica el token JWT y que el tipo sea "administrativo"
function verificarTokenAdmin(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ mensaje: "Token no proporcionado" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.tipo !== "administrativo") {
            return res.status(403).json({ mensaje: "Acceso denegado: solo administradores" });
        }

        req.usuario = decoded; // Se guarda el usuario en la petición para usarlo después
        next(); // Continuar a la siguiente función (ruta)
    } catch (error) {
        res.status(401).json({ mensaje: "Token inválido o expirado" });
    }
}

module.exports = verificarTokenAdmin;


