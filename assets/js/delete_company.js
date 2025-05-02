async function borrarEmpresa(idEmpresa, token) {
    try {
      const response = await fetch(`/api/empresas/${idEmpresa}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Empresa borrada correctamente");
        console.log(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al borrar empresa:", error);
    }
  }
  