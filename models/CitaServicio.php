<?php

namespace Model;

class CitaServicio extends ActiveRecord{
    protected static $table = 'cita_servicio';
    protected static $columnsDB = ['id', 'citaId', 'servicioId'];

    public $id;
    public $citaId;
    public $servicioId;

    public function __construct($args = []){
        $this->id = $args['id'] ?? null;
        $this->citaId = $args['citaId'] ?? '';
        $this->servicioId = $args['servicioId'] ?? '';
    }
}