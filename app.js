//Importamos path para poder trabajar con rutas y carpetas del proyecto
const path = require('path');

//Importamos dotenv para leer el archivo .env, express para levantar la app y express-session para manejar sesiones
const dotenv = require('dotenv');
const express = require('express');
const session = require('express-session');

//Importamos la conexion con MongoDB y las rutas principales de la aplicacion
const connectDB = require('./src/config/db');
const homeRoutes = require('./src/routes/home.routes');
const authRoutes = require('./src/routes/auth.routes');
const pedidosRoutes = require('./src/routes/pedidos.routes');

//Importamos los middlewares que pasan datos de sesion a las vistas, registran peticiones y manejan errores
const { attachSessionData } = require('./src/middlewares/auth.middleware');
const { notFoundHandler, errorHandler } = require('./src/middlewares/error.middleware');
const loggerMiddleware = require('./src/middlewares/logger.middleware');

//Cargamos las variables de entorno para poder usar los datos del archivo .env
dotenv.config({ quiet: true });

//Creamos la aplicacion y definimos el puerto base del servidor
const app = express();
const PORT = process.env.PORT || 3000;

//Configuramos Pug e indicamos en que carpeta estan guardadas las vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src', 'views'));

//Habilitamos la lectura de formularios HTML, JSON y configuramos la sesion del usuario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'innovatech_secret', //Clave que usa express-session para firmar la sesion
  resave: false, //Evita volver a guardar la sesion si no hubo cambios
  saveUninitialized: false, //Evita crear sesiones vacias
  cookie: {
    httpOnly: true, //Bloquea el acceso a la cookie desde JavaScript del navegador
    sameSite: 'lax', //Permite navegar dentro del mismo sitio sin perder la sesion
    maxAge: 1000 * 60 * 60 * 4 //Mantiene la sesion activa durante 4 horas
  }
}));

//Registramos el logger y dejamos disponibles los datos de sesion en todas las vistas
app.use(loggerMiddleware);
app.use(attachSessionData);

//Conectamos las rutas principales de la aplicacion
app.use('/', homeRoutes);
app.use('/auth', authRoutes);
app.use('/pedidos', pedidosRoutes);

//Usamos los middlewares finales para rutas no encontradas y errores generales
app.use(notFoundHandler);
app.use(errorHandler);

//Creo una funcion asincronica para iniciar el servidor
async function startServer() {
  await connectDB(); //Primero me conecto a MongoDB antes de levantar la app

  //Despues de conectar, escucho el puerto configurado
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

//Valido si este archivo se ejecuto directamente para iniciar el servidor desde aca
if (require.main === module) {
  //Aqui genero el catch que muestra el mensaje de error si la aplicacion no puede iniciar
  startServer().catch((error) => {
    console.error('No se pudo iniciar la aplicacion:', error.message);
    process.exit(1);
  });
}

//Exportamos la app para poder reutilizarla desde otros archivos
module.exports = app;
