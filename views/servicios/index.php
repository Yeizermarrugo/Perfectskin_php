<h1 class="nombre-pagina">Servicios</h1>
<p class="descripcion-pagina">Administración de Servicios</p>

<?php
    include_once __DIR__ . '/../templates/barra.php';
?>

<ul class="servicios">
    <?php foreach($servicios as $servicio) { ?>
        <li>
            <p>Nombre: <span><?php echo $servicio->name; ?></span> </p>
            <p>Precio: <span>$<?php echo $servicio->price; ?></span> </p>

            <?php if ($servicio->eliminada == 1) { ?>
                <p class="eliminada-mensaje">Este servicio está marcado como eliminado.</p>
                <form action="/servicios/activar" method="POST">
                    <input type="hidden" name="id" value="<?php echo $servicio->id; ?>">
                    <input type="submit" value="Activar" class="boton-activar">
                </form>
            <?php } else { ?>
                <div class="acciones">
                    <a class="boton" href="/servicios/actualizar?id=<?php echo $servicio->id; ?>">Actualizar</a>

                    <form action="/servicios/eliminar" method="POST">
                        <input type="hidden" name="id" value="<?php echo $servicio->id; ?>">
                        <input type="submit" value="Borrar" class="boton-eliminar">
                    </form>
                </div>
            <?php } ?>
        </li>
    <?php } ?>
</ul>
