<?php

namespace Controllers;

use Classes\Email;
use Model\User;
use MVC\Router;


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
        session_start();

        $_SESSION=[];

        header('Location: /');
    }

    public static function forgot(Router $router) {

        $alertas = [];

        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $auth = new User($_POST);
            $alertas = $auth->validate_email();

            if(empty($alertas)){
                // Comprobar que exista el usuario
                $user = User::where('email', $auth->email);

                if($user && $user->confirmado === "1"){
                    // Generar un token
                    $user->token();
                    $user->guardar();

                    //Enviar email
                    $email = new Email($user->name, $user->email, $user->token);
                   $email->send_email_forgot();
                  User::setAlerta('exito','Revisa tu email');
                }else{
                    User::setAlerta('error','El Usuario no existe o no esta confirmado');
                }
            }
        }
        $alertas = User::getAlertas();

        $router->render('auth/forgot-password',[
            'alertas' => $alertas
        ]);        
    }

    public static function recovery(Router $router) {
        $alertas = [];
        $error = false;

        $token = s($_GET['token']);
        $user = User::where('token', $token);
        if(empty($user)){
            User::setAlerta('error', 'Token no valido');
            $error = true;
        }
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $password = new User($_POST);
            $alertas = $password->validate_password();
            
            if(empty($alertas)){
                // Hashear el Password
                $user->password = null;
                $user->password = $password->password;
                $user->hashPassword();
                $user->token = null;
                $result = $user->guardar();
                if($result){
                    User::setAlerta('exito', 'Password actualizado');
                    $alertas = User::getAlertas();
                    $router->render('auth/login', [
                        'alertas' => $alertas
                    ]);
                }
            }
            
        }

        $alertas = User::getAlertas();
        $router->render('auth/recovery-password', [
            'alertas' => $alertas,
            'error' => $error,
        ]);
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
