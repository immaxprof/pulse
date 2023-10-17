<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';
require __DIR__ . '/phpmailer/src/Exception.php';

// Variables and constants
$mail_settings = [
    'host' => 'smtp.gmail.com',
    'auth' => true,
    'port' => 465,
    'secure' => 'ssl',
    'username' => 'peshkomstreet@gmail.com',
    'password' => 'hzwrtkndpcrxqgvl',
    'charset' => 'UTF-8',
    'from_email' => 'peshkomstreet@gmail.com',
    'from_name' => 'Max Lankaster',
    'is_html' => true,
];

// $upload_folder_name = 'file';


$to = ['peshkomstreet@gmail.com'];
$mail_subject = 'Заказ консультации Pulse';
$mail_header = 'Данные клиента';
$order_item_msg = '';

function send_mail(array $mail_settings, array $to, string $subject, string $body, array $attachments = [] )  {   
    $mail = new PHPMailer(true);
    try {
       
        $mail->SMTPDebug = SMTP::DEBUG_OFF;                      //Disable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = $mail_settings['host'];                     //Set the SMTP server to send through
        $mail->SMTPAuth   = $mail_settings['auth'];                                   //Enable SMTP authentication
        $mail->Username   = $mail_settings['username'];                       //SMTP username
        $mail->Password   = $mail_settings['password'];                               //SMTP password
        $mail->SMTPSecure = $mail_settings['secure'];            //Enable implicit TLS encryption
        $mail->Port       = $mail_settings['port'];      
        $mail->CharSet    = $mail_settings['charset']; 

        $mail->setFrom($mail_settings['from_email'], $mail_settings['from_name']);
        foreach($to as $email) {
            $mail->addAddress($email);
        }

        if($attachments) {
            foreach ($attachments as $attachment) {
                $mail->addAttachment($attachment);
            }
        }
              
        $mail->isHTML($mail_settings['is_html']);                                  
        $mail->Subject = $subject;
    
        $mail->Body    = $body;
        $mail->AltBody = strip_tags($body);    
        
        return $mail->send();

    } catch (Exception $e) {        
        // Сообщение об ошибке нужно присвоить внешней переменной и отправить запросом в JS. Там проверить, есть ли это сообщение PHPMailer об ошибке и показать его в консоли.
        $response = ['message' => "Mail error: {$e}"];
        send_response($response);
        return false;
    }

}

function send_response($response) {
    header('Content-type: application/json'); 
    echo json_encode($response);
    exit();
}

// Обработка данных формы
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    // $maxsize = 1024 * 1024 * 3;
    // $allowed_image_types = ['image/gif', 'image/png', 'image/jpeg'];

    $name = trim(strip_tags($_POST['name']));      
	$phone = trim(strip_tags($_POST['phone']));
	$email = trim(strip_tags($_POST['email']));   
    

	if (isset($_POST['order'])) {
        $order_item = trim(strip_tags($_POST['order']));
        // $message['order'] = $order_item;
        $mail_subject = 'Оформлен заказ Pulse';
        $mail_header = 'Заказ';
        $order_item_msg = "<p><strong>Товар: </strong>{$order_item}</p>";
    }

    // Прикрепление файла
    // $image_code = "";
    // $attachments = []; 
   
   
    // $fileImage = $_FILES['image'];    

    // if($fileImage['tmp_name']) {

        // путь загрузки файла ( папка files длжна быть создана заранее)
        // if (!is_dir($upload_folder_name)) {
        //     mkdir($upload_folder_name);
        // }       
        // $filePath = "{$upload_folder_name}/{$_FILES['image']['name']}";


        //Проверяем тип загружаемого файла
        // if (!in_array($fileImage['type'], $allowed_image_types)) {
        //     $message_image = 'Запрещенный тип файла';
        //     $response = ['message_image' => $message_image, 'filePath' => $filePath];            
        //     send_response($response);
        // }

        // Проверяем размер изображения
        // if ($fileImage['size'] > $maxsize) {
        //     $message_image = 'Размер файла должен быть меньше 3Мб';
        //     $response = ['message_image' => $message_image, 'filePath' => $filePath];           
        //     send_response($response);

        // }      
       
        // копируем файл из временной папки в папку files
    //     if (copy($_FILES['image']['tmp_name'], $filePath)) {
    //         // $fileAttach = $filePath;           
    //         $image_code = '<p><strong>Фото в приложении</strong></p>';
    //         $attachments[] = $filePath; // создвем аргумент для send_Mail
    //         $message_image = 'Изображение загружено!';
    //     }
    // }   

    $body = "<h1>{$mail_header}</h1>
    <p><strong>Имя: </strong>{$name}</p>
    <p><strong>Телефон: </strong>{$phone}</p>
    <p><strong>E-mail: </strong>{$email}</p>
    {$order_item_msg}";

           
    //     Main Script    
    $send_result = send_mail($mail_settings, $to, $mail_subject, $body);

    $send_message = $send_result ? 'Данные отправлены на почту' : 'Ошибка отправки данных на почту';
    $response = ['message' => $send_message];   
    // $response = ['message' => 'test JS mode'];   
    send_response($response); 

}

