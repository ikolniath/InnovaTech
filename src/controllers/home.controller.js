//Controlador simple para renderizar la portada principal del sistema
function mostrarInicio(req, res) {
  res.status(200).render('index', {
    pageTitle: 'Panel de gestion | InnovaTech',
    titulo: 'Panel de gestion de pedidos',
    subtitulo: 'Administra pedidos de planta, sucursales y franquicias desde un unico espacio de trabajo.'
  });
}

//Exportamos la funcion para conectarla con la ruta principal
module.exports = {
  mostrarInicio
};
