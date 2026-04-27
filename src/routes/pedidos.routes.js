const express = require('express');

const pedidosController = require('../controllers/pedidos.controller');
const validarPedido = require('../middleware/validarPedido');

const router = express.Router();

router.route('/')
  .get(pedidosController.obtenerTodos)
  .post(validarPedido, pedidosController.crearPedido);

router.route('/:id')
  .get(pedidosController.obtenerPorId)
  .put(pedidosController.actualizarPedido)
  .delete(pedidosController.eliminarPedido);

module.exports = router;
