<?php

namespace Classes;

use Exception;
use SendGrid\Mail\Mail;
use SendGrid;

// Remove unnecessary PHPMailer usage
// use PHPMailer\PHPMailer\PHPMailer;  // Not needed with SendGrid

class Email {
  public $email;
  public $name;
  public $token;

  public function __construct($name, $email, $token) 
  {
    $this->email = $email;
    $this->name = $name;
    $this->token = $token;
  }

  public function send_email_confirmation() {
    // Include SendGrid library (assuming it's installed with Composer)

    $email = new Mail();
    $email->setFrom("perfectskinctg@gmail.com", "Laura Nuñez PerfectSkin");
    $email->addTo($this->email, $this->name);
    $email->setSubject("Confirmación de cuenta - Laura Nuñez PerfectSkin");

    $contenido = "<html>";
    $contenido .= "<head><title>Confirmar Correo Electrónico</title></head>";
    $contenido .= "<p><strong> Hola " . $this->name . "</strong> Has creado tu cuenta en Laura Nuñez Perfectskin, solo debes confirmarla presionansdo el siguiente enlace</p>";
    $contenido .= "<p>Presiona aqui: <a href = '" . $_ENV['APP_URL'] . "/confirm-account?token=" . $this->token . "'>Confirmar Cuenta<a/></p>";
    $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar este mensaje</p>";
    $contenido .= "</html>";

    $email->addContent("text/html", $contenido);
    $sendgrid = new SendGrid($_ENV['SENDGRID_API_KEY']);

    try {
        $sendgrid->send($email);
        // debug($response->statusCode());
        // debug($response->headers());
        //debug($response->body());
      echo 'Correo electrónico enviado correctamente.';
    } catch (Exception $e) {
      echo 'Error al enviar el correo electrónico: ' . $e->getMessage();
    }
  }

  public function send_email_forgot() {
    // Include SendGrid library
    require 'vendor/autoload.php';

    $email = new SendGrid\Mail\Mail();
    $email->setFrom("Perfectskincartagena@perfectskinctg.com", "Laura Nuñez PerfectSkin");
    $email->addTo($this->email, $this->name);
    $email->setSubject("Reestablece tu password - Laura Nuñez PerfectSkin");

    $contenido = "<html>";
    $contenido .= "<head><title>Confirmar Correo Electrónico</title></head>";
    $contenido .= "<p><strong> Hola " . $this->name . "</strong> Has solicitado reestablecer tu contraseña en Laura Nuñez Perfectskin, solo debes confirmar presionansdo el siguiente enlace</p>";
    $contenido .= "<p>Presiona aqui: <a href = '" . $_ENV['APP_URL'] . "/recovery-password?token=" . $this->token . "'>Reestablecer Password<a/></p>";
    $contenido .= "<p>Si tu no solicitaste esta cuenta, puedes ignorar este mensaje</p>";
    $contenido .= "</html>";

    $email->addContent($contenido);

    $sendgrid = new SendGrid($_ENV['SENDGRID_API_KEY']);

    try {
      $sendgrid->send($email);
      echo 'Correo electrónico enviado correctamente.';
    } catch (Exception $e) {
      echo 'Error al enviar el correo electrónico: ' . $e->getMessage();
    }
  }
}

