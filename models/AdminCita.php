<?php

namespace Model;

class AdminCita extends ActiveRecord{
    protected static $table = 'cita_servicio';
    protected static $columnsDB = ['id', 'hora', 'cliente', 'email', 'phone', 'servicio', 'price', 'eliminada'];

    public $id;
    public $hora;
    public $cliente;
    public $email;
    public $phone;
    public $servicio;
    public $price;
    public $eliminada;

    public function __construct() {
        $this->id = $args['id'] ?? null;
        $this->hora = $args['hora'] ?? '';
        $this->cliente = $args['cliente'] ?? '';
        $this->email = $args['email'] ?? '';
        $this->phone = $args['phone'] ?? '';
        $this->servicio = $args['servicio'] ?? '';
        $this->price = $args['price'] ?? '';
        $this->eliminada = $args['eliminada'] ?? 0;
    }
}