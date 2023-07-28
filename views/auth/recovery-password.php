<h1 class="nombre-pagina">Recuperar contraseña</h1>
<p class="descripcion-pagina">Ingresa tu nueva contraseña</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>

<?php 
if($error) return;
?>

<form action="" class="form" method="POST">
    <div class="campo">
        <label for="password">Password</label>
        <input 
            type="password"
            id="password"
            placeholder="Tu nuevo Password"
            name="password"
        />
    </div>
    <input type="submit" class="boton" value="Guardar nuevo password">

</form>

<div class="acciones">
    <a href="/login">¿Ya tienes una cuenta? Iniciar sesión</a>
    <a href="/register">¿Aun no tienes una cuenta?</a>

</div>