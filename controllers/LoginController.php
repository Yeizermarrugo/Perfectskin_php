<?php

namespace Controllers;

use Classes\Email;
use MVC\Router;
use Model\User;

class LoginController{

    public static function login(Router $router) {
        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $auth = new User($_POST);
            $alertas = $auth->validate_login();

            if(empty($alertas)) {
                // Comprobar que exista el usuario
                $user = User::where('email', $auth->email);

                if($user) {
                    // Verificar el password
                    if( $user->check_password($auth->password) ) {
                        // Autenticar el usuario
                        session_start();

                        $_SESSION['id'] = $user->id;
                        $_SESSION['name'] = $user->name . " " . $user->lastname;
                        $_SESSION['email'] = $user->email;
                        $_SESSION['login'] = true;

                        // Redireccionamiento
                        if($user->admin === "1") {
                            $_SESSION['admin'] = $user->admin ?? null;
                            header('Location: /admin');
                        } else {
                            header('Location: /cita');
                        }
                    }
                } else {
                    User::setAlerta('error', 'Usuario no encontrado');
                }

            }
        }

        $alertas = User::getAlertas();
        
        $router->render('auth/login', [
            'alertas' => $alertas
        ]);
    }

    public static function logout() {
        echo "Desde el logout";
    }

    public static function forgot(Router $router) {
        $router->render('auth/forgot-password',[
            
        ]);
    }

    public static function recovery() {
        echo "Desde el recovery";
    }

    public static function register(Router $router)
    {
        $user = new User;

        // Alertas vacias
        $alertas = [];
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $user->sincronizar($_POST);
            $alertas = $user->validate_create();

            // Revisar que alerta este vacio
            if(empty($alertas)) {
                // Verificar que el user no este registrado
                $resultado = $user->exists_user();

                if($resultado->num_rows) {
                    $alertas = User::getAlertas();
                } else {
                    // Hashear el Password
                    $user->hashPassword();

                    // Generar un Token único
                   $user->token();
                   
                    // Enviar el Email
                    $email = new Email($user->name, $user->email, $user->token);
                    $email->send_email_confirmation();

                    // Crear el user
                    $resultado = $user->guardar();
                    //debuguear($user);
                    if($resultado) {
                        header('Location: /message');
                    }
                }
            }
        }
    
            $router->render('auth/register', [
                'user' => $user,
                'alertas' => $alertas
            ]);
    }

    public static function message(Router $router)
    {
        $router->render('auth/message');
    }

    public static function confirm(Router $router)
    {
        $alertas = [];

        $token = s($_GET['token']);
        $user = User::where('token', $token);

        if(empty($user)){
            //Error
            User::setAlerta('error', 'Token no valido');
        }else{
            //Usuario valido
            $user->confirmado = 1;
            $user->token = null;
            $user->guardar();
            User::setAlerta('exito', 'Cuenta comprobada correctamente');
        }

        $alertas = User::getAlertas();

        $router->render('auth/confirm-account', [
            'alertas' => $alertas
        ]);
    }
    
}
