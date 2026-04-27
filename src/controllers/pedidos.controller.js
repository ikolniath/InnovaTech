const fs = require('fs');
const path = require('path');

const Pedido = require('../models/Pedido');

const pedidosPath = path.join(__dirname, '..', 'data', 'pedidos.json');

function asegurarArchivoPedidos() {
  if (!fs.existsSync(pedidosPath)) {
    fs.writeFileSync(pedidosPath, '[]', 'utf-8');
  }
}

function leerPedidos() {
  asegurarArchivoPedidos();

  const contenido = fs.readFileSync(pedidosPath, 'utf-8').trim();
  const pedidos = JSON.parse(contenido || '[]');

  if (!Array.isArray(pedidos)) {
    throw new Error('El archivo pedidos.json debe contener un arreglo.');
  }

  return pedidos;
}

function escribirPedidos(pedidos) {
  fs.writeFileSync(pedidosPath, JSON.stringify(pedidos, null, 2), 'utf-8');
}

function generarNuevoId(pedidos) {
  if (!pedidos.length) {
    return 1;
  }

  const ids = pedidos
    .map((pedido) => Number(pedido.id))
    .filter((id) => Number.isInteger(id) && id > 0);

  return (ids.length ? Math.max(...ids) : 0) + 1;
}

function obtenerIdDesdeParams(req) {
  return Number(req.params.id);
}

function obtenerPedidoPorId(pedidos, id) {
  return pedidos.find((pedido) => pedido.id === id);
}

function responderErrorInterno(res, error) {
  console.error('Error interno en pedidos.controller:', error.message);

  return res.status(500).json({
    ok: false,
    mensaje: 'Ocurrio un error interno al procesar la solicitud.'
  });
}

function renderizarInicio(req, res) {
  try {
    const pedidos = leerPedidos();

    return res.status(200).render('index', {
      titulo: 'Panificadora Industrial',
      subtitulo: 'Seguimiento de pedidos entre planta, sucursales y franquicias',
      pedidos
    });
  } catch (error) {
    console.error('Error al renderizar la vista principal:', error.message);

    return res.status(500).send('No se pudo cargar la vista principal.');
  }
}

function obtenerTodos(req, res) {
  try {
    const pedidos = leerPedidos();

    return res.status(200).json({
      ok: true,
      data: pedidos
    });
  } catch (error) {
    return responderErrorInterno(res, error);
  }
}

function obtenerPorId(req, res) {
  try {
    const id = obtenerIdDesdeParams(req);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El id debe ser un numero entero mayor a 0.'
      });
    }

    const pedidos = leerPedidos();
    const pedido = obtenerPedidoPorId(pedidos, id);

    if (!pedido) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pedido no encontrado.'
      });
    }

    return res.status(200).json({
      ok: true,
      data: pedido
    });
  } catch (error) {
    return responderErrorInterno(res, error);
  }
}

function crearPedido(req, res) {
  try {
    const pedidos = leerPedidos();
    const nuevoPedido = new Pedido({
      id: generarNuevoId(pedidos),
      producto: req.body.producto,
      cantidad: req.body.cantidad,
      cliente: req.body.cliente,
      estado: req.body.estado || 'pendiente'
    });

    const errores = nuevoPedido.validarDatos();

    if (errores.length) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    pedidos.push(nuevoPedido.toJSON());
    escribirPedidos(pedidos);

    return res.status(201).json({
      ok: true,
      mensaje: 'Pedido creado correctamente.',
      data: nuevoPedido.toJSON()
    });
  } catch (error) {
    return responderErrorInterno(res, error);
  }
}

function actualizarPedido(req, res) {
  try {
    const id = obtenerIdDesdeParams(req);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El id debe ser un numero entero mayor a 0.'
      });
    }

    const pedidos = leerPedidos();
    const indicePedido = pedidos.findIndex((pedido) => pedido.id === id);

    if (indicePedido === -1) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pedido no encontrado.'
      });
    }

    const pedidoActualizado = new Pedido({
      ...pedidos[indicePedido],
      ...req.body,
      id
    });

    if (req.body.estado !== undefined) {
      pedidoActualizado.actualizarEstado(req.body.estado);
    }

    const errores = pedidoActualizado.validarDatos();

    if (errores.length) {
      return res.status(400).json({
        ok: false,
        errores
      });
    }

    pedidos[indicePedido] = pedidoActualizado.toJSON();
    escribirPedidos(pedidos);

    return res.status(200).json({
      ok: true,
      mensaje: 'Pedido actualizado correctamente.',
      data: pedidoActualizado.toJSON()
    });
  } catch (error) {
    if (error.message.startsWith('Estado invalido')) {
      return res.status(400).json({
        ok: false,
        mensaje: error.message
      });
    }

    return responderErrorInterno(res, error);
  }
}

function eliminarPedido(req, res) {
  try {
    const id = obtenerIdDesdeParams(req);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El id debe ser un numero entero mayor a 0.'
      });
    }

    const pedidos = leerPedidos();
    const pedido = obtenerPedidoPorId(pedidos, id);

    if (!pedido) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pedido no encontrado.'
      });
    }

    const pedidosActualizados = pedidos.filter((item) => item.id !== id);
    escribirPedidos(pedidosActualizados);

    return res.status(200).json({
      ok: true,
      mensaje: 'Pedido eliminado correctamente.',
      data: pedido
    });
  } catch (error) {
    return responderErrorInterno(res, error);
  }
}

module.exports = {
  renderizarInicio,
  obtenerTodos,
  obtenerPorId,
  crearPedido,
  actualizarPedido,
  eliminarPedido
};
