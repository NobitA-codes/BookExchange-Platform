<?php
require_once 'config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'list') {
            getBooks();
        } elseif ($action === 'my-books') {
            getMyBooks();
        } elseif ($action === 'search') {
            searchBooks();
        }
        break;
    case 'POST':
        if ($action === 'add') {
            addBook();
        }
        break;
    case 'PUT':
        if ($action === 'update') {
            updateBook();
        } elseif ($action === 'toggle-availability') {
            toggleBookAvailability();
        }
        break;
    case 'DELETE':
        if ($action === 'delete') {
            deleteBook();
        }
        break;
    default:
        sendJsonResponse(['error' => 'Method not allowed'], 405);
}

function getBooks() {
    try {
        $pdo = getDBConnection();
        
        // Build query with filters
        $sql = "SELECT b.*, u.username as owner_username, u.email as owner_email 
                FROM books b 
                JOIN users u ON b.user_id = u.id 
                WHERE 1=1";
        $params = [];
        
        // Apply filters
        if (isset($_GET['genre']) && $_GET['genre'] !== '') {
            $sql .= " AND b.genre = ?";
            $params[] = $_GET['genre'];
        }
        
        if (isset($_GET['condition']) && $_GET['condition'] !== '') {
            $sql .= " AND b.condition_type = ?";
            $params[] = $_GET['condition'];
        }
        
        if (isset($_GET['availability']) && $_GET['availability'] !== '') {
            $available = $_GET['availability'] === 'available' ? 1 : 0;
            $sql .= " AND b.available = ?";
            $params[] = $available;
        }
        
        if (isset($_GET['price_filter']) && $_GET['price_filter'] !== '') {
            if ($_GET['price_filter'] === 'free') {
                $sql .= " AND LOWER(b.price) = 'free'";
            } elseif ($_GET['price_filter'] === 'paid') {
                $sql .= " AND LOWER(b.price) != 'free'";
            }
        }
        
        if (isset($_GET['title']) && $_GET['title'] !== '') {
            $sql .= " AND b.title LIKE ?";
            $params[] = '%' . $_GET['title'] . '%';
        }
        
        if (isset($_GET['author']) && $_GET['author'] !== '') {
            $sql .= " AND b.author LIKE ?";
            $params[] = '%' . $_GET['author'] . '%';
        }
        
        $sql .= " ORDER BY b.created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format books for frontend
        $formattedBooks = array_map('formatBook', $books);
        
        sendJsonResponse(['books' => $formattedBooks]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Failed to fetch books'], 500);
    }
}

function getMyBooks() {
    if (!isLoggedIn()) {
        sendJsonResponse(['error' => 'Authentication required'], 401);
    }
    
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("
            SELECT b.*, u.username as owner_username, u.email as owner_email 
            FROM books b 
            JOIN users u ON b.user_id = u.id 
            WHERE b.user_id = ? 
            ORDER BY b.created_at DESC
        ");
        $stmt->execute([$_SESSION['user_id']]);
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $formattedBooks = array_map('formatBook', $books);
        
        sendJsonResponse(['books' => $formattedBooks]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Failed to fetch your books'], 500);
    }
}

function addBook() {
    if (!isLoggedIn()) {
        sendJsonResponse(['error' => 'Authentication required'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['title']) || !isset($input['author'])) {
        sendJsonResponse(['error' => 'Title and author are required'], 400);
    }
    
    $title = sanitizeInput($input['title']);
    $author = sanitizeInput($input['author']);
    $genre = $input['genre'] ?? 'other';
    $condition = $input['condition'] ?? 'used';
    $price = sanitizeInput($input['price'] ?? 'Free');
    $contact = sanitizeInput($input['contact'] ?? $_SESSION['email']);
    $description = sanitizeInput($input['description'] ?? '');
    
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("
            INSERT INTO books (title, author, genre, condition_type, price, contact, description, user_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$title, $author, $genre, $condition, $price, $contact, $description, $_SESSION['user_id']]);
        
        $bookId = $pdo->lastInsertId();
        
        // Get the created book
        $stmt = $pdo->prepare("
            SELECT b.*, u.username as owner_username, u.email as owner_email 
            FROM books b 
            JOIN users u ON b.user_id = u.id 
            WHERE b.id = ?
        ");
        $stmt->execute([$bookId]);
        $book = $stmt->fetch(PDO::FETCH_ASSOC);
        
        sendJsonResponse(['success' => true, 'book' => formatBook($book)]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Failed to add book'], 500);
    }
}

function updateBook() {
    if (!isLoggedIn()) {
        sendJsonResponse(['error' => 'Authentication required'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        sendJsonResponse(['error' => 'Book ID is required'], 400);
    }
    
    $bookId = (int)$input['id'];
    
    try {
        $pdo = getDBConnection();
        
        // Check if book belongs to current user
        $stmt = $pdo->prepare("SELECT user_id FROM books WHERE id = ?");
        $stmt->execute([$bookId]);
        $book = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$book || $book['user_id'] != $_SESSION['user_id']) {
            sendJsonResponse(['error' => 'Book not found or access denied'], 403);
        }
        
        // Update book
        $title = sanitizeInput($input['title']);
        $author = sanitizeInput($input['author']);
        $genre = $input['genre'];
        $condition = $input['condition'];
        $price = sanitizeInput($input['price']);
        $contact = sanitizeInput($input['contact']);
        $description = sanitizeInput($input['description'] ?? '');
        
        $stmt = $pdo->prepare("
            UPDATE books 
            SET title = ?, author = ?, genre = ?, condition_type = ?, price = ?, contact = ?, description = ? 
            WHERE id = ?
        ");
        $stmt->execute([$title, $author, $genre, $condition, $price, $contact, $description, $bookId]);
        
        sendJsonResponse(['success' => true]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Failed to update book'], 500);
    }
}

function toggleBookAvailability() {
    if (!isLoggedIn()) {
        sendJsonResponse(['error' => 'Authentication required'], 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['id'])) {
        sendJsonResponse(['error' => 'Book ID is required'], 400);
    }
    
    $bookId = (int)$input['id'];
    
    try {
        $pdo = getDBConnection();
        
        // Check if book belongs to current user and get current availability
        $stmt = $pdo->prepare("SELECT user_id, available FROM books WHERE id = ?");
        $stmt->execute([$bookId]);
        $book = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$book || $book['user_id'] != $_SESSION['user_id']) {
            sendJsonResponse(['error' => 'Book not found or access denied'], 403);
        }
        
        // Toggle availability
        $newAvailability = !$book['available'];
        $stmt = $pdo->prepare("UPDATE books SET available = ? WHERE id = ?");
        $stmt->execute([$newAvailability, $bookId]);
        
        sendJsonResponse(['success' => true, 'available' => $newAvailability]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Failed to update book availability'], 500);
    }
}

function deleteBook() {
    if (!isLoggedIn()) {
        sendJsonResponse(['error' => 'Authentication required'], 401);
    }
    
    $bookId = (int)($_GET['id'] ?? 0);
    
    if (!$bookId) {
        sendJsonResponse(['error' => 'Book ID is required'], 400);
    }
    
    try {
        $pdo = getDBConnection();
        
        // Check if book belongs to current user
        $stmt = $pdo->prepare("SELECT user_id FROM books WHERE id = ?");
        $stmt->execute([$bookId]);
        $book = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$book || $book['user_id'] != $_SESSION['user_id']) {
            sendJsonResponse(['error' => 'Book not found or access denied'], 403);
        }
        
        // Delete book
        $stmt = $pdo->prepare("DELETE FROM books WHERE id = ?");
        $stmt->execute([$bookId]);
        
        sendJsonResponse(['success' => true]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Failed to delete book'], 500);
    }
}

function formatBook($book) {
    return [
        'id' => (int)$book['id'],
        'title' => $book['title'],
        'author' => $book['author'],
        'genre' => $book['genre'],
        'condition' => $book['condition_type'],
        'price' => $book['price'],
        'contact' => $book['contact'],
        'description' => $book['description'],
        'available' => (bool)$book['available'],
        'dateAdded' => $book['created_at'],
        'owner' => $book['owner_username'],
        'ownerEmail' => $book['owner_email']
    ];
}
?>