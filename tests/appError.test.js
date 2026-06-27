//Importamos AppError para validar el manejo controlado de errores
const AppError = require('../src/utils/AppError');

describe('AppError', () => {
  test('crea un error operacional con statusCode y status correctos', () => {
    const error = new AppError('Pedido no encontrado.', 404);

    expect(error.message).toBe('Pedido no encontrado.');
    expect(error.statusCode).toBe(404);
    expect(error.status).toBe('fail');
    expect(error.isOperational).toBe(true);
  });
});
