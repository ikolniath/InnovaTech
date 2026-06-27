//Importamos el modelo de pedidos, el service y las utilidades compartidas
const Pedido = require('../models/Pedido');
const { emitPedidoEvent } = require('../config/socket');
const pedidosService = require('../services/pedidos.service');
const asyncHandler = require('../utils/asyncHandler');
const expectsJson = require('../utils/expectsJson');

//Esta funcion me devuelve la lista de estados permitidos para los formularios
function obtenerEstados() {
  return Pedido.ESTADOS_VALIDOS;
}

//Armo un objeto base con los datos del formulario para volver a pintarlos si hay errores
function construirPedidoDesdeBody(body, id) {
  return {
    _id: id,
    producto: body.producto || '',
    cantidad: body.cantidad || '',
    cliente: body.cliente || '',
    estado: body.estado || 'pendiente'
  };
}

//Centralizo la respuesta de validacion para no repetir la misma logica en crear y editar
function responderValidacion(req, res, vista, datosVista) {
  if (expectsJson(req)) {
    return res.status(400).json({
      ok: false,
      errores: req.validationErrors
    });
  }

  return res.status(400).render(vista, datosVista);
}

//Listado principal de pedidos, compatible con vista HTML y respuesta JSON
const listarPedidos = asyncHandler(async (req, res) => {
  const pedidos = await pedidosService.listarPedidos();

  if (expectsJson(req)) {
    return res.status(200).json({
      ok: true,
      data: pedidos
    });
  }

  return res.status(200).render('pedidos', {
    pageTitle: 'Pedidos | InnovaTech',
    titulo: 'Panel de pedidos',
    pedidos
  });
});

//Muestro el formulario vacio para registrar un nuevo pedido
const mostrarFormularioCrear = asyncHandler(async (req, res) => {
  res.status(200).render('crearPedido', {
    pageTitle: 'Registrar pedido | InnovaTech',
    titulo: 'Registrar nuevo pedido',
    pedido: {
      producto: '',
      cantidad: '',
      cliente: '',
      estado: 'pendiente'
    },
    estados: obtenerEstados(),
    errores: []
  });
});

//Creo el pedido en MongoDB si no hubo errores de validacion previos
const crearPedido = asyncHandler(async (req, res) => {
  if (req.validationErrors.length) {
    return responderValidacion(req, res, 'crearPedido', {
      pageTitle: 'Registrar pedido | InnovaTech',
      titulo: 'Registrar nuevo pedido',
      pedido: construirPedidoDesdeBody(req.body),
      estados: obtenerEstados(),
      errores: req.validationErrors
    });
  }

  const pedidoCreado = await pedidosService.crearPedido(req.pedidoPayload);
  emitPedidoEvent('pedido:creado', pedidoCreado);

  if (expectsJson(req)) {
    return res.status(201).json({
      ok: true,
      data: pedidoCreado
    });
  }

  //Dejo el mensaje de exito para mostrarlo en la vista siguiente
  req.session.flash = {
    type: 'success',
    message: 'El pedido se registro correctamente.'
  };

  return res.redirect(`/pedidos/${pedidoCreado._id}`);
});

//Muestro el detalle de un pedido puntual
const verPedido = asyncHandler(async (req, res) => {
  const pedido = await pedidosService.obtenerPedidoPorId(req.params.id);

  if (expectsJson(req)) {
    return res.status(200).json({
      ok: true,
      data: pedido
    });
  }

  return res.status(200).render('verPedido', {
    pageTitle: 'Detalle del pedido | InnovaTech',
    titulo: 'Detalle del pedido',
    pedido
  });
});

//Busco el pedido y cargo sus datos en el formulario de edicion
const mostrarFormularioEditar = asyncHandler(async (req, res) => {
  const pedido = await pedidosService.obtenerPedidoPorId(req.params.id);

  res.status(200).render('editarPedido', {
    pageTitle: 'Actualizar pedido | InnovaTech',
    titulo: 'Actualizar pedido',
    pedido,
    estados: obtenerEstados(),
    errores: []
  });
});

//Actualizo el pedido si la validacion previa no encontro errores
const actualizarPedido = asyncHandler(async (req, res) => {
  if (req.validationErrors.length) {
    return responderValidacion(req, res, 'editarPedido', {
      pageTitle: 'Actualizar pedido | InnovaTech',
      titulo: 'Actualizar pedido',
      pedido: construirPedidoDesdeBody(req.body, req.params.id),
      estados: obtenerEstados(),
      errores: req.validationErrors
    });
  }

  const pedidoActualizado = await pedidosService.actualizarPedido(req.params.id, req.pedidoPayload);
  emitPedidoEvent('pedido:actualizado', pedidoActualizado);

  if (expectsJson(req)) {
    return res.status(200).json({
      ok: true,
      data: pedidoActualizado
    });
  }

  //Guardo un flash para confirmar que los cambios se guardaron bien
  req.session.flash = {
    type: 'success',
    message: 'Los cambios del pedido se guardaron correctamente.'
  };

  return res.redirect(`/pedidos/${pedidoActualizado._id}`);
});

//Elimino el pedido seleccionado y devuelvo al listado o a JSON segun corresponda
const eliminarPedido = asyncHandler(async (req, res) => {
  const pedidoEliminado = await pedidosService.eliminarPedido(req.params.id);
  emitPedidoEvent('pedido:eliminado', pedidoEliminado);

  if (expectsJson(req)) {
    return res.status(200).json({
      ok: true,
      data: pedidoEliminado
    });
  }

  req.session.flash = {
    type: 'success',
    message: 'El pedido se elimino correctamente.'
  };

  return res.redirect('/pedidos');
});

//Exportamos todas las acciones del modulo para conectarlas con las rutas
module.exports = {
  listarPedidos,
  mostrarFormularioCrear,
  crearPedido,
  verPedido,
  mostrarFormularioEditar,
  actualizarPedido,
  eliminarPedido
};
