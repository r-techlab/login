// ============================================
// SECURE SESSION MANAGEMENT UTILITY
// Client-side session with server-side validation
// ============================================

const SESSION_KEY = 'userSession';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

// ============================================
// SESSION MANAGEMENT
// ============================================

// Create new session after successful login
function createSession(userData) {
    const now = Date.now();
    const session = {
        sessionId: userData.sessionId,  // Server-generated session ID
        userId: userData.userId,
        userName: userData.userName || userData.userId,
        roleId: userData.roleId,
        roleName: userData.roleName,
        menuAccess: userData.menuAccess || [],
        loginTime: now,
        expiryTime: userData.expiryTime || (now + SESSION_DURATION)
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

// Check if session exists locally (basic check)
function hasLocalSession() {
    const session = getSession();
    if (!session) return false;
    
    const now = Date.now();
    if (now > session.expiryTime) {
        clearSession();
        return false;
    }
    
    return true;
}

// Validate session with server (secure check)
function validateSessionWithServer(callback) {
    const session = getSession();
    
    if (!session || !session.sessionId || !session.userId) {
        callback({
            valid: false,
            message: "No session found"
        });
        return;
    }
    
    // Check local expiry first
    const now = Date.now();
    if (now > session.expiryTime) {
        clearSession();
        callback({
            valid: false,
            message: "Session expired locally"
        });
        return;
    }
    
    // Validate with server
    apiValidateSession(session.sessionId, session.userId, function(response) {
        if (response.status === "success" && response.valid) {
            // Update session with fresh data from server
            updateSession(response);
            callback({
                valid: true,
                userData: response
            });
        } else {
            // Server says session is invalid
            clearSession();
            callback({
                valid: false,
                message: response.message || "Invalid session"
            });
        }
    });
}

// Update session with fresh data from server
function updateSession(serverData) {
    const session = getSession();
    if (session) {
        session.userName = serverData.userName || session.userName;
        session.roleId = serverData.roleId || session.roleId;
        session.roleName = serverData.roleName || session.roleName;
        session.menuAccess = serverData.menuAccess || session.menuAccess;
        session.expiryTime = serverData.expiryTime || session.expiryTime;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
}

// Clear session (logout)
function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}

// Protect page - redirect to login if no valid session
function protectPage(callback) {
    // First check if local session exists
    if (!hasLocalSession()) {
        window.location.href = 'index.html';
        return false;
    }
    
    // Then validate with server
    validateSessionWithServer(function(result) {
        if (!result.valid) {
            alert(result.message || 'Session expired. Please login again.');
            window.location.href = 'index.html';
            if (callback) callback(false);
        } else {
            if (callback) callback(true);
        }
    });
    
    return true; // Temporary return while validation is in progress
}

// ============================================
// MENU FUNCTIONS
// ============================================

// Get user's menu access
function getUserMenuAccess() {
    const session = getSession();
    return session ? session.menuAccess : [];
}

// Check if user has access to a specific menu
function hasMenuAccess(menuId) {
    const menuAccess = getUserMenuAccess();
    return menuAccess.some(menu => menu.menuId === menuId);
}

// Build hierarchical menu structure
function buildMenuHierarchy() {
    const menuAccess = getUserMenuAccess();
    const menuMap = {};
    const rootMenus = [];
    
    // Create a map of all menus
    menuAccess.forEach(menu => {
        menuMap[menu.menuId] = {
            ...menu,
            children: []
        };
    });
    
    // Build hierarchy
    menuAccess.forEach(menu => {
        if (menu.parentMenuId === null || menu.parentMenuId === 'NULL' || menu.parentMenuId === '') {
            // Root level menu
            rootMenus.push(menuMap[menu.menuId]);
        } else {
            // Child menu - add to parent
            const parent = menuMap[menu.parentMenuId];
            if (parent) {
                parent.children.push(menuMap[menu.menuId]);
            }
        }
    });
    
    // Sort children by sortOrder
    Object.values(menuMap).forEach(menu => {
        if (menu.children.length > 0) {
            menu.children.sort((a, b) => a.sortOrder - b.sortOrder);
        }
    });
    
    return rootMenus;
}

// ============================================
// LOGOUT FUNCTION
// ============================================

function performLogout(callback) {
    const session = getSession();
    
    if (session && session.sessionId) {
        // Call server to invalidate session
        apiLogout(session.sessionId, function(response) {
            clearSession();
            if (callback) {
                callback(response);
            } else {
                window.location.href = 'index.html';
            }
        });
    } else {
        // No session, just clear and redirect
        clearSession();
        if (callback) {
            callback({ status: "success" });
        } else {
            window.location.href = 'index.html';
        }
    }
}
