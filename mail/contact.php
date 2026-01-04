<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Adresse email invalide']);
    exit;
}

$to = 'sihamalilou89@gmail.com';
$email_subject = !empty($subject) ? $subject : 'Nouveau message depuis le portfolio';
$email_subject = 'Portfolio - ' . $email_subject;

$email_body = "Vous avez reçu un nouveau message depuis votre portfolio.\n\n";
$email_body .= "Nom: " . htmlspecialchars($name) . "\n";
$email_body .= "Email: " . htmlspecialchars($email) . "\n";
if (!empty($subject)) {
    $email_body .= "Objet: " . htmlspecialchars($subject) . "\n";
}
$email_body .= "\nMessage:\n" . htmlspecialchars($message) . "\n";
$email_body .= "\n---\nCe message a été envoyé depuis le formulaire de contact de votre portfolio.\n";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: Portfolio Contact <noreply@" . $_SERVER['HTTP_HOST'] . ">\r\n";
$headers .= "Reply-To: " . htmlspecialchars($name) . " <" . htmlspecialchars($email) . ">\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "X-Priority: 1\r\n";

$result = @mail($to, $email_subject, $email_body, $headers);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès !']);
} else {
    $error = error_get_last();
    $errorMsg = 'Erreur lors de l\'envoi. ';
    if ($error && isset($error['message'])) {
        $errorMsg .= 'Détails: ' . $error['message'];
    }
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $errorMsg]);
}
?>

