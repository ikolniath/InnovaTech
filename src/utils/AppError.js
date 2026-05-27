//Esta clase me permite crear errores controlados con codigo HTTP y tipo asociado
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    //Guardo el stack desde esta clase para que el error sea mas facil de rastrear
    Error.captureStackTrace(this, this.constructor);
  }
}

//Exportamos la clase para reutilizarla en services y middlewares
module.exports = AppError;
