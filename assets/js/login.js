// login.js

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del formulario (recargar la página)
  
    const tipo = document.getElementById("tipo").value;
    const usuario = document.getElementById("usuario").value;
    const contraseña = document.getElementById("contraseña").value;
  
    // Crear el objeto de datos que enviaremos al backend
    const data = { tipo, usuario, contraseña };
  
    try {
      // Hacer la petición POST al backend
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Login exitoso
        console.log("Login exitoso", result);
        alert("Login exitoso. Redirigiendo...");
        
        // Se almacena el token y redirigir a una nueva página
        localStorage.setItem("token", result.token);
        window.location.href = "/dashboard.html"; // Redirigir a la página de inicio
      } else {
        // Error en las credenciales
        alert(result.error || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Hubo un problema con el servidor");
    }
  });
  