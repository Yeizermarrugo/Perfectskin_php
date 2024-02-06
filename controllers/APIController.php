<?php

namespace Controllers;

use Model\Cita;
use Model\Servicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function citasPorFecha() {
        // Verificar si se proporcionó una fecha en la solicitud
        if (!isset($_GET['fecha'])) {
            echo json_encode(['error' => 'No se proporcionó una fecha']);
            return;
        }
    
        // Obtener la fecha de la solicitud
        $fecha = $_GET['fecha'];
    
        // Validar que la fecha esté en el formato adecuado (por ejemplo, YYYY-MM-DD)
        if (!self::validateDate($fecha, 'Y-m-d')) {
            echo json_encode(['error' => 'Formato de fecha inválido']);
            return;
        }
    
        // Obtener todas las citas programadas para esa fecha de la base de datos
        $citas = Cita::getCitasPorFecha($fecha);
    
        // Crear una lista de todas las horas disponibles para citas
        $horasDisponibles = [];
        $horaInicio = strtotime('09:00');
        $horaFin = strtotime('17:00');
    
        // Iterar sobre todas las horas disponibles y verificar si están ocupadas por citas programadas
        for ($hora = $horaInicio; $hora <= $horaFin; $hora += 3600) { // Incrementar en intervalos de 1 hora (3600 segundos)
            $horaActual = date('H:i:s', $hora); // Formato de hora completo
            $horaOcupada = false;
    
            // Verificar si la hora actual está ocupada por alguna cita
            foreach ($citas as $cita) {
                if ($cita->hora === $horaActual) {
                    $horaOcupada = true;
                    break;
                }
            }
    
            // Si la hora no está ocupada, agregarla a la lista de horas disponibles
            if (!$horaOcupada) {
                $horasDisponibles[] = date('H:i', $hora); // Formato de hora sin segundos
            }
        }
    
        // Devolver la lista de horas disponibles como respuesta en formato JSON
        echo json_encode(['horas_disponibles' => $horasDisponibles]);
    }
    
    // Función para validar el formato de una fecha
    private static function validateDate($date, $format = 'Y-m-d') {
        $dateTime = \DateTime::createFromFormat($format, $date);
        return $dateTime && $dateTime->format($format) === $date;
    }

    public static function guardar() {
       $cita = new Cita($_POST);
       $resultado = $cita->guardar();

        echo json_encode($resultado);
    }
}