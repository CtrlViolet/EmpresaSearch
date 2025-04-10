// index.js
// Punto de entrada del backend. Monta las rutas y arranca el servidor.

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const loginRoutes = require("./routes/login");
const empresaRoutes = require("./routes/empresa");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Rutas de la API
app.use("/api", loginRoutes);     // POST /api/login
app.use("/api", empresaRoutes);   // POST y DELETE /api/empresa

// Iniciar el servidor
app.listen(port, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
