//Importamos mongoose para poder hacer la conexion con MongoDB
const mongoose = require('mongoose');

//Creamos la funcion que se encarga de abrir la conexion principal con la base de datos
async function connectDB() {
  //Valido si existe la variable MONGO_URI antes de intentar conectar con MongoDB
  if (!process.env.MONGO_URI) {
    throw new Error('La variable MONGO_URI es obligatoria para conectarse a MongoDB.');
  }

  //Si la variable existe, uso esa URL para conectarme
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Conexion a MongoDB establecida correctamente.');
}

//Exportamos la funcion para poder reutilizarla al iniciar la aplicacion o scripts
module.exports = connectDB;
