document.addEventListener("DOMContentLoaded", () => {
    const favoritosBtns = document.querySelectorAll(".btn-favorito");
  
    // Evento para agregar empresa a favoritos
    favoritosBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        const empresaId = btn.getAttribute("data-empresa-id");
  
        try {
          // Obtener el token JWT del localStorage (suponiendo que ya está guardado)
          const token = localStorage.getItem("token");
  
          const response = await fetch(`http://localhost:3000/api/favoritos/${empresaId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Incluir el token de autenticación
            },
          });
  
          const result = await response.json();
  
          if (response.ok) {
            alert("Empresa agregada a favoritos!");
            cargarFavoritos(); // Actualizar la lista de favoritos
          } else {
            alert(result.error || "Error al agregar la empresa a favoritos");
          }
        } catch (error) {
          console.error("Error en la petición:", error);
          alert("Hubo un problema con el servidor");
        }
      });
    });
  
    // Función para cargar los favoritos del alumno
    async function cargarFavoritos() {
      try {
        const token = localStorage.getItem("token");
  
        const response = await fetch("http://localhost:3000/api/alumno/favoritos", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}` // Enviar token para obtener los favoritos
          }
        });
  
        const result = await response.json();
  
        if (response.ok) {
          const favoritos = result.favoritos || [];
          const listaFavoritos = document.getElementById("favoritos-lista");
          listaFavoritos.innerHTML = ""; // Limpiar la lista antes de agregar
  
          // Mostrar los favoritos
          favoritos.forEach(empresa => {
            const li = document.createElement("li");
            li.textContent = empresa.nombre; // Mostrar el nombre de la empresa
            listaFavoritos.appendChild(li);
          });
        } else {
          alert(result.error || "Error al obtener los favoritos");
        }
      } catch (error) {
        console.error("Error en la carga de favoritos:", error);
        alert("Hubo un problema con el servidor");
      }
    }
  
    // Cargar los favoritos al iniciar la página
    cargarFavoritos();
  });
  