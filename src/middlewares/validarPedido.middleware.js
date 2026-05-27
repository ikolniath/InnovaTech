//Importamos el modelo para reutilizar la lista de estados validos
const Pedido = require('../models/Pedido');

//Esta funcion valida textos simples y guarda los mensajes en el arreglo de errores
function validarTexto(campo, valor, etiqueta, errores) {
  if (!valor) {
    errores.push(`El campo ${etiqueta} es obligatorio.`);
    return;
  }

  if (valor.length < 2) {
    errores.push(`El campo ${etiqueta} debe tener al menos 2 caracteres.`);
  }
}

//Valido los datos basicos del pedido antes de llegar al controlador
function validarPedido(req, res, next) {
  const errores = [];
  const esActualizacionParcial = req.method === 'PUT';
  const producto = typeof req.body.producto === 'string' ? req.body.producto.trim() : undefined;
  const cliente = typeof req.body.cliente === 'string' ? req.body.cliente.trim() : undefined;
  const estado = typeof req.body.estado === 'string' ? req.body.estado.trim().toLowerCase() : undefined;
  const cantidadRecibida = req.body.cantidad;

  //Voy armando este payload limpio para usarlo despues en el controlador
  const payload = {};

  if (!esActualizacionParcial || producto !== undefined) {
    validarTexto('producto', producto, 'producto', errores);
    payload.producto = producto;
  }

  if (!esActualizacionParcial || cliente !== undefined) {
    validarTexto('cliente', cliente, 'cliente', errores);
    payload.cliente = cliente;
  }

  if (!esActualizacionParcial || cantidadRecibida !== undefined) {
    const cantidad = Number(cantidadRecibida);

    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      errores.push('El campo cantidad es obligatorio y debe ser mayor a 0.');
    } else {
      payload.cantidad = cantidad;
    }
  }

  //Si llega estado, compruebo que sea uno de los valores permitidos
  if (estado !== undefined && estado !== '') {
    if (!Pedido.ESTADOS_VALIDOS.includes(estado)) {
      errores.push(`El estado debe ser uno de los siguientes: ${Pedido.ESTADOS_VALIDOS.join(', ')}.`);
    } else {
      payload.estado = estado;
    }
  } else if (!esActualizacionParcial) {
    payload.estado = 'pendiente';
  }

  //En actualizaciones parciales me aseguro de que al menos llegue un dato util
  if (esActualizacionParcial && Object.keys(payload).length === 0) {
    errores.push('Debes enviar al menos un campo valido para actualizar.');
  }

  //Guardo errores y payload en la request para reutilizarlos mas adelante
  req.validationErrors = errores;
  req.pedidoPayload = payload;

  next();
}

//Exportamos el middleware para usarlo en crear y actualizar pedidos
module.exports = validarPedido;
