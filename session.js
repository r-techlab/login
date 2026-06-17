// Session Management Utility
// Handles session creation, validation, and cleanup

const SESSION_KEY = 'userSession';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// Generate random token for session
function generateToken() {
    return 'token_' + Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Create new session after successful login
function createSession(userId) {
    const now = Date.now();
    const session = {
        userId: userId,
        token: generateToken(),
        loginTime: now,
        expiryTime: now + SESSION_DURATION
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
}

// Get current session from localStorage
function getSession() {
    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;
    
    try {
        return JSON.parse(sessionData);
    } catch (e) {
        return null;
    }
}

// Check if session is valid (exists and not expired)
function isSessionValid() {
    const session = getSession();
    if (!session) return false;
    
    const now = Date.now();
    if (now > session.expiryTime) {
        clearSession(); // Auto-clear expired session
        return false;
    }
    
    return true;
}

// Clear session (logout)
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

// Protect page - redirect to login if no valid session
function protectPage() {
    if (!isSessionValid()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}
