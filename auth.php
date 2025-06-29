<?php
require_once 'config.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'POST':
        if ($action === 'login') {
            handleLogin();
        } elseif ($action === 'signup') {
            handleSignup();
        } elseif ($action === 'logout') {
            handleLogout();
        }
        break;
    case 'GET':
        if ($action === 'check') {
            checkAuthStatus();
        }
        break;
    default:
        sendJsonResponse(['error' => 'Method not allowed'], 405);
}

function handleLogin() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['email']) || !isset($input['password'])) {
        sendJsonResponse(['error' => 'Email and password required'], 400);
    }
    
    $email = sanitizeInput($input['email']);
    $password = $input['password'];
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(['error' => 'Invalid email format'], 400);
    }
    
    try {
        $pdo = getDBConnection();
        $stmt = $pdo->prepare("SELECT id, username, email, password FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            
            sendJsonResponse([
                'success' => true,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ]
            ]);
        } else {
            sendJsonResponse(['error' => 'Invalid credentials'], 401);
        }
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Login failed'], 500);
    }
}

function handleSignup() {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
        sendJsonResponse(['error' => 'Username, email and password required'], 400);
    }
    
    $username = sanitizeInput($input['username']);
    $email = sanitizeInput($input['email']);
    $password = $input['password'];
    
    // Validation
    if (strlen($username) < 3) {
        sendJsonResponse(['error' => 'Username must be at least 3 characters'], 400);
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse(['error' => 'Invalid email format'], 400);
    }
    
    if (strlen($password) < 6) {
        sendJsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }
    
    try {
        $pdo = getDBConnection();
        
        // Check if username or email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            sendJsonResponse(['error' => 'Username or email already exists'], 400);
        }
        
        // Hash password and create user
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $hashedPassword]);
        
        $userId = $pdo->lastInsertId();
        
        // Auto-login after signup
        $_SESSION['user_id'] = $userId;
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        
        sendJsonResponse([
            'success' => true,
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email
            ]
        ]);
    } catch (Exception $e) {
        sendJsonResponse(['error' => 'Signup failed'], 500);
    }
}

function handleLogout() {
    session_destroy();
    sendJsonResponse(['success' => true]);
}

function checkAuthStatus() {
    if (isLoggedIn()) {
        $user = getCurrentUser();
        sendJsonResponse([
            'authenticated' => true,
            'user' => $user
        ]);
    } else {
        sendJsonResponse(['authenticated' => false]);
    }
}
?>