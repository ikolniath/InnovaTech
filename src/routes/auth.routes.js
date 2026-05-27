//Importamos express, el controlador de autenticacion y el middleware que evita volver al login si ya hay sesion
const express = require('express');

const authController = require('../controllers/auth.controller');
const { redirectIfAuthenticated } = require('../middlewares/auth.middleware');

//Creo el router para agrupar todas las rutas relacionadas con autenticacion
const router = express.Router();

//Defino las rutas de login y logout sin cambiar la logica existente
router.get('/login', redirectIfAuthenticated, authController.mostrarLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.post('/logout', authController.logout);

//Exportamos el router para conectarlo desde app.js
module.exports = router;
