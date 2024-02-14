<?php

namespace Model;

class AdminCita extends ActiveRecord{
    protected static $table = 'cita_servicio';
    protected static $columnsDB = ['id', 'hora', 'cliente', 'email', 'phone', 'servicio', 'price'];

    public $id;
    public $hora;
    public $cliente;
    public $email;
    public $phone;
    public $servicio;
    public $price;

    public function __construct() {
        $this->id = $args['id'] ?? null;
        $this->id = $args['hora'] ?? '';
        $this->id = $args['cliente'] ?? '';
        $this->id = $args['email'] ?? '';
        $this->id = $args['phone'] ?? '';
        $this->id = $args['servicio'] ?? '';
        $this->id = $args['price'] ?? '';
    }
}