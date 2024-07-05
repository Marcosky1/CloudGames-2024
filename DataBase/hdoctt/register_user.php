<?php
// Incluir el archivo de conexión a la base de datos
include 'db_connection.php';

// Obtener los datos JSON enviados desde la solicitud
$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

// Verificar si no hubo errores al decodificar el JSON
if (json_last_error() == JSON_ERROR_NONE) {
    // Verificar si existe el campo 'username' en los datos recibidos
    if (isset($data['username'])) {
        // Obtener el nombre de usuario
        $username = $data['username'];

        // Preparar la llamada al procedimiento almacenado InsertUser
        $stmt = $conn->prepare("CALL InsertUser(?)");
        if ($stmt === false) {
            echo json_encode(["error" => "Prepare failed: " . $conn->error]);
            exit();
        }

        // Vincular el parámetro username
        $stmt->bind_param('s', $username);

        // Ejecutar la consulta
        if ($stmt->execute()) {
            echo json_encode(["message" => "User registered/updated successfully"]);
        } else {
            echo json_encode(["error" => "Execute failed: " . $stmt->error]);
        }

        // Cerrar la declaración preparada
        $stmt->close();
    } else {
        echo json_encode(["error" => "Invalid input data"]);
    }
} else {
    echo json_encode(["error" => "JSON decode error: " . json_last_error_msg()]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>

