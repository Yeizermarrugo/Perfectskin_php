<?php

namespace Controllers;

use Model\AdminCita;
use MVC\Router;

class AdminController
{
    public static function index(Router $router)
    {

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        isAdmin();

        $fecha = $_GET['fecha'] ?? date('Y-m-d');
        $fechas = explode('-', $fecha);

        if( !checkdate( $fechas[1], $fechas[2], $fechas[0]) ) {
            header('Location: /404');
        }

        $consulta = "SELECT citas.id, citas.hora, citas.eliminada, CONCAT( users.name, ' ', users.lastname) as cliente, ";
        $consulta .= " users.email, users.phone, servicios.name as servicio, servicios.price  ";
        $consulta .= " FROM citas  ";
        $consulta .= " LEFT OUTER JOIN users ";
        $consulta .= " ON citas.userId=users.id  ";
        $consulta .= " LEFT OUTER JOIN cita_servicio ";
        $consulta .= " ON cita_servicio.citaId=citas.id ";
        $consulta .= " LEFT OUTER JOIN servicios ";
        $consulta .= " ON servicios.id=cita_servicio.servicioId ";
        $consulta .= " WHERE fecha =  '${fecha}' ";

       $citas = AdminCita::SQL($consulta);
       
        $router->render('admin/index', [
            'name' => $_SESSION['name'],
            'citas' => $citas,
            'fecha' => $fecha
        ]);
    }
}
