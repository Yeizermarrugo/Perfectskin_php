<!DOCTYPE html>

<?php 
    include_once __DIR__ . '/../templates/barra.php';
?>
<h1 class="nombre-pagina">Panel de Administración</h1>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input 
                type="date"
                id="fecha"
                name="fecha"
                value="<?php echo $fecha; ?>"
            />
        </div>
    </form> 
</div>

<?php
    if(count($citas) === 0) {
        echo "<h2>No Hay Citas en esta fecha</h2>";
    }
?>

<div id="citas-admin">
    <ul class="citas">   
        <?php 
            foreach( $citas as $cita ) {
        ?>
        <li>
            <p>ID: <span><?php echo $cita->id; ?></span></p>
            <p>Hora: <span><?php echo $cita->hora; ?></span></p>
            <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
            <p>Email: <span><?php echo $cita->email; ?></span></p>
            <p>Telefono: <span><?php echo $cita->phone; ?></span></p>

            <h3>Servicio</h3>
            <p class="servicio"><?php echo $cita->servicio; ?></p>
            <p class="total">Total: <span>$ <?php echo $cita->price; ?></span></p>

            <?php if($cita->eliminada == 1) { ?>
                <p class='eliminada-mensaje'>Esta cita está marcada como eliminada.</p>
            <?php } else { ?>
                <form action="/api/eliminar" method="POST">
                    <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                    <input type="submit" class="boton-eliminar" value="Eliminar">
                </form>
            <?php } ?>
        </li>
        <?php
            }
        ?>
    </ul>
</div>

<?php
    $script = "<script src='build/js/buscador.js'></script>"
?>
