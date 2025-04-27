async function agregarEmpresa(empresaData, token) {
    try {
      const response = await fetch("/api/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(empresaData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Empresa agregada correctamente");
        console.log(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error al agregar empresa:", error);
    }
  }
  