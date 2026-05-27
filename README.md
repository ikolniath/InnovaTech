# InnovaTech

Aplicacion academica de Back End para gestionar pedidos de una panificadora industrial. El proyecto evoluciono desde una version con almacenamiento en JSON hacia una aplicacion Express modular con MongoDB, Mongoose, autenticacion por sesiones, vistas Pug y Bootstrap.

## Objetivo academico

Demostrar el uso integrado de:

- Node.js y Express.
- Arquitectura MVC.
- MongoDB con Mongoose.
- Middlewares.
- Rutas y controladores.
- Manejo centralizado de errores.
- Validaciones simples.
- Programacion asincronica con async/await.
- Login con sesiones.
- Vistas server-side con Pug y Bootstrap.

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- express-session
- bcrypt
- dotenv
- Pug
- Bootstrap 5

## Estado actual de la interfaz

- El frontend mantiene Bootstrap 5 como base visual.
- Los estilos propios se concentran en `src/views/layout.pug`.
- Los textos visibles fueron ajustados para dar una imagen mas profesional del sistema.

## Mantenimiento del codigo

- El codigo fuente incluye comentarios breves y naturales para facilitar el estudio del proyecto.
- Los comentarios explican bloques, decisiones simples y flujo general sin cambiar la logica funcional.

## Arquitectura del proyecto

La aplicacion sigue una estructura MVC modular:

- `models`: schemas y modelos de Mongoose.
- `views`: vistas Pug para login, listado, formularios y errores.
- `controllers`: logica HTTP y coordinacion entre vistas, servicios y sesion.
- `routes`: definicion de endpoints.
- `middlewares`: autenticacion, logging, validacion y manejo de errores.
- `services`: acceso a datos y reglas de negocio de pedidos.
- `config`: conexion a base de datos.
- `utils`: utilidades compartidas como `AppError`, `asyncHandler` y deteccion de formato de respuesta.
- `seed`: scripts de carga inicial.

## Estructura de carpetas

```text
src/
|-- config/
|   `-- db.js
|-- controllers/
|   |-- auth.controller.js
|   |-- home.controller.js
|   `-- pedidos.controller.js
|-- middlewares/
|   |-- auth.middleware.js
|   |-- error.middleware.js
|   |-- logger.middleware.js
|   `-- validarPedido.middleware.js
|-- models/
|   |-- Pedido.js
|   `-- Usuario.js
|-- routes/
|   |-- auth.routes.js
|   |-- home.routes.js
|   `-- pedidos.routes.js
|-- seed/
|   `-- seedAdmin.js
|-- services/
|   `-- pedidos.service.js
|-- utils/
|   |-- AppError.js
|   |-- asyncHandler.js
|   `-- expectsJson.js
`-- views/
    |-- crearPedido.pug
    |-- editarPedido.pug
    |-- error.pug
    |-- index.pug
    |-- layout.pug
    |-- login.pug
    |-- pedidos.pug
    `-- verPedido.pug
```

## Requisitos previos

- Node.js 18 o superior.
- MongoDB local en ejecucion.
- npm o pnpm instalado.

## Instalacion

```bash
npm install
```

Si prefieres pnpm:

```bash
pnpm install
```

## Variables de entorno

1. Copia `.env.example` a `.env`.
2. Ajusta los valores segun tu entorno.

Variables incluidas:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/innovatech
SESSION_SECRET=innovatech_secret
```

## Como levantar MongoDB local

Ejemplo con instalacion local de MongoDB:

```bash
mongod --dbpath <tu_ruta_de_datos>
```

Si ya lo tienes configurado como servicio, solo asegurate de que este activo y accesible en `mongodb://127.0.0.1:27017/innovatech`.

## Como ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

## Como crear el usuario administrador inicial

Ejecuta:

```bash
npm run seed:admin
```

Credenciales de ejemplo para entorno local:

- Email: `admin@innovatech.com`
- Password: `admin123`

## Rutas principales

Publicas:

- `GET /`
- `GET /auth/login`
- `POST /auth/login`
- `POST /auth/logout`

Privadas:

- `GET /pedidos`
- `GET /pedidos/nuevo`
- `POST /pedidos`
- `GET /pedidos/:id`
- `GET /pedidos/:id/editar`
- `POST /pedidos/:id/editar`
- `POST /pedidos/:id/eliminar`
- `PUT /pedidos/:id`
- `DELETE /pedidos/:id`

Compatibilidad JSON:

- Si la peticion envia `Accept: application/json`, `Content-Type: application/json` o `?format=json`, los controladores de pedidos devuelven JSON.

## Middlewares

- `logger.middleware.js`: registra metodo, URL, codigo de estado y tiempo de respuesta.
- `auth.middleware.js`: protege rutas privadas y expone usuario/flash a las vistas.
- `validarPedido.middleware.js`: valida datos basicos antes del controlador.
- `error.middleware.js`: centraliza 404, errores de Mongoose y errores generales.

## Controladores

- `auth.controller.js`: renderiza login, valida credenciales y gestiona la sesion.
- `pedidos.controller.js`: renderiza vistas, responde JSON cuando corresponde y coordina el CRUD con el service.
- `home.controller.js`: muestra la pagina de inicio.

## Manejo de errores

La aplicacion utiliza:

- `AppError` para errores controlados.
- `asyncHandler` para capturar errores asincronos.
- Un middleware central que:
  - responde JSON si la peticion lo requiere,
  - renderiza `error.pug` para navegacion web,
  - transforma errores de validacion de Mongoose,
  - maneja ObjectId invalido y 404.

## Validaciones

Se aplican en dos capas:

- Middleware `validarPedido.middleware.js` para validaciones simples de entrada.
- Schema de `Pedido` en Mongoose para reforzar reglas en base de datos.

Tambien el modelo `Usuario` valida campos requeridos y hashea passwords con bcrypt.

## Uso de async/await

Toda la logica de acceso a base de datos y autenticacion se implementa con `async/await`, evitando callbacks complejos y manteniendo el flujo legible.

## Notas sobre sesiones

El proyecto utiliza `express-session` con MemoryStore, suficiente para este contexto academico. En un entorno real deberia migrarse a un store persistente.

## Archivos removidos o reemplazados

- Se elimino la dependencia funcional de `src/data/pedidos.json` porque la persistencia ahora vive en MongoDB.
- Se reemplazo `src/middleware` por `src/middlewares` para mantener consistencia con una arquitectura modular mas clara.
- Se estandarizo el proyecto alrededor de un solo lockfile de pnpm para evitar conflicto con `package-lock.json`.

## Posibles mejoras futuras

- Agregar paginacion y filtros por estado o cliente.
- Implementar roles con permisos mas finos.
- Incorporar pruebas automatizadas con Supertest y una base de datos temporal.
- Mover las vistas de formularios a componentes o mixins Pug reutilizables.
- Reemplazar MemoryStore por un store de sesiones persistente.
