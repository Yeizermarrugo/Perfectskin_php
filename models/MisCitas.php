<?php

namespace Model;

class MisCitas extends ActiveRecord{
    protected static $table = 'cita_servicio';
    protected static $columnsDB = ['id', 'hora', 'fecha', 'servicio', 'precio', 'eliminada'];

    public $id;
    public $hora;
    public $fecha;
    public $servicio;
    public $precio;
    public $eliminada;

    public function __construct() {
        $this->id = $args['id'] ?? null;
        $this->hora = $args['hora'] ?? '';
        $this->fecha = $args['fecha'] ?? '';
        $this->servicio = $args['servicio'] ?? '';
        $this->precio = $args['precio'] ?? '';
        $this->eliminada = $args['eliminada'] ?? 0;

    }
}