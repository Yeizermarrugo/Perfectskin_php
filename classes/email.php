<?php

namespace Classes;
use PHPMailer\PHPMailer\PHPMailer;

class Email {
    public $email;
    public $name;
    public $token;

    public function __construct($name, $email, $token) 
    {
        $this->email = $email;
        $this->name  = $name;
        $this->token = $token;

    }

    public function send_email_confirmation() {
        //Crear objeto email
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $_ENV['EMAIL_HOST'];
        $mail->SMTPAuth = true;
        $mail->Port = $_ENV['EMAIL_PORT'];
        $mail->Username = $_ENV['EMAIL_USERNAME'];
        $mail->Password = $_ENV['EMAIL_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

        $mail->setFrom('Perfectskincartagena@perfectskinctg.com');
        $mail->addAddress($this->email);
        $mail->Subject ='Confirmación de cuenta - Laura Nuñez PerfectSkin';

        $mail->isHTML(TRUE);
        $mail->CharSet='UTF-8';

        $contenido = "<html>";
        $contenido .="<head><title>Confirmar Correo Electrónico</title></head>";
        $contenido .= "<p><strong> Hola " .$this->name . "</strong> Has creado tu cuenta en Laura Nuñez Perfectskin, solo debes confirmarla presionansdo el siguiente enlace</p>";
        $contenido .= "<p>Presiona aqui: <a href = '".$_ENV['APP_URL']."/confirm-account?token=". $this->token ." '>Confirmar Cuenta<a/></p>";
        $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar este mensaje</p>";
        $contenido .= "</html>";

        $mail->Body = $contenido;

        //Enviar correo
        $mail->send();

    }

    public function send_email_forgot(){
         //Crear objeto email
         $mail = new PHPMailer(true);
         $mail->isSMTP();
         $mail->Host = $_ENV['EMAIL_HOST'];
         $mail->SMTPAuth = true;
         $mail->Port = $_ENV['EMAIL_PORT'];
         $mail->Username = $_ENV['EMAIL_USERNAME'];
         $mail->Password = $_ENV['EMAIL_PASSWORD'];
 
         $mail->setFrom('Perfectskincartagena@perfectskinctg.com');
         $mail->addAddress($this->email);
         $mail->Subject ='Reestablece tu password - Laura Nuñez PerfectSkin';
 
         $mail->isHTML(TRUE);
         $mail->CharSet='UTF-8';
 
         $contenido = "<html>";
         $contenido .="<head><title>Confirmar Correo Electrónico</title></head>";
         $contenido .= "<p><strong> Hola " .$this->name . "</strong> Has solicitado reestablecer tu contraseña en Laura Nuñez Perfectskin, solo debes confirmar presionansdo el siguiente enlace</p>";
         $contenido .= "<p>Presiona aqui: <a href = '".$_ENV['APP_URL']."/recovery-password?token=". $this->token ." '>Reestablecer Password <a/></p>";
         $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar este mensaje</p>";
         $contenido .= "</html>";
 
         $mail->Body = $contenido;
 
         //Enviar correo
         $mail->send();
    }


}