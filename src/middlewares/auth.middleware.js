//Importamos la utilidad que detecta si la peticion espera JSON
const expectsJson = require('../utils/expectsJson');

//Este middleware pasa los datos de sesion a res.locals para usarlos en las vistas
function attachSessionData(req, res, next) {
  res.locals.usuario = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.flash = req.session.flash || null;

  //Borro el flash despues de exponerlo para que se muestre una sola vez
  delete req.session.flash;

  next();
}

//Protejo las rutas privadas para que solo entren usuarios autenticados
function requireAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }

  //Si la peticion es JSON devuelvo un 401 en vez de redirigir
  if (expectsJson(req)) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Debes iniciar sesion para acceder a este recurso.'
    });
  }

  //Si fue una navegacion web guardo un aviso y lo mando al login
  req.session.flash = {
    type: 'warning',
    message: 'Necesitas iniciar sesion para acceder al panel de pedidos.'
  };

  return res.redirect('/auth/login');
}

//Evito que un usuario logueado vuelva a entrar al formulario de login
function redirectIfAuthenticated(req, res, next) {
  if (!req.session.user) {
    return next();
  }

  return res.redirect('/pedidos');
}

//Exportamos los middlewares para poder reutilizarlos en distintas rutas
module.exports = {
  attachSessionData,
  requireAuth,
  redirectIfAuthenticated
};
