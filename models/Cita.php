<?php

namespace Model;

class Cita extends ActiveRecord{
    protected static $table = 'citas';
    protected static $columnsDB = ['id', 'fecha', 'hora', 'userId', 'eliminada'];

    public $id;
    public $fecha;
    public $hora;
    public $userId;
    public $eliminada;

    public function __construct($args = []) {

        $this->id = $args['id'] ?? null;
        $this->fecha = $args['fecha'] ?? '';
        $this->hora = $args['hora'] ?? '';
        $this->userId = $args['userId'] ?? '';
        $this->eliminada = $args['eliminada'] ?? 0;
        
    }

    public static function getCitasPorFecha($fecha) {
        // Preparar la consulta SQL para seleccionar las citas para la fecha especificada
        $consulta = "SELECT * FROM citas WHERE fecha = '{$fecha}'";
    
        // Ejecutar la consulta utilizando el método estático de ActiveRecord
        return self::consultarSQL($consulta);
    }

    public static function existeCita($fecha, $hora) {
        // Formatear la hora con ceros en los segundos
        $horaFormateada = date('H:i:s', strtotime($hora));
    
        // Preparar la consulta SQL para verificar si existe una cita para la fecha y hora especificadas
        $consulta = "SELECT COUNT(*) as total FROM citas WHERE fecha = '{$fecha}' AND hora = '{$horaFormateada}' AND eliminada = 0";
        // Ejecutar la consulta utilizando el método estático de ActiveRecord
        return self::consultarSQL2($consulta);
    }
    
    
}