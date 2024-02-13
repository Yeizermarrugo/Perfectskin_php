<?php

namespace Controllers;

use MVC\Router;

class CitaController {
    public static function index(Router $router) {

        if (session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        
        isAuth();
        
        $router->render('cita/index', [
            'name'=> $_SESSION['name'],
            'id' => $_SESSION['id']
        ]);
    }
}