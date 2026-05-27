//Importamos el modelo Usuario y las utilidades que nos ayudan con errores y respuestas JSON
const Usuario = require('../models/Usuario');
const asyncHandler = require('../utils/asyncHandler');
const expectsJson = require('../utils/expectsJson');

//Renderizo la vista del login con el formulario vacio
const mostrarLogin = (req, res) => {
  res.status(200).render('login', {
    pageTitle: 'Acceso | InnovaTech',
    titulo: 'Iniciar sesion',
    errorMessage: null,
    formData: {
      email: ''
    }
  });
};

//Proceso el login del usuario y valido sus credenciales
const login = asyncHandler(async (req, res) => {
  //Normalizo los datos del formulario para comparar siempre con el mismo formato
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';

  //Si faltan datos obligatorios corto el flujo y devuelvo el mensaje correspondiente
  if (!email || !password) {
    if (expectsJson(req)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Email y password son obligatorios.'
      });
    }

    return res.status(400).render('login', {
      pageTitle: 'Acceso | InnovaTech',
      titulo: 'Iniciar sesion',
      errorMessage: 'Completa el email y la contrasena para continuar.',
      formData: { email }
    });
  }

  //Busco el usuario por email para validar el acceso
  const usuario = await Usuario.findOne({ email });

  //Si el usuario no existe o la contrasena no coincide, muestro error de autenticacion
  if (!usuario || !(await usuario.comparePassword(password))) {
    if (expectsJson(req)) {
      return res.status(401).json({
        ok: false,
        mensaje: 'Credenciales invalidas.'
      });
    }

    return res.status(401).render('login', {
      pageTitle: 'Acceso | InnovaTech',
      titulo: 'Iniciar sesion',
      errorMessage: 'No pudimos validar tus credenciales. Revisa los datos e intentalo nuevamente.',
      formData: { email }
    });
  }

  //Guardo en sesion solo los datos minimos que necesito durante la navegacion
  req.session.user = {
    id: usuario._id.toString(),
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };

  //Dejo un mensaje flash para mostrar al usuario en la siguiente vista
  req.session.flash = {
    type: 'success',
    message: `Bienvenido nuevamente, ${usuario.nombre}.`
  };

  //Si la peticion espera JSON, respondo con los datos de la sesion creada
  if (expectsJson(req)) {
    return res.status(200).json({
      ok: true,
      data: req.session.user
    });
  }

  //Si fue un formulario web, redirijo al panel de pedidos
  return res.redirect('/pedidos');
});

//Cierro la sesion actual y limpio la cookie del navegador
function logout(req, res, next) {
  req.session.destroy((error) => {
    //Si falla el cierre de sesion, delego el error al middleware central
    if (error) {
      return next(error);
    }

    //Elimino la cookie de sesion para completar el logout
    res.clearCookie('connect.sid');

    //Mantengo compatibilidad con respuestas JSON si la peticion la necesita
    if (expectsJson(req)) {
      return res.status(200).json({
        ok: true,
        mensaje: 'Sesion cerrada correctamente.'
      });
    }

    //Si fue una navegacion normal, lo devuelvo al login
    return res.redirect('/auth/login');
  });
}

//Exportamos las acciones del controlador para usarlas en las rutas de autenticacion
module.exports = {
  mostrarLogin,
  login,
  logout
};
