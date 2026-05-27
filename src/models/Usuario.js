//Importamos bcrypt para encriptar passwords y mongoose para definir el modelo
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

//Defino la cantidad de rondas para generar el hash del password
const SALT_ROUNDS = 10;

//Creo el schema del usuario con los campos basicos del login
const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio.'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio.']
  },
  rol: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  }
}, {
  timestamps: true,
  versionKey: false
});

//Antes de guardar, hasheo el password solo si fue modificado
usuarioSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  return next();
});

//Creo un metodo para comparar la contrasena plana con el hash guardado
usuarioSchema.methods.comparePassword = function comparePassword(passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password);
};

//Exportamos el modelo para usarlo en login y seed del admin
module.exports = mongoose.model('Usuario', usuarioSchema);
