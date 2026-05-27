//Esta funcion detecta si la peticion espera una respuesta JSON en lugar de HTML
function expectsJson(req) {
  const accept = req.get('accept') || '';

  return req.query.format === 'json'
    || req.originalUrl.startsWith('/api/')
    || req.is('application/json')
    || (accept.includes('application/json') && !accept.includes('text/html'));
}

//Exportamos la utilidad para reutilizarla en controladores y middlewares
module.exports = expectsJson;
