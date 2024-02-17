<?php

namespace Model;

class Servicio extends ActiveRecord {
    protected static $table = 'servicios';
    protected static $columnsDB = ['id','name','price', 'eliminada'];

    public $id;
    public $name;
    public $price;
    public $eliminada;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->name = $args['name'] ?? '';
        $this->price = $args['price'] ?? '';
        $this->eliminada = $args['eliminada'] ?? 0;

    }

    public function validar() {
        if(!$this->name) {
            self::$alertas['error'][] = 'El Nombre del Servicio es Obligatorio';
        }
        if(!$this->price) {
            self::$alertas['error'][] = 'El Precio del Servicio es Obligatorio';
        }
        if(!is_numeric($this->price)) {
            self::$alertas['error'][] = 'El precio no es válido';
        }

        return self::$alertas;
    }


}