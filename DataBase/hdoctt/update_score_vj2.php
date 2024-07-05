<?php
// Incluir el archivo de conexión a la base de datos
include 'db_connection.php';

// Obtener los datos JSON enviados desde la solicitud
$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

// Verificar si no hubo errores al decodificar el JSON
if (json_last_error() == JSON_ERROR_NONE) {
    // Verificar si existe el campo 'username' y 'timeCompleted' en los datos recibidos
    if (isset($data['username']) && isset($data['timeCompleted'])) {
        // Obtener el nombre de usuario y el nuevo tiempo completado
        $username = $data['username'];
        $newTimeCompleted = $data['timeCompleted']; // asume que el formato es correcto en la solicitud

        // Verificar si el usuario existe en VJ2
        $checkStmt = $conn->prepare("SELECT TimeCompleted FROM VJ2 WHERE Username = ?");
        $checkStmt->bind_param('s', $username);
        $checkStmt->execute();
        $checkStmt->store_result();

        // Verificar el resultado
        if ($checkStmt->num_rows > 0) {
            // El usuario existe en VJ2, actualizar el tiempo completado
            $checkStmt->bind_result($currentTimeCompleted);
            $checkStmt->fetch();

            // Preparar la llamada al procedimiento almacenado UpdateScoreVJ2
            $stmt = $conn->prepare("CALL UpdateScoreVJ2(?, ?)");
            $stmt->bind_param('ss', $username, $newTimeCompleted);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Time completed updated successfully in VJ2"]);
            } else {
                echo json_encode(["error" => "Execute failed: " . $stmt->error]);
            }

            $stmt->close();
        } else {
            // El usuario no existe en VJ2, agregarlo a Users y actualizar en VJ2
            $insertStmt = $conn->prepare("CALL InsertUser(?)");
            $insertStmt->bind_param('s', $username);

            if ($insertStmt->execute()) {
                // El usuario se registró/actualizó correctamente en Users
                // Preparar la llamada al procedimiento almacenado UpdateScoreVJ2
                $stmt = $conn->prepare("CALL UpdateScoreVJ2(?, ?)");
                $stmt->bind_param('ss', $username, $newTimeCompleted);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Time completed updated successfully in VJ2"]);
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
