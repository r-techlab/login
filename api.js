// ============================================
// SECURE API HANDLER
// Centralized API calls with session validation
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbygY7Rumh7Ol0MbqnhCQI6NqBjbIpDk8CPucjWpNT7dMsgU9ksQWyQlMtxUmVGacQ/exec";
const API_TIMEOUT = 15000; // 15 seconds

// ============================================
// LOGIN API
// ============================================

function apiLogin(loginid, password, callback) {
    const callbackName = 'apiLoginCallback_' + Date.now();
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout. Please try again."
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=login&loginid=${encodeURIComponent(loginid)}&password=${encodeURIComponent(password)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error. Check your internet or Apps Script deployment."
        });
    };
    document.body.appendChild(script);
}

// ============================================
// VALIDATE SESSION API
// ============================================

function apiValidateSession(sessionId, userId, callback) {
    const callbackName = 'apiValidateCallback_' + Date.now();
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                valid: false,
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=validateSession&sessionId=${encodeURIComponent(sessionId)}&userId=${encodeURIComponent(userId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            valid: false,
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// ============================================
// LOGOUT API
// ============================================

function apiLogout(sessionId, callback) {
    const callbackName = 'apiLogoutCallback_' + Date.now();
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "success",
                message: "Logged out (timeout)"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=logout&sessionId=${encodeURIComponent(sessionId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "success",
            message: "Logged out (error)"
        });
    };
    document.body.appendChild(script);
}

// ============================================
// USER MANAGEMENT API (LOGIN MASTER)
// ============================================

// Get all users
function apiGetUsers(callback) {
    const callbackName = 'apiGetUsersCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=getUsers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Get all roles
function apiGetRoles(callback) {
    const callbackName = 'apiGetRolesCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=getRoles&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Create new user
function apiCreateUser(userData, callback) {
    const callbackName = 'apiCreateUserCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createUser&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&loginId=${encodeURIComponent(userData.loginId)}&userName=${encodeURIComponent(userData.userName)}&password=${encodeURIComponent(userData.password)}&roleId=${encodeURIComponent(userData.roleId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Update existing user
function apiUpdateUser(userData, callback) {
    const callbackName = 'apiUpdateUserCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=updateUser&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&loginId=${encodeURIComponent(userData.loginId)}&userName=${encodeURIComponent(userData.userName)}&password=${encodeURIComponent(userData.password)}&roleId=${encodeURIComponent(userData.roleId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Delete user
function apiDeleteUser(loginId, callback) {
    const callbackName = 'apiDeleteUserCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=deleteUser&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&loginId=${encodeURIComponent(loginId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// ============================================
// ROLE MANAGEMENT API (ROLE MASTER)
// ============================================

// Create new role
function apiCreateRole(roleData, callback) {
    const callbackName = 'apiCreateRoleCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createRole&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&rolesName=${encodeURIComponent(roleData.rolesName)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Update existing role
function apiUpdateRole(roleData, callback) {
    const callbackName = 'apiUpdateRoleCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=updateRole&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&rolesId=${encodeURIComponent(roleData.rolesId)}&rolesName=${encodeURIComponent(roleData.rolesName)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Delete role
function apiDeleteRole(rolesId, callback) {
    const callbackName = 'apiDeleteRoleCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=deleteRole&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&rolesId=${encodeURIComponent(rolesId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Get role usage statistics
function apiGetRoleUsage(callback) {
    const callbackName = 'apiGetRoleUsageCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=getRoleUsage&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// ============================================
// MENU ACCESS MANAGEMENT API
// ============================================

// Get all menus from MenuMaster
function apiGetAllMenus(callback) {
    const callbackName = 'apiGetAllMenusCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=getAllMenus&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Get role menu access
function apiGetRoleMenuAccess(roleId, callback) {
    const callbackName = 'apiGetRoleMenuAccessCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=getRoleMenuAccess&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&roleId=${encodeURIComponent(roleId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Update role menu access
function apiUpdateRoleMenuAccess(roleId, menuIds, callback) {
    const callbackName = 'apiUpdateRoleMenuAccessCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=updateRoleMenuAccess&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&roleId=${encodeURIComponent(roleId)}&menuIds=${encodeURIComponent(JSON.stringify(menuIds))}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// ============================================
// SYSTEM PARAMETERS MANAGEMENT API
// ============================================

// Get all system parameters
function apiGetSystemParameters(callback) {
    const callbackName = 'apiGetSystemParametersCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=getSystemParameters&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Create new system parameter
function apiCreateSystemParameter(paramData, callback) {
    const callbackName = 'apiCreateSystemParameterCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createSystemParameter&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(paramData.code)}&value=${encodeURIComponent(paramData.value)}&description=${encodeURIComponent(paramData.description)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Update existing system parameter
function apiUpdateSystemParameter(paramData, callback) {
    const callbackName = 'apiUpdateSystemParameterCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=updateSystemParameter&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(paramData.code)}&value=${encodeURIComponent(paramData.value)}&description=${encodeURIComponent(paramData.description)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Delete system parameter
function apiDeleteSystemParameter(code, callback) {
    const callbackName = 'apiDeleteSystemParameterCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=deleteSystemParameter&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(code)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// ============================================
// MENU MASTER MANAGEMENT API
// ============================================

// Create new menu
function apiCreateMenu(menuData, callback) {
    const callbackName = 'apiCreateMenuCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createMenu&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&menuName=${encodeURIComponent(menuData.menuName)}&menuType=${encodeURIComponent(menuData.menuType)}&parentMenuId=${encodeURIComponent(menuData.parentMenuId)}&pageUrl=${encodeURIComponent(menuData.pageUrl)}&sortOrder=${encodeURIComponent(menuData.sortOrder)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Update existing menu
function apiUpdateMenu(menuData, callback) {
    const callbackName = 'apiUpdateMenuCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=updateMenu&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&menuId=${encodeURIComponent(menuData.menuId)}&menuName=${encodeURIComponent(menuData.menuName)}&menuType=${encodeURIComponent(menuData.menuType)}&parentMenuId=${encodeURIComponent(menuData.parentMenuId)}&pageUrl=${encodeURIComponent(menuData.pageUrl)}&sortOrder=${encodeURIComponent(menuData.sortOrder)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}

// Delete menu
function apiDeleteMenu(menuId, callback) {
    const callbackName = 'apiDeleteMenuCallback_' + Date.now();
    const session = getSession();
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout"
            });
        }
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=deleteMenu&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&menuId=${encodeURIComponent(menuId)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    document.body.appendChild(script);
}
