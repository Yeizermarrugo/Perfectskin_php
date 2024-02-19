
<div class="barra">
    <div class="usuario">
        <p><i class="fa-solid fa-user"></i> <?php echo $name ?? '' ?></p>
        <a href="/logout">
            <i class="fa-solid fa-power-off"></i>
            <span class="cerrar-sesion"></span>
        </a>
    </div>
</div>

<?php if(isset($_SESSION['admin'])) { ?>
    <div class="barra-servicios">
        <a class="boton" href="/admin">Ver Citas</a>
        <a class="boton" href="/servicios">Ver Servicios</a>
        <a class="boton" href="/servicios/crear">Nuevo Servicio</a>
    </div>
<?php } ?>