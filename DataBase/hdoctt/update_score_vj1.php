<?php
// Incluir el archivo de conexión a la base de datos
include 'db_connection.php';

// Obtener los datos JSON enviados desde la solicitud
$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

// Verificar si no hubo errores al decodificar el JSON
if (json_last_error() == JSON_ERROR_NONE) {
    // Verificar si existe el campo 'username' y 'score' en los datos recibidos
    if (isset($data['username']) && isset($data['score'])) {
        // Obtener el nombre de usuario y el nuevo puntaje
        $username = $data['username'];
        $newScore = intval($data['score']);

        // Verificar si el usuario existe en VJ1
        $checkStmt = $conn->prepare("SELECT Score FROM VJ1 WHERE Username = ?");
        $checkStmt->bind_param('s', $username);
        $checkStmt->execute();
        $checkStmt->store_result();

        // Verificar el resultado
        if ($checkStmt->num_rows > 0) {
            // El usuario existe en VJ1, comparar y actualizar el puntaje si es mayor
            $checkStmt->bind_result($currentScore);
            $checkStmt->fetch();

            if ($newScore > $currentScore) {
                // Preparar la llamada al procedimiento almacenado UpdateScoreVJ1
                $stmt = $conn->prepare("CALL UpdateScoreVJ1(?, ?)");
                $stmt->bind_param('si', $username, $newScore);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Score updated successfully in VJ1"]);
                } else {
                    echo json_encode(["error" => "Execute failed: " . $stmt->error]);
                }

                $stmt->close();
            } else {
                echo json_encode(["message" => "New score is not higher, no update needed in VJ1"]);
            }
        } else {
            // El usuario no existe en VJ1, agregarlo a Users y actualizar en VJ1
            $insertStmt = $conn->prepare("CALL InsertUser(?)");
            $insertStmt->bind_param('s', $username);

            if ($insertStmt->execute()) {
                // El usuario se registró/actualizó correctamente en Users
                // Preparar la llamada al procedimiento almacenado UpdateScoreVJ1
                $stmt = $conn->prepare("CALL UpdateScoreVJ1(?, ?)");
                $stmt->bind_param('si', $username, $newScore);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Score updated successfully in VJ1"]);
                } else {
                    echo json_encode(["error" => "Execute failed: " . $stmt->error]);
                }

                $stmt->close();
            } else {
                echo json_encode(["error" => "Execute failed: " . $insertStmt->error]);
            }

            $insertStmt->close();
        }

        $checkStmt->close();
    } else {
        echo json_encode(["error" => "Invalid input data"]);
    }
} else {
    echo json_encode(["error" => "JSON decode error: " . json_last_error_msg()]);
}

// Cerrar la conexión a la base de datos
$conn->close();
?>
