// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Importar rutas
const loginRoutes = require("./routes/login");
const empresaRoutes = require("./routes/empresa");
const alumnoRoutes = require("./routes/alumno");

const app = express();

// Configuración de CORS
app.use(cors({
  origin: "http://127.0.0.1:5500",  // Cambia este puerto si usas otro
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware para manejar JSON
app.use(express.json());

// Ruta principal (opcional, para verificar conexión al backend)
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente");
});

// Rutas de la API
app.use("/api", loginRoutes);
app.use("/api", empresaRoutes);
app.use("/api", alumnoRoutes);

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});


