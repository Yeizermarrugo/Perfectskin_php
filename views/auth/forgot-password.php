<h1 class="nombre-pagina">Olvide Password</h1>
<p class="descripcion-pagina">Reestablecer Password</p>

<form class="form" action="/forgot-password" method="post">
    <div class="campo">
        <label for="email">Email:</label>
        <input 
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        >
    </div>

    <input type="submit" value="recovery" class="boton">
    
</form>

<div class="acciones">
    <a href="/">¿Ya tienes una cuenta? Iniciar Sesión</a>
    <a href="/register">¿Aún no tienes una cuenta? Crear Cuenta</a>
</div>