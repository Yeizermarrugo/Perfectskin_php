<!DOCTYPE html>

<?php
        include_once __DIR__ . '/../templates/barra.php';
    ?> 

<h1 class="nombre-pagina">Crear Nueva Cita</h1>
<p class="descripcion-pagina">Elige tus servicios y coloca tus datos</p>


<div id="app">
    <nav class="tabs">
        <button class="actual" type="button" data-paso="1">Servicios</button>
        <button type="button" data-paso="2">Información Cita</button>
        <button type="button" data-paso="3">Resumen</button>
        <button type="button" data-paso="4">Mis Citas</button>
    </nav>

    <div id="paso-1" class="section">
        <h2>Servicios</h2>
        <p class="text-center">Elige tus servicios a continuación</p>
        <div id="servicios" class="listado-servicios"></div>
    </div>
    <div id="paso-2" class="section">
        <h2>Tus Datos y Cita</h2>
        <p class="text-center">Coloca tus datos y fecha de tu cita</p>

        <form class="form">
            <div class="campo">
                <label for="nombre">Nombre</label>
                <input id="nombre" type="text" placeholder="Tu Nombre" value="<?php echo $name; ?>" disabled />
            </div>

            <div class="campo">
                <label for="fecha">Fecha</label>
                <input id="fecha" type="date" min="<?php echo date('Y-m-d', strtotime('+1 day')); ?>" />
            </div>

            <div class="campo">
                <label for="hora">Hora</label>
                <select id="lista-horas" style="display: none;"></select>
                <span id="hora-placeholder">00:00</span>
            </div>

            <input type="hidden" id="id" value="<?php echo $id; ?>">

        </form>
    </div>
    <div id="paso-3" class="section contenido-resumen">
        <h2>Resumen</h2>
        <p class="text-center">Verifica que la información sea correcta</p>
    </div>

    <div id="paso-4" class="section mis-citas">
        <h2>Mis Citas</h2>
        <div id="lista-citas" class="listado-servicios"></div>
    </div>

    <div class="paginacion">
        <button id="anterior" class="boton">&laquo; Anterior</button>

        <button id="siguiente" class="boton">Siguiente &raquo;</button>
    </div>
</div>

<?php
$script = "
        <script src='//cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script src='build/js/app.js'></script>
    ";
?>