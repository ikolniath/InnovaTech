const ESTADOS_VALIDOS = ['pendiente', 'en producci\u00f3n', 'despachado', 'entregado'];

class Pedido {
  constructor({ id, producto, cantidad, cliente, estado = 'pendiente' }) {
    this.id = id === undefined ? null : Number(id);
    this.producto = typeof producto === 'string' ? producto.trim() : '';
    this.cantidad = Number(cantidad);
    this.cliente = typeof cliente === 'string' ? cliente.trim() : '';
    this.estado = typeof estado === 'string' ? estado.trim().toLowerCase() : '';
  }

  static obtenerEstadosValidos() {
    return [...ESTADOS_VALIDOS];
  }

  validarDatos() {
    const errores = [];

    if (this.id !== null && (!Number.isInteger(this.id) || this.id <= 0)) {
      errores.push('El id debe ser un numero entero mayor a 0.');
    }

    if (!this.producto) {
      errores.push('El producto es obligatorio.');
    }

    if (!Number.isInteger(this.cantidad) || this.cantidad <= 0) {
      errores.push('La cantidad debe ser un numero entero mayor a 0.');
    }

    if (!this.cliente) {
      errores.push('El cliente es obligatorio.');
    }

    if (!ESTADOS_VALIDOS.includes(this.estado)) {
      errores.push(`El estado debe ser uno de los siguientes: ${ESTADOS_VALIDOS.join(', ')}.`);
    }

    return errores;
  }

  actualizarEstado(nuevoEstado) {
    const estadoNormalizado = typeof nuevoEstado === 'string' ? nuevoEstado.trim().toLowerCase() : '';

    if (!ESTADOS_VALIDOS.includes(estadoNormalizado)) {
      throw new Error(`Estado invalido. Estados permitidos: ${ESTADOS_VALIDOS.join(', ')}.`);
    }

    this.estado = estadoNormalizado;
    return this;
  }

  toJSON() {
    return {
      id: this.id,
      producto: this.producto,
      cantidad: this.cantidad,
      cliente: this.cliente,
      estado: this.estado
    };
  }
}

module.exports = Pedido;
