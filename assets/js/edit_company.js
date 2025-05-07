async function editarEmpresa(idEmpresa, nuevaData, token) {
    try {
      const response = await fetch(`/api/empresas/${idEmpresa}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(nuevaData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Empresa editada correctamente");
        console.log(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al editar empresa:", error);
    }
  }
  