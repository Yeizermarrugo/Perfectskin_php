<?php 

require_once __DIR__ . '/../includes/app.php';

use Controllers\LoginController;
use Controllers\AppointmentController;
use MVC\Router;

$router = new Router();

//Iniciar Sesion
$router->get('/', [LoginController::class, 'login']);
$router->post('/', [LoginController::class, 'login']);
$router->get('/logout', [LoginController::class, 'logout']);

//Recuperar Password
$router->get('/forgot-password', [LoginController::class, 'forgot']);
$router->post('/forgot-password', [LoginController::class, 'forgot']);
$router->get('/recovery-password', [LoginController::class, 'recovery']);
$router->post('/recovery-password', [LoginController::class, 'recovery']);

//Crear cuenta
$router->get('/register', [LoginController::class, 'register']);
$router->post('/register', [LoginController::class, 'register']);

//Confirmar cuenta
$router->get('/confirm-account', [LoginController::class, 'confirm']);
$router->get('/message', [LoginController::class, 'message']);

//Area privada
$router->get('/appointment', [AppointmentController::class, 'index']);

// Comprueba y valida las rutas, que existan y les asigna las funciones del Controlador
$router->comprobarRutas();