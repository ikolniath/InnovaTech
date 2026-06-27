→ InnovaTech

InnovaTech es una aplicacion web para la gestion interna de pedidos de una panificadora. Permite iniciar sesion, registrar pedidos, consultar su estado, actualizarlos y eliminarlos segun el rol del usuario.
El proyecto esta preparado como version final de Desarrollo Web Backend, integrando Express, MongoDB, Mongoose, sesiones, roles, WebSockets, pruebas con Jest, documentacion y una arquitectura MVC modular.

→ Objetivo del sistema

Centralizar la administracion de pedidos entre planta, sucursales y franquicias, manteniendo una estructura clara para el backend y una interfaz simple con Pug y Bootstrap.

→ Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Pug
- Bootstrap 5
- express-session
- bcrypt
- dotenv
- socket.io
- Jest
- pnpm

→ Arquitectura MVC y modular

El proyecto separa responsabilidades para facilitar mantenimiento y defensa oral:

- `models`: definicion de modelos y validaciones con Mongoose.
- `views`: pantallas Pug con Bootstrap.
- `controllers`: coordinan la peticion HTTP, las vistas y los servicios.
- `routes`: organizan endpoints web y API REST.
- `middlewares`: autenticacion, roles, validaciones, logger y errores.
- `services`: operaciones CRUD contra MongoDB.
- `config`: configuracion de MongoDB y WebSockets.
- `utils`: utilidades compartidas como `AppError`, `asyncHandler` y deteccion de JSON.
- `seed`: creacion del usuario administrador inicial.
- `tests`: pruebas automatizadas con Jest.
- `docs`: documentacion complementaria de pruebas.

→ Estructura de carpetas

```text
src/
|-- config/
|   |-- db.js
|   `-- socket.js
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

tests/
|-- appError.test.js
|-- pedido.model.test.js
`-- usuario.model.test.js

docs/
`-- pruebas.md

