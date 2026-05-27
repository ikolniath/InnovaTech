//Este middleware registra cada peticion junto con su tiempo de respuesta final
function loggerMiddleware(req, res, next) {
  const inicio = Date.now();

  //Cuando la respuesta termina, calculo la duracion y la escribo en consola
  res.on('finish', () => {
    const duracion = Date.now() - inicio;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duracion}ms`);
  });

  next();
}

//Exportamos el logger para conectarlo globalmente en la aplicacion
module.exports = loggerMiddleware;
