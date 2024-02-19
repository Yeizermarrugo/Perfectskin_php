<!DOCTYPE html>

<div class="campo">
    <label for="nombre">Nombre</label>
    <input 
        type="text"
        id="nombre"
        placeholder="Nombre Servicio"
        name="name"
        value="<?php echo $servicio->name; ?>"
    />
</div>

<div class="campo">
    <label for="precio">Precio</label>
    <input 
        type="number"
        id="precio"
        placeholder="Precio Servicio"
        name="price"
        value="<?php echo $servicio->price; ?>"
    />
</div>