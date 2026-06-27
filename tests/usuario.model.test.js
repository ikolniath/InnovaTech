//Importamos bcrypt y el modelo Usuario para probar validaciones y comparacion de contrasenas
const bcrypt = require('bcrypt');

const Usuario = require('../src/models/Usuario');

describe('Modelo Usuario', () => {
  test('valida un usuario con datos correctos', async () => {
    const usuario = new Usuario({
      nombre: 'Administrador',
      email: 'ADMIN@INNOVATECH.COM',
      password: 'admin123',
      rol: 'admin'
    });

    await expect(usuario.validate()).resolves.toBeUndefined();
  });

  test('rechaza un rol que no esta permitido', async () => {
    const usuario = new Usuario({
      nombre: 'Administrador',
      email: 'admin@innovatech.com',
      password: 'admin123',
      rol: 'superadmin'
    });

    await expect(usuario.validate()).rejects.toThrow();
  });

  test('compara correctamente una contrasena con bcrypt', async () => {
    const passwordPlano = 'admin123';
    const passwordHash = await bcrypt.hash(passwordPlano, 10);
    const usuario = new Usuario({
      nombre: 'Administrador',
      email: 'admin@innovatech.com',
      password: passwordHash,
      rol: 'admin'
    });

    await expect(usuario.comparePassword(passwordPlano)).resolves.toBe(true);
    await expect(usuario.comparePassword('incorrecta')).resolves.toBe(false);
  });
});