pnpm-workspace.yaml
```

→ Instalacion

Requisitos previos:

- Node.js 18 o superior.
- pnpm instalado.
- MongoDB local o una URI de MongoDB Atlas.

Instalar dependencias:

```bash
pnpm install
```

El archivo `pnpm-workspace.yaml` deja aprobados los builds necesarios de dependencias nativas como `bcrypt`.

→ Variables de entorno

Crear un archivo `.env` a partir de `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/innovatech?appName=Cluster0
SESSION_SECRET=***********
NODE_ENV=development
```

Lo datos no son reales por seguridad. No se debe subir `.env` al repositorio. El archivo real queda ignorado por `.gitignore`.

→ MongoDB local

Con MongoDB instalado localmente, la aplicacion puede usar:

```env
MONGO_URI=mongodb://127.0.0.1:27017/innovatech
```

Si MongoDB se ejecuta como servicio, solo hace falta confirmar que este activo antes de iniciar la aplicacion.

→ MongoDB Atlas

Se despliega en MongoDB Atlas, por eso el `.env` tiene una URI del siguiente estilo.

```env
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/innovatech
```

→ Comandos principales

```bash
pnpm run dev
```

```bash
pnpm start
```

```bash
pnpm run seed:admin
```

```bash
pnpm test
```

```bash
pnpm run test:watch
```

→ Usuario administrador inicial

Crear el admin:

```bash
pnpm run seed:admin
```

Crear el usuario:

```bash
node src/seed/seedUsuario.js
```

Credenciales para entorno local:

Administrador:

- Email: `admin@innovatech.com`
- Password: `admin123`

Usuario:

- Email: `usuario@innovatech.com`
- Password: `usuario123`

El modelo `Usuario` hashea la contrasena con `bcrypt` antes de guardarla.

→ Rutas web principales

- `GET /`: inicio del sistema.
- `GET /auth/login`: formulario de login.
- `POST /auth/login`: inicio de sesion.
- `POST /auth/logout`: cierre de sesion.
- `GET /pedidos`: listado de pedidos.
- `GET /pedidos/nuevo`: formulario para registrar pedido.
- `POST /pedidos`: crear pedido.
- `GET /pedidos/:id`: detalle de pedido.
- `GET /pedidos/:id/editar`: formulario de edicion.
- `POST /pedidos/:id/editar`: actualizar pedido desde formulario.
- `POST /pedidos/:id/eliminar`: eliminar pedido desde formulario, solo admin.

→ Endpoints API REST

Los endpoints API estan protegidos por sesion igual que las rutas web:

- `GET /pedidos/api`
- `GET /pedidos/api/:id`
- `POST /pedidos/api`
- `PUT /pedidos/api/:id`
- `DELETE /pedidos/api/:id`, solo admin.

Tambien se mantiene compatibilidad JSON con `Accept: application/json`, `Content-Type: application/json` o `?format=json`.

→ Middlewares usados

- `logger.middleware.js`: registra metodo, URL, estado y tiempo de respuesta.
- `auth.middleware.js`: expone datos de sesion, protege rutas privadas y valida roles.
- `validarPedido.middleware.js`: valida producto, cantidad, cliente y estado antes del controlador.
- `error.middleware.js`: maneja 404, errores de Mongoose y errores generales.

→ Seguridad implementada

- Passwords protegidas con `bcrypt`.
- Login con sesiones usando `express-session`.
- Rutas de pedidos protegidas con `requireAuth`.
- Acciones criticas de eliminacion protegidas con `requireAdmin`.
- Variables sensibles fuera del repositorio mediante `.env`.
- Manejo centralizado de errores para evitar respuestas inconsistentes.
- Las respuestas de sesion solo guardan datos minimos del usuario.

→ Roles

El sistema maneja dos roles:

- `admin`: puede gestionar pedidos y eliminar registros.
- `usuario`: puede acceder al panel y trabajar con pedidos, pero no eliminar.

→ Por que se usaron sesiones y no JWT

La aplicacion renderiza vistas desde el servidor con Pug. Para este tipo de aplicacion web, las sesiones son simples, claras y suficientes. JWT se suele usar mas en APIs consumidas por frontends separados o aplicaciones moviles. Por eso se mantuvo `express-session` y no se agrego Passport.js.

→ WebSockets

Se agrego `socket.io` de forma simple para demostrar comunicacion en tiempo real.

Cuando se crea, actualiza o elimina un pedido, el servidor emite:

- `pedido:creado`
- `pedido:actualizado`
- `pedido:eliminado`
- `pedidos:actualizados`

La vista escucha `pedidos:actualizados` y muestra una notificacion indicando que hubo cambios. No se convirtio toda la aplicacion a tiempo real; solo se agrego una mejora puntual y explicable.

→ Pruebas automatizadas

Las pruebas usan Jest y se ejecutan con:

```bash
pnpm test
```

Cubren:

- Validaciones del modelo `Pedido`.
- Validaciones del modelo `Usuario`.
- Comparacion de contrasenas con `bcrypt`.
- Creacion de errores controlados con `AppError`.

La documentacion detallada esta en `docs/pruebas.md`.

→ Pruebas manuales sugeridas

- Login correcto.
- Login incorrecto.
- Acceso a `/pedidos` sin sesion.
- Crear pedido valido.
- Crear pedido invalido.
- Editar pedido.
- Eliminar pedido con admin.
- Intentar eliminar pedido sin rol admin.
- Abrir ruta inexistente.
- Enviar cantidad menor o igual a cero.
- Probar eventos WebSocket abriendo dos ventanas y modificando pedidos.

→ Manejo de errores

El proyecto usa:

- `AppError` para errores controlados.
- `asyncHandler` para evitar repetir `try/catch` en controladores.
- `error.middleware.js` para devolver HTML o JSON segun el tipo de peticion.

Se contemplan:

- Ruta inexistente.
- ObjectId invalido.
- Validaciones de Mongoose.
- Registros no encontrados.
- Errores generales.

→ Decisiones tecnicas

- Se uso MongoDB porque permite trabajar con documentos flexibles para pedidos.
- Se uso Mongoose para schemas, validaciones y CRUD.
- Se separo la logica en rutas, controladores, servicios y modelos.
- Se uso `asyncHandler` para centralizar errores asincronicos.
- Se uso `bcrypt` para proteger contrasenas.
- Se uso `express-session` porque el frontend se renderiza desde el servidor.
- Se uso Bootstrap para mantener una interfaz simple sin crear un frontend separado.
- Se uso pnpm por eficiencia en la gestion de dependencias.
- Se agrego Socket.IO de forma acotada para cubrir WebSockets sin complejidad innecesaria.
- Se agrego Jest para validar piezas criticas sin depender de una base de datos real.

→ Despliegue

Utilizamos Render para despliegue.

Configuracion general:

- Build command: `pnpm install`
- Start command: `pnpm start`
- Variables de entorno:
  - `PORT`
  - `MONGO_URI`
  - `SESSION_SECRET`
  - `NODE_ENV=production`

En produccion usamos MongoDB Atlas y un `SESSION_SECRET` largo y privado.

→ Bibliografia y recursos

- Documentacion oficial de Express.
- Documentacion oficial de Mongoose.
- Documentacion oficial de MongoDB Atlas.
- Documentacion oficial de Socket.IO.
- Documentacion oficial de Jest.
- Documentacion oficial de Bootstrap.
- Material de clase de Desarrollo Web Backend.

→ Uso de IA

Se utilizo IA como apoyo para revisar estructura, documentacion, comentarios, buenas practicas y preparacion de la entrega final. Las decisiones del proyecto se mantuvieron alineadas con los contenidos vistos en la cursada y con la arquitectura ya existente.

→ Roles y responsabilidades

- Johan Matamoros: estructura general, funcionalidad integral, configuracion del entorno, pnpm.
- Jessica Oleszuk: configuracion de base de datos, MongoDB, Mongoose, modelos, documentación.
- Juan Pablo Miranda: rutas, middlewares, validaciones, proteccion de rutas, manejo de errores, despliegue en Render.
- Sebastian Miguel Mombelli: app.js, controladores e integracion principal de la aplicacion, revision final y explicacion global
