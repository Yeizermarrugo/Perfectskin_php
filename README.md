
![LOGO LAURA final_Mesa de trabajo 1 copia 3 (1)](https://user-images.githubusercontent.com/104544010/235232799-930d4b6b-680d-43c4-adf6-34b6c577f300.png)


Este proyecto es un backend con NodeJS para una aplicación de agenda de citas. El usuario puede interactuar con el sistema para tomar un turno o cita para un tratamiento o servicio. El proyecto incluye la gestión de citas, la validación de datos, el control de acceso y la comunicación con una base de datos. Los desarrolladores pueden contribuir al proyecto mejorando la eficiencia del código, agregando nuevas funcionalidades, optimizando la seguridad y la escalabilidad del sistema.

# RUTAS

## Usuarios

- /
- GET (ADMIN)

- /
- - GET
- - PATCH (ADMIN)
- - DELETE (ADMIN)

- /
- - GET
- - PATCH
- - DELETE

## Inicio Sesion
- /
- - POST 

## Registrarse
- /
- - POST

## Recuperar contraseña
- /
- - POST
- - PATCH

## Servicios
- /
- GET
- POST (ADMIN)

- /
-GET
-PATCH (ADMIN)
- DELETE (ADMIN)

## Horarios (Horas de atencion por dias)
- /
- GET
- POST (ADMIN)

- /
- GET
- PATCH (ADMIN)
- DELETE (ADMIN)

# Day off
- /
- GET
- POST (ADMIN)


## Citas
- /citas
- GET
- POST (Logged In)

- /:me
- GET (Logged In)

- /:id
- GET (Logged In)
- PATCH (Logged In)
- DELETE (Logged In)

# Paths de mi usuario a traves de mi aplicacion
    [✅] registrar mi usuario
    [✅] loggear mi usuario

## usuario sin sesion iniciada
    1. Ver las citas (Calendario)
    2. Puede ver la informacion de los servicios

## Usuario logeado 

    1. Ver las citas
    2. Puede ver la informacion de los servicios
    3. Agendar una cita (Min 1 dia de anticipacion)
    4. Cancelar su cita

## Admin
    1. Agendar citas
    2. Modifiar una cita agendada
    3. Eliminar una cita agendada
    4. Puede ver perfiles de usuario
    5. Puede ver todas las citas creadas por cada usuario
    6. Crear servicios
    7. Modificar serivicios
    8. Eliminar servicios
    9. Publicar imagenes de servicios y/o Promociones
    10. Modificar roles
    11. Modificar informacion de un usuario
    12. Crear horario de citas
    13. Modificar Horario de citas
    14. Eliminar horario de citas
    15. Bloquear dias especificos para agenda de citas a los usuarios
