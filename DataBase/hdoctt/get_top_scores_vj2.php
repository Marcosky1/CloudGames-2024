<?php
// Incluir archivo de conexión a la base de datos
require_once 'db_connection.php';

// Consulta SQL para obtener los 10 mejores tiempos completados de vj2
$sql = "SELECT u.Username, v.TimeCompleted
        FROM vj2 v
        JOIN users u ON v.Username = u.Username
        ORDER BY v.TimeCompleted ASC
        LIMIT 10";

$result = $conn->query($sql);

// Preparar arreglo para almacenar resultados
$top_scores = [];

if ($result->num_rows > 0) {
    // Iterar sobre los resultados y guardar en el arreglo
    while ($row = $result->fetch_assoc()) {
        $top_scores[] = [
            'Username' => $row['Username'],
            'TimeCompleted' => $row['TimeCompleted']
        ];
    }
} else {
    // Si no hay resultados, llenar con "-"
    for ($i = 0; $i < 10; $i++) {
        $top_scores[] = [
            'Username' => '-',
            'TimeCompleted' => '-'
        ];
    }
}

// Convertir a JSON y mostrar
header('Content-Type: application/json');
echo json_encode($top_scores, JSON_PRETTY_PRINT);

// Cerrar conexión (si se utiliza un objeto de conexión en db_connection.php)
$conn->close();
?>
