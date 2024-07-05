<?php
// Incluir el archivo de conexión a la base de datos
include 'db_connection.php';

// Obtener los datos JSON enviados desde la solicitud
$postData = file_get_contents("php://input");
$data = json_decode($postData, true);

// Verificar si no hubo errores al decodificar el JSON
if (json_last_error() == JSON_ERROR_NONE) {
    // Verificar si existe el campo 'username', 'score' y 'coins' en los datos recibidos
    if (isset($data['username']) && isset($data['score']) && isset($data['coins'])) {
        // Obtener el nombre de usuario, el nuevo puntaje y las nuevas monedas
        $username = $data['username'];
        $newScore = intval($data['score']);
        $newCoins = intval($data['coins']);

        // Verificar si el usuario existe en VJ3
        $checkStmt = $conn->prepare("SELECT Score, Coins FROM VJ3 WHERE Username = ?");
        $checkStmt->bind_param('s', $username);
        $checkStmt->execute();
        $checkStmt->store_result();

        // Verificar el resultado
        if ($checkStmt->num_rows > 0) {
            // El usuario existe en VJ3, comparar y actualizar el puntaje y las monedas si son mayores
            $checkStmt->bind_result($currentScore, $currentCoins);
            $checkStmt->fetch();

            $updateScore = ($newScore > $currentScore) ? $newScore : $currentScore;
            $updateCoins = ($newCoins > $currentCoins) ? $newCoins : $currentCoins;

            // Preparar la llamada al procedimiento almacenado UpdateScoreVJ3
            $stmt = $conn->prepare("CALL UpdateScoreVJ3(?, ?, ?)");
            $stmt->bind_param('sii', $username, $updateScore, $updateCoins);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Score and coins updated successfully in VJ3"]);
            } else {
                echo json_encode(["error" => "Execute failed: " . $stmt->error]);
            }

            $stmt->close();
        } else {
            // El usuario no existe en VJ3, agregarlo a Users y actualizar en VJ3
            $insertStmt = $conn->prepare("CALL InsertUser(?)");
            $insertStmt->bind_param('s', $username);

            if ($insertStmt->execute()) {
                // El usuario se registró/actualizó correctamente en Users
                // Preparar la llamada al procedimiento almacenado UpdateScoreVJ3
                $stmt = $conn->prepare("CALL UpdateScoreVJ3(?, ?, ?)");
                $stmt->bind_param('sii', $username, $newScore, $newCoins);

                if ($stmt->execute()) {
                    echo json_encode(["message" => "Score and coins updated successfully in VJ3"]);
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
