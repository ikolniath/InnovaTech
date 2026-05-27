//Importamos express y el controlador que renderiza la pagina principal
const express = require('express');

const homeController = require('../controllers/home.controller');

//Creo el router de la portada
const router = express.Router();

//Esta ruta muestra la vista de inicio del sistema
router.get('/', homeController.mostrarInicio);

//Exportamos el router para usarlo en app.js
module.exports = router;
