//Importamos mongoose para cerrar la conexion al final del script
const mongoose = require('mongoose');

//Importamos dotenv para leer el .env y reutilizar la conexion principal de la app
const dotenv = require('dotenv');

const connectDB = require('../config/db');
const Usuario = require('../models/Usuario');

//Cargo las variables de entorno para usar la URL de MongoDB
dotenv.config({ quiet: true });

//Creo el script que genera el usuario administrador inicial si aun no existe
async function seedAdmin() {
  try {
    await connectDB();

    //Defino las credenciales base del admin local
    const email = 'admin@innovatech.com';
    const password = 'admin123';

    //Primero reviso si ya existe un administrador con ese email
    const adminExistente = await Usuario.findOne({ email });

    if (adminExistente) {
      console.log('El usuario administrador ya existe.');
      return;
    }

    //Si no existe, lo creo usando el mismo modelo que usa la aplicacion
    await Usuario.create({
      nombre: 'Administrador InnovaTech',
      email,
      password,
      rol: 'admin'
    });

    console.log('Usuario administrador creado correctamente.');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    //Si algo falla durante el seed, dejo el mensaje en consola y marco error de proceso
    console.error('No se pudo crear el usuario administrador:', error.message);
    process.exitCode = 1;
  } finally {
    //Cierro la conexion aunque el script termine bien o mal
    await mongoose.connection.close();
  }
}

//Ejecuto el script apenas se llama este archivo
seedAdmin();
