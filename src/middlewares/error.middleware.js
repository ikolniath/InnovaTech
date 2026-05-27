//Importamos la clase de error propia y la utilidad para detectar respuestas JSON
const AppError = require('../utils/AppError');
const expectsJson = require('../utils/expectsJson');

//Genero un error 404 controlado cuando ninguna ruta coincide
function notFoundHandler(req, res, next) {
  next(new AppError('Ruta no encontrada.', 404));
}

//Transformo errores comunes de Mongoose en mensajes mas claros para la app
function normalizarError(err) {
  if (err.name === 'CastError') {
    return new AppError('El identificador indicado no es valido.', 400);
  }

  if (err.name === 'ValidationError') {
    const mensaje = Object.values(err.errors)
      .map((item) => item.message)
      .join(' ');

    return new AppError(mensaje || 'Error de validacion.', 400);
  }

  if (err.code === 11000) {
    return new AppError('Ya existe un registro con un valor unico duplicado.', 400);
  }

  return err;
}

//Este middleware central define si devolvemos JSON o una vista HTML de error
function errorHandler(err, req, res, next) {
  const error = normalizarError(err);
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Ocurrio un error interno.';

  if (expectsJson(req)) {
    return res.status(statusCode).json({
      ok: false,
      mensaje: message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
  }

  return res.status(statusCode).render('error', {
    pageTitle: 'Error | InnovaTech',
    titulo: 'No fue posible completar la solicitud',
    statusCode,
    mensaje: message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack
  });
}

//Exportamos ambos middlewares para usarlos al final de app.js
module.exports = {
  notFoundHandler,
  errorHandler
};
