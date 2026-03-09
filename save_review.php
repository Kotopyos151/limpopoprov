<?php
header('Content-Type: application/json');

// Включим вывод ошибок для отладки
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Путь к файлу с отзывами
$file = __DIR__ . '/reviews.txt';

// Проверяем доступность файла
if (!file_exists($file)) {
    if (!touch($file)) {
        echo json_encode(['error' => 'Не удалось создать файл отзывов']);
        exit;
    }
}

// Проверяем права на запись
if (!is_writable($file)) {
    echo json_encode(['error' => 'Файл недоступен для записи: ' . $file]);
    exit;
}

// Получаем данные из запроса
$data = json_decode(file_get_contents('php://input'), true);

// Логируем полученные данные
file_put_contents('debug.log', print_r($data, true), FILE_APPEND);

if (!$data || !isset($data['name']) || !isset($data['rating']) || !isset($data['text'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Неполные данные']);
    exit;
}

// Читаем существующие отзывы
$reviews = [];
if (filesize($file) > 0) {
    $content = file_get_contents($file);
    $reviews = json_decode($content, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Ошибка чтения файла: ' . json_last_error_msg()]);
        exit;
    }
}

// Добавляем новый отзыв
$reviews[] = [
    'name' => htmlspecialchars($data['name']),
    'rating' => (int)$data['rating'],
    'text' => htmlspecialchars($data['text']),
    'date' => $data['date'] ?? date('d.m.Y')
];

// Сохраняем обратно в файл
if (file_put_contents($file, json_encode($reviews, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) === false) {
    echo json_encode(['error' => 'Ошибка записи в файл']);
    exit;
}

echo json_encode(['success' => true, 'file' => $file, 'size' => filesize($file)]);
?>