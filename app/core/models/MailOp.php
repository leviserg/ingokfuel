<?php
    namespace app\core;  
    require __DIR__.'/./phpmailer/src/PHPMailer.php';
    require __DIR__.'/./phpmailer/src/SMTP.php';
    require __DIR__.'/./phpmailer/src/Exception.php'; 
             
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;
    
    class MailOp {

        public static $error;

        public static function messageValidate($post){
            $nameLen = iconv_strlen($post['name']);
            $textLen = iconv_strlen($post['text']);
            if($nameLen < 2 || $nameLen > 30){
                self::$error = 'Формат Имя от 2 до 30 символов';
                return false;
            } elseif (!filter_var($post['email'], FILTER_VALIDATE_EMAIL)) {
                self::$error = 'Неправильный или пустой email';
                return false;
            } elseif ($textLen < 2 || $textLen > 600) {
                self::$error = 'Формат сообщения от 2 до 600 символов';
                return false;
            }
            return true;
        }

        public static function messageSend($post) {
            //if (!isset($_SESSION['user']) || count($_SESSION['user'])==0)
            //    return ["status" => "error", "message" => "Для отправки сообщений нужно войти в приложение"];
            //else{
                if(!empty($post)){
                    if(!self::messageValidate($post)){
                        return ["status" => "error", "message" => self::$error];
                    }
                    else{
                        $mail = new PHPMailer(true);
                        try {
                          $mail->SMTPDebug = 0;//SMTP::DEBUG_SERVER;
                          $mail->isSMTP();
                          $mail->Host = 'smtp.gmail.com';
                          $mail->SMTPAuth   = true;
                          $mail->Username   = 'oee.example.site@gmail.com';
                          $mail->Password   = 'pohtefdg';
                          $mail->Port = 587;
                          $mail->setFrom("oee.example.site@gmail.com","Site Support Request");
                          $mail->addAddress("sergey.levitskiy.sl@gmail.com","");//Кому отправляем
                          $mail->addReplyTo($post['email'],"Reply ");
                          $mail->SMTPSecure = 'tls';
                          $mail->isHTML(true);//HTML формат
                          $mail->Subject = 'Site Support Request from '.htmlspecialchars($post['email']);
                          $mail->Body = "Message From ".htmlspecialchars($post['name']).".<br/><b>".$post['email']."</b><br/>".htmlspecialchars($post['text']);
                          //$mail->AltBody = "Альтернативное содержание сообщения";
                          if($mail->send()){
                                return ["status" => "success", "message" => "Спасибо, ".htmlspecialchars($post['name']).".\nВаше сообщение отправлено.\nМы свяжемся с Вами в течении 24 ч."];
                          }
                          else{
                                return ["status" => "warning", "message" => "Внимание, ".htmlspecialchars($post['name']).".\nчто-то пошло не так. Не могу отправить Ваше сообщение."];
                          }
                        } catch (Exception $e) {
                                return ["status" => "error", "message" => "Извините, ".htmlspecialchars($post['name']).".\nНе могу отправить сообщение на почтовый сервер.\nОшибка отправки: {$mail->ErrorInfo}"];
                        }
                    }
                }
            //}
        }

    }

?>