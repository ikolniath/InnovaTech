//Importamos mongoose para cerrar la conexion al terminar el script
const mongoose = require("mongoose");

//Importamos dotenv para leer las variables del archivo .env
const dotenv = require("dotenv");

const connectDB = require("../config/db");
const Usuario = require("../models/Usuario");

//Cargo las variables de entorno para poder conectarme a MongoDB
dotenv.config({ quiet: true });

//Creo el script que genera un usuario comun para pruebas en el frontend
async function seedUsuario() {
  try {
    await connectDB();

    //Defino las credenciales base del usuario comun local
    const email = "usuario@innovatech.com";
    const password = "usuario123";

    //Primero valido si el usuario ya existe para no duplicarlo
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      console.log("El usuario comun ya existe.");
      return;
    }

    //Creo el usuario con rol usuario para probar permisos sin ser administrador
    await Usuario.create({
      nombre: "Usuario InnovaTech",
      email,
      password,
      rol: "usuario",
    });

    console.log("Usuario comun creado correctamente.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    //Si algo falla durante el seed, muestro el error y marco el proceso como fallido
    console.error("No se pudo crear el usuario comun:", error.message);
    process.exitCode = 1;
  } finally {
    //Cierro la conexion con MongoDB aunque el script termine bien o con error
    await mongoose.connection.close();
  }
}

//Ejecuto el seed cuando se llama este archivo desde la terminal
seedUsuario();
