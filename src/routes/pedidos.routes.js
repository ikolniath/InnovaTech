//Importamos express, el controlador de pedidos y los middlewares de auth y validacion
const express = require('express');

const pedidosController = require('../controllers/pedidos.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const validarPedido = require('../middlewares/validarPedido.middleware');

//Creo el router para agrupar todas las rutas del modulo de pedidos
const router = express.Router();

//Protejo todo este bloque para que solo entren usuarios logueados
router.use(requireAuth);

//Mantengo el CRUD completo y las rutas auxiliares de formularios sin cambiar endpoints
router.get('/', pedidosController.listarPedidos);
router.get('/nuevo', pedidosController.mostrarFormularioCrear);
router.post('/', validarPedido, pedidosController.crearPedido);
router.get('/:id/editar', pedidosController.mostrarFormularioEditar);
router.post('/:id/editar', validarPedido, pedidosController.actualizarPedido);
router.post('/:id/eliminar', pedidosController.eliminarPedido);
router.get('/:id', pedidosController.verPedido);
router.put('/:id', validarPedido, pedidosController.actualizarPedido);
router.delete('/:id', pedidosController.eliminarPedido);

//Exportamos el router para usarlo desde app.js
module.exports = router;
