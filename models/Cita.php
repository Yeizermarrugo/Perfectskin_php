<?php

namespace Model;

class Cita extends ActiveRecord{
    protected static $table = 'citas';
    protected static $columnsDB = ['id', 'fecha', 'hora', 'userId'];

    public $id;
    public $fecha;
    public $hora;
    public $userId;

    public function __construct($args = []) {

        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
        $this->userId = $args['userId'] ?? '';
        
    }

    public static function getCitasPorFecha($fecha) {
        // Preparar la consulta SQL para seleccionar las citas para la fecha especificada
        $consulta = "SELECT * FROM citas WHERE fecha = '{$fecha}'";
    
        // Ejecutar la consulta utilizando el método estático de ActiveRecord
        return self::consultarSQL($consulta);
    }
    
    
}