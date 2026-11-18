# Indutexs (demo multiempresa)

Abrir `index.html` en el navegador o con Live Server. El proyecto conserva JavaScript, HTML y CSS sin framework.

## Accesos demo

| Rol | Usuario | Contraseña |
|---|---|---|
| SuperAdmin | `indutexs_superadmin` | `Indutexs@2026` |
| Admin Grupo Logístico Andino | `gla_admin` | `Andino@2026` |
| Usuario ventas Grupo Logístico | `gla.ventas` | `Ventas@2026` |
| Usuario bodega Grupo Logístico | `gla.bodega` | `Bodega@2026` |
| Usuario producción Grupo Logístico | `gla.produccion` | `Produccion@26` |
| Admin Soluciones Tecnológicas | `stg_admin` | `Global@2026` |
| Usuario RR. HH. Soluciones Tecnológicas | `stg.rrhh` | `Recursos@26` |
| Usuario ventas Soluciones Tecnológicas | `stg.ventas` | `Comercial@26` |
| Admin Distribuidora del Norte | `ddn_admin` | `Norte@2026` |
| Usuario bodega Distribuidora | `ddn.bodega` | `Almacen@26` |
| Usuario producción Distribuidora | `ddn.produccion` | `Planta@2026` |
| Admin Operaciones Industriales | `oio_admin` | `Oriente@2026` |
| Usuario RR. HH. Operaciones Industriales | `oio.rrhh` | `Personal@26` |

## Acceso de usuarios

El registro público y la opción **Unirme a una empresa** fueron retirados. El SuperAdmin crea empresas y sus administradores; cada administrador de empresa crea las cuentas de sus empleados desde el módulo **Usuarios** y les asigna permisos. Los códigos de invitación permanecen como herramienta administrativa de demostración, pero no se usan en el inicio de sesión.

## Persistencia local

Empresas, usuarios, invitaciones y cambios de los módulos se guardan en `localStorage` bajo la clave `indutexs_demo_v2`. Los datos permanecen en el mismo navegador y perfil; no se sincronizan entre equipos ni se comparten entre navegadores. Para reiniciar la demo, elimina esa clave desde las herramientas de almacenamiento del navegador.

Las cuentas nuevas se crean desde el módulo **Usuarios** del administrador de empresa y quedan asociadas a la empresa de la sesión.

## Roles y permisos

- **SUPERADMIN**: administra el catálogo de empresas y puede crear empresas.
- **EMPRESA**: administra usuarios y permisos únicamente dentro de su empresa.
- **USUARIO**: accede únicamente a los módulos y niveles asignados.

La navegación y las funciones de escritura se protegen con validaciones de rol y empresa en el cliente. Exportación: se descarga `.xlsx` con SheetJS cuando hay conexión; si no, se descarga CSV compatible con Excel.

## Importante para producción

Este repositorio es una demo estática. Los guards JavaScript, usuarios, contraseñas y códigos de invitación están en el navegador y **no constituyen seguridad real**. Antes de desplegar con datos reales, mover autenticación, hash de contraseñas, emisión/consumo de invitaciones, RBAC y validación de `company_id` a un backend; aplicar autorización en cada endpoint y persistir los datos en una base de datos multi-tenant.


## Centro de administración SuperAdmin

El rol `SUPERADMIN` dispone del módulo **Gestión de empresas** en la navegación. Desde allí puede:

- Consultar empresas, cantidad de cuentas y administradores.
- Consultar las cuentas asociadas a cada empresa.
- Restablecer contraseñas de administradores y usuarios; la cuenta deberá definir una nueva contraseña en el siguiente ingreso.
- Activar o suspender empresas y activar/desactivar usuarios estándar.
- Renombrar empresas y eliminar una empresa junto con sus usuarios e invitaciones.
- Consultar y exportar el registro local de auditoría.

Los cambios se guardan en `localStorage` bajo `indutexs_demo_v2`. La suspensión impide el inicio de sesión de las cuentas de esa empresa.

**Límite de seguridad:** este es un prototipo local de demostración. `localStorage`, los guards del navegador y las contraseñas de demostración no sustituyen un backend seguro. No utilizar con información real ni credenciales de producción.

## Inicio de sesión simplificado

La pantalla pública solo permite iniciar sesión. Se retiraron los controles y scripts de registro/unión por invitación, así como la validación de correo simulada de la página de presentación. Para dar acceso a un empleado, el administrador de empresa debe crearlo desde **Usuarios**. Si se restablece una contraseña desde SuperAdmin, se fuerza el cambio en el siguiente inicio de sesión.


## Solicitudes comerciales de empresas

La página principal incluye el formulario **Quiero contratar INDUTEXS**. Las solicitudes se muestran en el nuevo módulo **Solicitudes de empresas** del SuperAdmin, donde se pueden consultar, cambiar de estado (Nueva, Contactada, Aceptada o Rechazada) y exportar. En esta demo, los datos se guardan en `localStorage` del mismo navegador. **No se envía un correo real ni se sincroniza con otros equipos**; para producción hay que conectar un backend/base de datos y un servicio de correo.
