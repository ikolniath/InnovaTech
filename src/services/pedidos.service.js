//Importamos mongoose para validar ObjectId y el modelo Pedido para consultar la base
const mongoose = require('mongoose');

const Pedido = require('../models/Pedido');
const AppError = require('../utils/AppError');

//Valido el formato del id antes de hacer consultas a MongoDB
function validarObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('El id del pedido no es valido.', 400);
  }
}

//Devuelvo todos los pedidos ordenados desde el mas reciente al mas antiguo
async function listarPedidos() {
  return Pedido.find().sort({ fechaCreacion: -1 }).lean();
}

//Creo un nuevo pedido y devuelvo el objeto ya listo para usar en vistas o JSON
async function crearPedido(data) {
  const pedido = await Pedido.create(data);
  return pedido.toObject();
}

//Busco un pedido por id y corto el flujo si no existe
async function obtenerPedidoPorId(id) {
  validarObjectId(id);

  const pedido = await Pedido.findById(id).lean();

  if (!pedido) {
    throw new AppError('Pedido no encontrado.', 404);
  }

  return pedido;
}

//Actualizo un pedido existente manteniendo las validaciones del schema
async function actualizarPedido(id, data) {
  validarObjectId(id);

  const pedido = await Pedido.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    lean: true
  });

  if (!pedido) {
    throw new AppError('Pedido no encontrado.', 404);
  }

  return pedido;
}

//Elimino un pedido por id y devuelvo el registro borrado
async function eliminarPedido(id) {
  validarObjectId(id);

  const pedido = await Pedido.findByIdAndDelete(id);

  if (!pedido) {
    throw new AppError('Pedido no encontrado.', 404);
  }

  return pedido.toObject();
}

//Exportamos todas las operaciones para que el controlador no consulte Mongo directamente
module.exports = {
  listarPedidos,
  crearPedido,
  obtenerPedidoPorId,
  actualizarPedido,
  eliminarPedido
};
