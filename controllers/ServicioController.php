<?php

namespace Controllers;

use Model\Servicio;
use MVC\Router;

class ServicioController {
    public static function index(Router $router) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        isAdmin();

        $servicios = Servicio::all();

        $router->render('servicios/index', [
            'name' => $_SESSION['name'],
            'servicios' => $servicios
        ]);
    }

    public static function crear(Router $router) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        isAdmin();
        $servicio = new Servicio;
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio->sincronizar($_POST);
            
            $alertas = $servicio->validar();;

            if(empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios');
            }
        }
        $router->render('servicios/crear', [
            'name' => $_SESSION['name'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function actualizar(Router $router) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        isAdmin();

        if(!is_numeric($_GET['id'])) return;

        $servicio = Servicio::find($_GET['id']);
        $alertas = [];

        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $servicio->sincronizar($_POST);

            $alertas = $servicio->validar();

            if(empty($alertas)) {
                $servicio->guardar();
                header('Location: /servicios');
            }
        }

        $router->render('servicios/actualizar', [
            'name' => $_SESSION['name'],
            'servicio' => $servicio,
            'alertas' => $alertas
        ]);
    }

    public static function eliminar() {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        isAdmin();
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $servicio = Servicio::find($id);
            $servicio->eliminar();
            header('Location: /servicios');
        }
    }

    public static function activar(Router $router) {
        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        isAdmin();
    

        $id = $_POST['id'] ?? null;
        $servicios = Servicio::find($id);
               
        if (!$servicios) {
            // Error: Servicio no encontrado
            Servicio::setAlerta('error', 'Servicio no encontrado');
        } else {
            // Servicio encontrado
            $servicios->eliminada = 0; // Marcar el servicio como activo
            $servicios->guardar();
        
            Servicio::setAlerta('exito', 'Servicio activado correctamente');
        }
        
        
        header('Location: /servicios');
        
    }
}