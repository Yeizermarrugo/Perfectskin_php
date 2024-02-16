<?php

namespace Controllers;

use Model\Cita;
use Model\CitaServicio;
use Model\MisCitas;
use Model\Servicio;
use MVC\Router;

class APIController
{
    public static function index()
    {
        $servicios = Servicio::all();
        echo json_encode($servicios);
    }

    public static function citasPorFecha()
    {
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
    private static function validateDate($date, $format = 'Y-m-d')
    {
        $dateTime = \DateTime::createFromFormat($format, $date);
        return $dateTime && $dateTime->format($format) === $date;
    }

    public static function guardar()
    {
        // Obtener los datos de la solicitud POST
        $fecha = $_POST['fecha'];
        $hora = $_POST['hora'];

        //Verificar la disponibilidad de la cita
        $citaDisponible = self::citaDisponible();

        if (!$citaDisponible) {
            // Si la cita no está disponible, devolver un mensaje de error
            echo json_encode(['disponible' => false, 'mensaje' => 'Fecha y hora no disponible']);
            return;
        }else{

            // Si la cita está disponible, guardarla en la base de datos
            $cita = new Cita($_POST);
            $resultado = $cita->guardar();
            
            $id = $resultado['id'];
            
            //Almacena el servicio con el Id de la cita
            $idServicio = explode(',', $_POST['servicioId']);
            
            foreach($idServicio as $idServ){
                $args = [
                    'citaId' => $id,
                    'servicioId' => $idServ
                ];
                $citaServicios = new CitaServicio($args);
                $citaServicios->guardar();
            }
            
            echo json_encode(['resultado' => $resultado]);
        }
    }

    public static function citaDisponible()
    {
        $fecha = $_POST['fecha'];
        $hora = $_POST['hora'];

        // Verificar la disponibilidad de la cita
        $resultado = Cita::existeCita($fecha, $hora);

        // Obtener el total de citas como un entero
        $totalCitas = (int) $resultado['total'];

        // Verificar el resultado
        if ($totalCitas === 1) {
            // Si hay una cita, devolver un mensaje de error
            return false;
        } elseif ($totalCitas === 0) {
            // Si no hay una cita, la cita está disponible
            return true;
        }
    }

    public static function eliminar() {
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $cita = Cita::find($id);
            $cita->eliminar();
            header('Location:' . $_SERVER['HTTP_REFERER']);
        }
    }

    public static function misCitas(Router $router)
    {
        // Verificar si el usuario está autenticado
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        isAuth();

        // Obtener el ID del usuario autenticado
        $userId = $_SESSION['id'];

        // Realizar la consulta SQL para obtener las citas del usuario con los servicios asociados
        $consulta = "SELECT citas.id, citas.fecha, citas.hora, servicios.name AS servicio, servicios.price AS precio";
        $consulta .= " FROM citas";
        $consulta .= " INNER JOIN cita_servicio ON citas.id = cita_servicio.citaId";
        $consulta .= " INNER JOIN servicios ON cita_servicio.servicioId = servicios.id";
        $consulta .= " WHERE citas.userId = ${userId}";

        // Ejecutar la consulta y obtener los resultados
        $citas = MisCitas::SQL($consulta);

        echo json_encode($citas);
    }
}
