<?php

namespace Controllers;

use MVC\Router;

class CitaController {
    public static function index(Router $router) {
        
        $router->render('cita/index', [
            'name'=> $_SESSION['name'],
            'id' => $_SESSION['id']
        ]);
    }
}