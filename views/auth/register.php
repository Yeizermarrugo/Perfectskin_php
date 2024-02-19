<!DOCTYPE html>

<h1 class="nombre-pagina">Crear Cuenta</h1>
<p class=descripcion-pagina>Completa el formulario
    para crear una cuenta en nuestra plataforma.
</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php";
?>
<form class= "form" action="/register" method="POST">

<div class="campo">
    <label for="name">Nombre:</label><br/>
    <input 
    type="text"
    id="name" 
    name="name"
    placeholder="Nombre"
    value="<?php echo s($user->name); ?>"
    />
</div>

<div class="campo">
    <label for="lastname">Apellido:</label><br/>
    <input 
    type="text"
    id="lastname" 
    name="lastname"
    placeholder="Apellido"
    value="<?php echo s($user->lastname); ?>"
    />
</div>

<div class="campo">
    <label for="phone">Telefono:</label><br/>
    <input 
    type="tel"
    id="phone" 
    name="phone"
    placeholder="Telefono"
    maxlength="10"
    value="<?php echo s($user->phone); ?>"
    />
</div>

<div class="campo">
    <label for="email">Email:</label><br/>
    <input 
    type="email"
    id="email" 
    name="email"
    placeholder="Email"
    value="<?php echo s($user->email); ?>"
    />
</div>

<div class="campo">
    <label for="password">Contraseña:</label><br/>
    <input 
    type="password"
    id="password" 
    name="password"
    placeholder="Password"
    value="<?php echo s($user->password); ?>"
    />
</div>

<input type="submit" value="register" class="boton" >
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Inicia Sesión</a>
    <a href="/forgot-password">¿Olvidaste tu password?</a>
</div>