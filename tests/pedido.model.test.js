//Importamos el modelo Pedido para validar las reglas del schema sin conectarnos a MongoDB
const Pedido = require('../src/models/Pedido');

describe('Modelo Pedido', () => {
  test('valida correctamente un pedido con datos validos', async () => {
    const pedido = new Pedido({
      producto: 'Pan lactal',
      cantidad: 10,
      cliente: 'Sucursal Centro',
      estado: 'pendiente'
    });

    await expect(pedido.validate()).resolves.toBeUndefined();
  });

  test('rechaza cantidad menor o igual a cero', async () => {
    const pedido = new Pedido({
      producto: 'Pan lactal',
      cantidad: 0,
      cliente: 'Sucursal Centro',
      estado: 'pendiente'
    });

    await expect(pedido.validate()).rejects.toThrow('La cantidad debe ser mayor a 0.');
  });

  test('rechaza un estado que no esta permitido', async () => {
    const pedido = new Pedido({
      producto: 'Pan lactal',
      cantidad: 10,
      cliente: 'Sucursal Centro',
      estado: 'cancelado'
    });

    await expect(pedido.validate()).rejects.toThrow('El estado indicado no es valido.');
  });
});
