const express = require('express');
const path = require('path');

const pedidosController = require('./src/controllers/pedidos.controller');
const logger = require('./src/middleware/logger');
const pedidosRouter = require('./src/routes/pedidos.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.json());
app.use(logger);

app.get('/', pedidosController.renderizarInicio);
app.use('/pedidos', pedidosRouter);

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: 'Ruta no encontrada.'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
}

module.exports = app;
