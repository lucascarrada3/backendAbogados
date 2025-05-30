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
    const expedientes = await Expedientes.findAll({ where: { idTipo } });
    res.json(expedientes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getExpedienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const expediente = await Expedientes.findByPk(id);
    if (!expediente) return res.status(404).json({ error: 'Expediente no encontrado' });
    res.json(expediente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createExpediente = async (req, res) => {
  try {
    const { tipo } = req.params;
    const idTipo = await getTipoId(tipo);
    const expedienteData = { ...req.body, idTipo };
    const nuevo = await Expedientes.create(expedienteData);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const expediente = await Expedientes.findByPk(id);

    if (!expediente) {
      return res.status(404).json({ error: 'Expediente no encontrado' });
    }

    // Calcular diferencia de días desde la última actualización
    const ahora = new Date();
    const ultimaActualizacion = new Date(expediente.updatedAt);
    const diferenciaEnMs = ahora - ultimaActualizacion;
    const diferenciaEnDias = diferenciaEnMs / (1000 * 60 * 60 * 24);

    // Si pasaron más de 5 días, marcar como "Atrasado"
    if (diferenciaEnDias > 5 && expediente.idEstado !== 4) { // 4 = Finalizado
      req.body.idEstado = 3; // 3 = Atrasado
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
  try {
    const { id } = req.params;
    const expediente = await Expedientes.findByPk(id);
    if (!expediente) return res.status(404).json({ error: 'Expediente no encontrado' });
    await expediente.destroy();
    res.json({ mensaje: 'Expediente eliminado correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateAtrasados = async (req, res) => {
  try {
    const { tipo } = req.params;
    const idTipo = await getTipoId(tipo);

    const sieteDiasAtras = new Date();
    sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);

    await Expedientes.update(
      { idEstado: 3 },
      {
        where: {
          idTipo,
          fechaActualizacion: { [Op.lt]: sieteDiasAtras },
          idEstado: { [Op.ne]: 4 }
        }
      }
    );

    res.json({ mensaje: 'Estados actualizados a Atrasado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.finalizarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const expediente = await Expedientes.findByPk(id);
    if (!expediente) return res.status(404).json({ error: 'Expediente no encontrado' });

    await expediente.update({ idEstado: 4 });
    res.json({ mensaje: 'Expediente finalizado correctamente', expediente });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
