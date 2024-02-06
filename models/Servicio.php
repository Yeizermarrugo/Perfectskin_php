<?php

namespace Model;

class Servicio extends ActiveRecord {
    protected static $table = 'servicios';
    protected static $columnsDB = ['id','name','price'];

    public $id;
    public $name;
    public $price;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->name = $args['name'] ?? '';
        $this->price = $args['price'] ?? '';

    }


}