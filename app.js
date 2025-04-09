if (!nombre || !estado || !ciudad || !ubicacion || !sector || !carrera_destino || !plazas_disponibles || !idAdministrativo) {
    return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
  }
  