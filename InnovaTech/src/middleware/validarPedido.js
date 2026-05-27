const Pedido = require('../models/Pedido');

function validarPedido(req, res, next) {
  const pedido = new Pedido({
    producto: req.body.producto,
    cantidad: req.body.cantidad,
    cliente: req.body.cliente,
    estado: req.body.estado || 'pendiente'
  });

  const errores = pedido.validarDatos().filter((error) => {
    return error !== 'El id debe ser un numero entero mayor a 0.';
  });

  if (errores.length) {
    return res.status(400).json({
      ok: false,
      errores
    });
  }

  next();
}

module.exports = validarPedido;
