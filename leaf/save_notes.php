<?php
$correctPassword = "79204";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    $content = $_POST['content'] ?? '';

    if ($password !== $correctPassword) {
        http_response_code(403);
        echo "Incorrect password.";
        exit;
    }

    $file = 'notes.txt';

    if (file_put_contents($file, $content) !== false) {
        echo "Notes saved successfully.";
    } else {
        http_response_code(500);
        echo "Failed to save notes.";
    }
} else {
    http_response_code(405);
    echo "Invalid request method.";
}
?>
