const { Expedientes, TipoExpediente, Estado } = require('../models');
const { Op } = require('sequelize');

const getTipoId = async (tipoNombre) => {
  console.log('Buscando tipo:', tipoNombre);
  const tipo = await TipoExpediente.findOne({ where: { nombreTipo: tipoNombre } });
  console.log('Resultado:', tipo);
  if (!tipo) throw new Error('Tipo de expediente inválido');
  return tipo.idTipo;
};

exports.getExpedientes = async (req, res) => {
  try {
    const { tipo } = req.params;
    const idTipo = await getTipoId(tipo);
    const expedientes = await Expedientes.findAll({
      where: {
        idTipo,
        idUsuario: req.user.idUsuario,
      }
    });
    res.json(expedientes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllExpedientes = async (req, res) => {
  try {
    // Esta función no filtra por usuario, se usa solo si el usuario tiene permisos especiales
    const expedientes = await Expedientes.findAll();
    res.json(expedientes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Ya no hay versión sin filtro de usuario para getExpedienteByTipoYId
// Obtener expediente por tipo e id, solo si es del usuario autenticado
exports.getExpedienteByTipoYId = async (req, res) => {
  try {
    const { tipo, id } = req.params;

    if (!tipo) {
      return res.status(400).json({ error: 'Tipo es obligatorio' });
    }

    const idTipo = await getTipoId(tipo);
    const idUsuario = req.user.idUsuario;

    const expediente = await Expedientes.findOne({
      where: {
        idExpediente: id,
        idTipo,
        idUsuario,
      }
    });

    if (!expediente) {
      return res.status(404).json({ error: 'Expediente no encontrado o no autorizado' });
    }

    res.json(expediente);
  } catch (error) {
    console.error('Error en getExpedienteByTipoYId:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.getExpedientesDelUsuario = async (req, res) => {
  try {
    const { tipo } = req.params;
    const idUsuario = req.user.idUsuario;

    if (!tipo) return res.status(400).json({ error: 'Tipo es obligatorio' });

   const tipoExpediente = await TipoExpediente.findOne({ where: { nombreTipo: tipo } });
    if (!tipoExpediente) {
      return res.status(400).json({ error: 'Tipo no válido' });
    }

    // Consultar expedientes para ese usuario y tipo
    const expedientes = await Expedientes.findAll({
      where: {
        idUsuario,
        idTipo: tipoExpediente.idTipo,
      }
    });

    return res.json(expedientes);

  } catch (error) {
    console.error('Error en getExpedientesDelUsuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.crearExpedienteParaUsuario = async (req, res) => {
  try {
    const { tipo } = req.params;
    if (!tipo) return res.status(400).json({ error: 'Tipo es obligatorio' });

    const idTipo = await getTipoId(tipo);
    const expedienteData = { ...req.body, idTipo, idUsuario: req.user.idUsuario };
    const nuevo = await Expedientes.create(expedienteData);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createExpediente = async (req, res) => {
  try {
    const { tipo } = req.params;
    const idTipo = await getTipoId(tipo);
    const expedienteData = { ...req.body, idTipo, idUsuario: req.user.idUsuario };
    const nuevo = await Expedientes.create(expedienteData);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    // Busca expediente y asegura que sea del usuario autenticado
    const expediente = await Expedientes.findOne({
      where: {
        idExpediente: id,
        idUsuario: req.user.idUsuario,
      }
    });

    if (!expediente) {
      return res.status(404).json({ error: 'Expediente no encontrado o no autorizado' });
    }

    const ahora = new Date();
    const ultimaActualizacion = new Date(expediente.updatedAt);
    const diferenciaEnMs = ahora - ultimaActualizacion;
    const diferenciaEnDias = diferenciaEnMs / (1000 * 60 * 60 * 24);

    if (diferenciaEnDias > 5 && expediente.idEstado !== 4) {
      req.body.idEstado = 3;
    }

    await expediente.update(req.body);

    res.json({
      mensaje: 'Expediente actualizado correctamente',
      expediente
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.deleteExpediente = async (req, res) => {
  const { id } = req.params;
  try {
    const expediente = await Expedientes.findOne({
      where: {
        idExpediente: id,
        idUsuario: req.user.idUsuario, // Solo si pertenece al usuario logueado
      },
    });

    if (!expediente) return res.status(404).json({ error: 'No encontrado o no autorizado' });

    await expediente.destroy(); // 💥 Eliminación física

    res.json({ mensaje: 'Expediente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updateAtrasados = async (req, res) => {
  try {
    const { tipo } = req.params;
    const idTipo = await getTipoId(tipo);
    console.log('Tipo:', tipo, 'idTipo:', idTipo);

    // Para prueba: 10 segundos atrás
    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);
    //  const limite = new Date(Date.now() - 10 * 1000);
    console.log('Fecha límite para atraso:', sieteDiasAtras);

    const pendientes = await Expedientes.count({
      where: {
        idTipo,
        fechaActualizacion: { [Op.lt]: sieteDiasAtras },
        idEstado: 1
      }
    });
    console.log(`Expedientes pendientes a actualizar: ${pendientes}`);

    if (pendientes > 0) {
      await Expedientes.update(
        { idEstado: 3, fechaActualizacion: new Date() },
        {
          where: {
            idTipo,
            fechaActualizacion: { [Op.lt]: sieteDiasAtras },
            idEstado: 1,
          }
        }
      );
      console.log('Estados actualizados a Atrasado');
      res.json({ mensaje: 'Estados actualizados a Atrasado' });
    } else {
      console.log('No hay expedientes para actualizar');
      res.json({ mensaje: 'No hay expedientes para actualizar' });
    }
  } catch (error) {
    console.error('Error en updateAtrasados:', error);
    res.status(400).json({ error: error.message });
  }
};



exports.finalizarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const expediente = await Expedientes.findOne({
      where: {
        idExpediente: id,
        idUsuario: req.user.idUsuario,
      }
    });

    if (!expediente) return res.status(404).json({ error: 'Expediente no encontrado o no autorizado' });

    await expediente.update({ idEstado: 4 });
    res.json({ mensaje: 'Expediente finalizado correctamente', expediente });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
