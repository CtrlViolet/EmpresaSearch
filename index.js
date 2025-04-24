require("dotenv").config();
const express = require("express");
const cors = require("cors");

const loginRoutes = require("./routes/login");     // Rutas para autenticación
const empresaRoutes = require("./routes/empresa"); // Rutas CRUD de empresa
const alumnoRoutes = require("./routes/alumno");   // Rutas para alumno (favoritos, exportar Excel)

const app = express();

// Middlewares globales
app.use(cors()); // Permite peticiones desde cualquier origen
app.use(express.json()); // Habilita JSON en el body de las peticiones

// Rutas de la API
app.use("/api", loginRoutes);
app.use("/api", empresaRoutes);
app.use("/api", alumnoRoutes);

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});


