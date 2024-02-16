<?php

namespace Model;

class MisCitas extends ActiveRecord{
    protected static $table = 'cita_servicio';
    protected static $columnsDB = ['id', 'hora', 'fecha', 'servicio', 'precio'];

    public $id;
    public $hora;
    public $fecha;
    public $servicio;
    public $precio;

    public function __construct() {
        $this->id = $args['id'] ?? null;
        $this->id = $args['hora'] ?? '';
        $this->fecha = $args['fecha'] ?? '';
        $this->id = $args['servicio'] ?? '';
        $this->id = $args['precio'] ?? '';
    }
}