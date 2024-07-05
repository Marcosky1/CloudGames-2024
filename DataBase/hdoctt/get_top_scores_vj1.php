<?php
// Incluir archivo de conexión a la base de datos
include 'db_connection.php';

// Consulta SQL para obtener los 10 mejores puntajes de vj1
$sql = "SELECT u.Username, v.Score
        FROM vj1 v
        JOIN users u ON v.Username = u.Username
        ORDER BY v.Score DESC
        LIMIT 10";

$result = $conn->query($sql);

// Preparar arreglo para almacenar resultados
$top_scores = [];

if ($result->num_rows > 0) {
    // Iterar sobre los resultados y guardar en el arreglo
    while ($row = $result->fetch_assoc()) {
        $top_scores[] = [
            'Username' => $row['Username'],
            'Score' => $row['Score']
        ];
    }
} else {
    // Si no hay resultados, llenar con "-"
    for ($i = 0; $i < 10; $i++) {
        $top_scores[] = [
            'Username' => '-',
            'Score' => '-'
        ];
    }
}

// Convertir a JSON y mostrar
header('Content-Type: application/json');
echo json_encode($top_scores, JSON_PRETTY_PRINT);

// Cerrar conexión (si se utiliza un objeto de conexión en db_connection.php)
$conn->close();
?>
