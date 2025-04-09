const db = require('../config/db');

// Registrar empresa
exports.registrarEmpresa = (req, res) => {
  const { nombre, estado, ciudad, ubicacion, sector, carrera_destino, plazas_disponibles, idAdministrativo } = req.body;

  const query = 'INSERT INTO empresas (nombre, estado, ciudad, ubicacion, sector, carrera_destino, plazas_disponibles, idAdministrativo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [nombre, estado, ciudad, ubicacion, sector, carrera_destino, plazas_disponibles, idAdministrativo], (err, result) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al registrar la empresa', error: err });
    }
    res.status(201).json({
      mensaje: 'Empresa registrada exitosamente',
      empresa: { 
        id: result.insertId, 
        nombre, 
        estado, 
        ciudad, 
        ubicacion, 
        sector, 
        carrera_destino, 
        plazas_disponibles, 
        idAdministrativo
      }
    });
  });
};

// Editar información de empresa (con campos específicos)
exports.editarEmpresa = (req, res) => {
  const { id } = req.params;
  const { nombre, estado, ciudad, ubicacion, sector, carrera_destino, plazas_disponibles, idAdministrativo } = req.body;

  let setClauses = [];
  let values = [];

  if (nombre) {
    setClauses.push('nombre = ?');
    values.push(nombre);
  }
  if (estado) {
    setClauses.push('estado = ?');
    values.push(estado);
  }
  if (ciudad) {
    setClauses.push('ciudad = ?');
    values.push(ciudad);
  }
  if (ubicacion) {
    setClauses.push('ubicacion = ?');
    values.push(ubicacion);
  }
  if (sector) {
    setClauses.push('sector = ?');
    values.push(sector);
  }
  if (carrera_destino) {
    setClauses.push('carrera_destino = ?');
    values.push(carrera_destino);
  }
  if (plazas_disponibles) {
    setClauses.push('plazas_disponibles = ?');
    values.push(plazas_disponibles);
  }
  if (idAdministrativo) {
    setClauses.push('idAdministrativo = ?');
    values.push(idAdministrativo);
  }

  if (setClauses.length === 0) {
    return res.status(400).json({ mensaje: 'No se proporcionaron datos para actualizar' });
  }

  values.push(id);

  const query = `UPDATE empresas SET ${setClauses.join(', ')} WHERE id = ?`;

  db.query(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al actualizar la empresa', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }
    res.status(200).json({
      mensaje: 'Empresa actualizada exitosamente',
      empresa: { id, nombre, estado, ciudad, ubicacion, sector, carrera_destino, plazas_disponibles, idAdministrativo }
    });
  });
};

// Eliminar empresa
exports.eliminarEmpresa = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM empresas WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ mensaje: 'Error al eliminar la empresa', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Empresa no encontrada' });
    }
    res.status(200).json({ mensaje: 'Empresa eliminada exitosamente' });
  });
};

