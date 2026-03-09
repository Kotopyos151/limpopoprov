<?php
header('Content-Type: application/json');

$file = __DIR__ . '/reviews.txt';

if (!file_exists($file)) {
    echo json_encode(['error' => 'Файл не существует']);
    exit;
}

if (!is_readable($file)) {
    echo json_encode(['error' => 'Файл недоступен для чтения']);
    exit;
}

$content = file_get_contents($file);

if ($content === false) {
    echo json_encode(['error' => 'Ошибка чтения файла']);
    exit;
}

if (empty($content)) {
    echo json_encode([]);
    exit;
}

$reviews = json_decode($content, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'Ошибка парсинга JSON: ' . json_last_error_msg()]);
    exit;
}

// Добавляем информацию о файле для отладки
$result = [
    'reviews' => array_reverse($reviews),
    'debug' => [
        'file' => $file,
        'size' => filesize($file),
        'modified' => date('Y-m-d H:i:s', filemtime($file))
    ]
];

echo json_encode($result, JSON_UNESCAPED_UNICODE);
?>