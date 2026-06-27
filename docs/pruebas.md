→ Documentacion de pruebas

Este documento resume las pruebas manuales y automatizadas usadas para validar el proyecto InnovaTech.

→ Pruebas manuales

|Prueba | Objetivo | Procedimiento | Resultado esperado | Resultado obtenido |

1. | Login correcto | Validar acceso de usuario registrado | Ingresar con `admin@innovatech.com` y `admin123` | Redireccion a `/pedidos` | Pendiente de ejecutar en entorno local |
2. | Login incorrecto | Validar rechazo de credenciales invalidas | Ingresar email o password incorrectos | Mensaje de error en login | Pendiente de ejecutar en entorno local |
3. | Acceso sin sesion | Validar proteccion de rutas privadas | Abrir `/pedidos` sin iniciar sesion | Redireccion a `/auth/login` | Pendiente de ejecutar en entorno local |
4. | Crear pedido valido | Validar alta de pedidos | Completar producto, cantidad, cliente y estado valido | Pedido creado y redireccion al detalle | Pendiente de ejecutar en entorno local |
5. | Crear pedido invalido | Validar reglas de entrada | Enviar cantidad `0` o campos vacios | Mensajes de validacion | Pendiente de ejecutar en entorno local |
6. | Editar pedido | Validar actualizacion | Modificar un pedido existente | Cambios guardados y detalle actualizado | Pendiente de ejecutar en entorno local |
7. | Eliminar pedido | Validar accion restringida | Eliminar pedido con usuario admin | Pedido eliminado y vuelta al listado | Pendiente de ejecutar en entorno local |
8. | Ruta inexistente | Validar middleware 404 | Abrir una ruta no definida | Vista o JSON de error 404 | Pendiente de ejecutar en entorno local |
9. | Cantidad menor o igual a cero | Validar regla de cantidad | Enviar cantidad `0` o negativa | Error de validacion | Pendiente de ejecutar en entorno local |

→ Pruebas automatizadas

Las pruebas automatizadas se ejecutan con:

```bash
pnpm test
```

Cubren:

- Validaciones del modelo `Pedido`.
- Validaciones del modelo `Usuario`.
- Comparacion de contrasenas con `bcrypt`.
- Creacion de errores controlados con `AppError`.

→ Resultado esperado de Jest

Al ejecutar `pnpm test`, Jest debe mostrar que todos los tests pasan correctamente.

Resultado obtenido en la revision final:

- 3 suites ejecutadas.
- 7 pruebas aprobadas.
- 0 pruebas fallidas.
