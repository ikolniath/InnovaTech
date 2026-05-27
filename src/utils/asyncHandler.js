//Con esta utilidad evito repetir try/catch en cada controlador asincronico
function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

//Exportamos la funcion para envolver controladores asincronicos
module.exports = asyncHandler;
