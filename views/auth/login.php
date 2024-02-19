<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
    <h1 class="nombre-pagina">Login</h1>
    <p class="descripcion-pagina">Iniciar sesión</p>
    
<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>

<form class="form" method="POST" action="/">
    <div class="campo">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            placeholder="Tu Email"
            name="email"
            />
        </div>

        <div class="campo">
            <label for="password">Password</label>
            <input 
            type="password"
            id="password"
            placeholder="Tu Password"
            name="password"
            />
        </div>

        <input type="submit" class="boton" value="Login">
    </form>

    <div class="acciones">
    <a href="/register">¿Aún no tienes una cuenta? Crear Cuenta</a>
    <a href="/forgot-password">¿Olvidaste tu password?</a>
</div>
</body>
</html>