//Importamos mongoose para definir el schema y el modelo de pedidos
const mongoose = require('mongoose');

//Dejo centralizados los estados validos para reutilizarlos en varios puntos del proyecto
const ESTADOS_VALIDOS = ['pendiente', 'en producci\u00f3n', 'despachado', 'entregado'];

//Defino la estructura del pedido y sus validaciones principales
const pedidoSchema = new mongoose.Schema({
  producto: {
    type: String,
    required: [true, 'El producto es obligatorio.'],
    trim: true,
    minlength: [2, 'El producto debe tener al menos 2 caracteres.']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria.'],
    min: [1, 'La cantidad debe ser mayor a 0.']
  },
  cliente: {
    type: String,
    required: [true, 'El cliente es obligatorio.'],
    trim: true,
    minlength: [2, 'El cliente debe tener al menos 2 caracteres.']
  },
  estado: {
    type: String,
    enum: {
      values: ESTADOS_VALIDOS,
      message: 'El estado indicado no es valido.'
    },
    default: 'pendiente'
  }
}, {
  //Activo timestamps y les doy nombres mas claros para este proyecto
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  },
  versionKey: false
});

//Creo el modelo de Mongoose a partir del schema anterior
const Pedido = mongoose.model('Pedido', pedidoSchema);

//Agrego los estados validos al modelo para poder reutilizarlos fuera del schema
Pedido.ESTADOS_VALIDOS = ESTADOS_VALIDOS;

//Exportamos el modelo para usarlo en servicios, middlewares y controladores
module.exports = Pedido;
