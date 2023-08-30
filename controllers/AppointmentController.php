<?php

namespace Controllers;

use MVC\Router;

class AppointmentController {
    public static function index(Router $router) {
                      
        $router->render('appointment/index', [
            'name'=> $_SESSION['name']
        ]);
    }
}