// ============================================
// SECURE API HANDLER
// Centralized API calls with session validation
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbym07v7HW6Ay0qr981tKKcX8FW5hgc5VY-LB-dtBFoEl1B1H7C0kxSgTj0pH8g0olA/exec";

const API_TIMEOUT = 60000; // 60 seconds

// ============================================
// DIAGNOSTIC: Test API connection from browser console
// Usage: testApiConnection('getOpeningStocks')
// ============================================
function testApiConnection(action) {
    const session = getSession();
    if (!session) {
        console.error('No active session found. Please login first.');
        return;
    }
    const testUrl = `${API_URL}?action=${encodeURIComponent(action || 'getOpeningStocks')}&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=1&pageSize=10&search=&callback=testCallback`;
    console.log('Testing API URL:', testUrl);
    console.log('Open this URL in a new tab to see the raw response.');
    console.log('If you see HTML instead of JSON, the Apps Script has an error.');
    return testUrl;
}

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
// OPENING STOCK BALANCE MANAGEMENT API
// ============================================

// Get all opening stocks with pagination and search
function getOpeningStocks(session, page, pageSize, search, callback) {
    const callbackName = 'jsonp_getOpeningStocks_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=getOpeningStocks&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        console.error('JSONP request failed for getOpeningStocks. URL:', script.src);
        callback({
            status: "error",
            message: "Connection error. The server returned an unexpected response (possibly HTML instead of JSON). Check that the Apps Script is deployed correctly and the SOPHeader sheet exists."
        });
    };
    document.body.appendChild(script);
}

// Get single opening stock by DocNo
function getOpeningStockByDocNo(session, docNo, callback) {
    const callbackName = 'jsonp_getOpeningStockByDocNo_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=getOpeningStockByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// CHART OF ACCOUNTS (COA) MANAGEMENT API
// ============================================

// Get all accounts
function apiGetCOA(callback) {
    const callbackName = 'apiGetCOACallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=getCOA&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Create new account
function apiCreateCOA(accountData, callback) {
    const callbackName = 'apiCreateCOACallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=createCOA&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&accountData=${encodeURIComponent(JSON.stringify(accountData))}&callback=${callbackName}`;
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

// Update existing account
function apiUpdateCOA(accountData, callback) {
    const callbackName = 'apiUpdateCOACallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=updateCOA&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&accountData=${encodeURIComponent(JSON.stringify(accountData))}&callback=${callbackName}`;
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

// Delete account
function apiDeleteCOA(srno, callback) {
    const callbackName = 'apiDeleteCOACallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=deleteCOA&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&srno=${encodeURIComponent(srno)}&callback=${callbackName}`;
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

// Create new opening stock
function createOpeningStock(session, openingStockData, callback) {
    const callbackName = 'jsonp_createOpeningStock_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=createOpeningStock&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&openingStockData=${encodeURIComponent(JSON.stringify(openingStockData))}&callback=${callbackName}`;
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

// Update existing opening stock
function updateOpeningStock(session, openingStockData, callback) {
    const callbackName = 'jsonp_updateOpeningStock_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=updateOpeningStock&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&openingStockData=${encodeURIComponent(JSON.stringify(openingStockData))}&callback=${callbackName}`;
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

// Delete opening stock
function deleteOpeningStock(session, docNo, callback) {
    const callbackName = 'jsonp_deleteOpeningStock_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=deleteOpeningStock&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// STOCK ADJUSTMENT MANAGEMENT API
// ============================================

// Get all stock adjustments with pagination and search
function getStockAdjustments(session, page, pageSize, search, callback) {
    const callbackName = 'jsonp_getStockAdjustments_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=getStockAdjustments&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
    script.onerror = function() {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        console.error('JSONP request failed for getStockAdjustments. URL:', script.src);
        callback({
            status: "error",
            message: "Connection error."
        });
    };
    document.body.appendChild(script);
}

// Get single stock adjustment by DocNo
function getStockAdjustmentByDocNo(session, docNo, callback) {
    const callbackName = 'jsonp_getStockAdjustmentByDocNo_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=getStockAdjustmentByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new stock adjustment
function createStockAdjustment(session, stockAdjustmentData, callback) {
    const callbackName = 'jsonp_createStockAdjustment_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=createStockAdjustment&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&stockAdjustmentData=${encodeURIComponent(JSON.stringify(stockAdjustmentData))}&callback=${callbackName}`;
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

// Update existing stock adjustment
function updateStockAdjustment(session, stockAdjustmentData, callback) {
    const callbackName = 'jsonp_updateStockAdjustment_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=updateStockAdjustment&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&stockAdjustmentData=${encodeURIComponent(JSON.stringify(stockAdjustmentData))}&callback=${callbackName}`;
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

// Delete stock adjustment
function deleteStockAdjustment(session, docNo, callback) {
    const callbackName = 'jsonp_deleteStockAdjustment_' + Date.now();
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=deleteStockAdjustment&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post ADJ to StockTransaction
function apiPostADJToStockTransaction(docNo, callback) {
    const callbackName = 'jsonp_postADJ_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=postADJToStockTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel ADJ stock transaction post
function apiCancelADJStockTransactionPost(docNo, callback) {
    const callbackName = 'jsonp_cancelADJPost_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=cancelADJStockTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// STOCK TRANSACTION POSTING API
// ============================================

// Post SOP to StockTransaction
function apiPostSOPToStockTransaction(docNo, callback) {
    const callbackName = 'jsonp_postSOP_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=postSOPToStockTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel SOP stock transaction post
function apiCancelSOPStockTransactionPost(docNo, callback) {
    const callbackName = 'jsonp_cancelSOPPost_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=cancelSOPStockTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post PI to StockTransaction
function apiPostPIToStockTransaction(docNo, callback) {
    const callbackName = 'jsonp_postPI_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=postPIToStockTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel PI stock transaction post
function apiCancelPIStockTransactionPost(docNo, callback) {
    const callbackName = 'jsonp_cancelPIPost_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=cancelPIStockTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post SI to StockTransaction
function apiPostSIToStockTransaction(docNo, callback) {
    const callbackName = 'jsonp_postSI_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=postSIToStockTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel SI stock transaction post
function apiCancelSIStockTransactionPost(docNo, callback) {
    const callbackName = 'jsonp_cancelSIPost_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=cancelSIStockTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Get stock balance (aggregated by stock code)
function apiGetStockBalance(search, callback) {
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    
    const callbackName = 'jsonp_getStockBalance_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=getStockBalance&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get stock card (movement ledger for a specific stock item)
function apiGetStockCard(stockCode, fromDate, toDate, callback) {
    if (typeof fromDate === 'function') {
        callback = fromDate;
        fromDate = '';
        toDate = '';
    } else if (typeof toDate === 'function') {
        callback = toDate;
        toDate = '';
    }
    
    const callbackName = 'jsonp_getStockCard_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
    }, API_TIMEOUT);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    var url = `${API_URL}?action=getStockCard&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&stockCode=${encodeURIComponent(stockCode)}&callback=${callbackName}`;
    if (fromDate) {
        url += `&fromDate=${encodeURIComponent(fromDate)}`;
    }
    if (toDate) {
        url += `&toDate=${encodeURIComponent(toDate)}`;
    }
    
    const script = document.createElement('script');
    script.src = url;
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

// Get stock transactions
function apiGetStockTransaction(callback) {
    const callbackName = 'jsonp_getStockTransaction_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        delete window[callbackName];
        callback({
            status: "error",
            message: "Request timeout"
        });
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
    script.src = `${API_URL}?action=getStockTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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
// DASHBOARD API
// ============================================

// Get dashboard data
function apiGetDashboard(callback) {
    const callbackName = 'apiGetDashboardCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getDashboard&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Update dashboard record
function apiUpdateDashboard(dashboardData, callback) {
    const callbackName = 'apiUpdateDashboardCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateDashboard&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(dashboardData.code)}&description=${encodeURIComponent(dashboardData.description || '')}&roles=${encodeURIComponent(dashboardData.roles || '')}&users=${encodeURIComponent(dashboardData.users || '')}&callback=${callbackName}`;
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

// Get user-specific dashboards (filtered by role and user)
function apiGetUserDashboards(callback) {
    const callbackName = 'apiGetUserDashboardsCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getUserDashboards&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&roleId=${encodeURIComponent(session.roleId)}&callback=${callbackName}`;
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
// DASHBOARD API
// ============================================

// Get salesman sales summary for dashboard (code 10001)
function apiGetSalesmanSalesSummary(callback) {
    const callbackName = 'apiGetSalesmanSalesSummaryCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getSalesmanSalesSummary&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Get customer sales summary for dashboard (code 10002)
function apiGetCustomerSalesSummary(callback) {
    const callbackName = 'apiGetCustomerSalesSummaryCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getCustomerSalesSummary&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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
// LOGO MASTER MANAGEMENT API
// ============================================

// Get all logos
function apiGetLogos(callback) {
    const callbackName = 'apiGetLogosCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getLogos&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Upload logo file - stores base64 data in the sheet (no Drive needed)
// Uses JSONP (GET) to avoid CORS issues with Apps Script
function apiUploadLogo(base64Data, fileName, mimeType, callback) {
    const callbackName = 'apiUploadLogoCallback_' + Date.now();
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
    }, 30000);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=uploadLogo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&base64Data=${encodeURIComponent(base64Data)}&fileName=${encodeURIComponent(fileName)}&mimeType=${encodeURIComponent(mimeType)}&callback=${callbackName}`;
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

// Create new logo (uses POST to handle large base64 data)
function apiCreateLogo(logoData, callback) {
    const session = getSession();
    
    const xhr = new XMLHttpRequest();
    
    const timeoutId = setTimeout(function() {
        xhr.abort();
        callback({
            status: "error",
            message: "Request timeout"
        });
    }, 30000); // 30 second timeout for uploads
    
    xhr.onload = function() {
        clearTimeout(timeoutId);
        try {
            const data = JSON.parse(xhr.responseText);
            callback(data);
        } catch (e) {
            callback({
                status: "error",
                message: "Invalid response from server"
            });
        }
    };
    
    xhr.onerror = function() {
        clearTimeout(timeoutId);
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    
    xhr.open('POST', API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    const params = new URLSearchParams();
    params.append('action', 'createLogo');
    params.append('sessionId', session.sessionId);
    params.append('userId', session.userId);
    params.append('code', logoData.code);
    params.append('description', logoData.description);
    params.append('logoPath', logoData.logoPath || '');
    params.append('logoData', logoData.logoData || '');
    
    xhr.send(params.toString());
}

// Update existing logo (uses POST to handle large base64 data)
function apiUpdateLogo(logoData, callback) {
    const session = getSession();
    
    const xhr = new XMLHttpRequest();
    
    const timeoutId = setTimeout(function() {
        xhr.abort();
        callback({
            status: "error",
            message: "Request timeout"
        });
    }, 30000); // 30 second timeout for uploads
    
    xhr.onload = function() {
        clearTimeout(timeoutId);
        try {
            const data = JSON.parse(xhr.responseText);
            callback(data);
        } catch (e) {
            callback({
                status: "error",
                message: "Invalid response from server"
            });
        }
    };
    
    xhr.onerror = function() {
        clearTimeout(timeoutId);
        callback({
            status: "error",
            message: "Connection error"
        });
    };
    
    xhr.open('POST', API_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
    const params = new URLSearchParams();
    params.append('action', 'updateLogo');
    params.append('sessionId', session.sessionId);
    params.append('userId', session.userId);
    params.append('code', logoData.code);
    params.append('description', logoData.description);
    params.append('logoPath', logoData.logoPath || '');
    params.append('logoData', logoData.logoData || '');
    
    xhr.send(params.toString());
}

// Delete logo
function apiDeleteLogo(code, callback) {
    const callbackName = 'apiDeleteLogoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteLogo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(code)}&callback=${callbackName}`;
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
// SALES MANAGEMENT API
// ============================================

// Get all sales (with server-side pagination)
function apiGetSales(page, pageSize, search, callback) {
    // Handle optional parameters - if search is omitted, shift arguments
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    if (typeof pageSize === 'function') {
        callback = pageSize;
        pageSize = 10;
        page = 1;
    }
    
    const callbackName = 'apiGetSalesCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getSales&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get single sale by DocNo
function apiGetSaleByDocNo(docNo, callback) {
    const callbackName = 'apiGetSaleByDocNoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getSaleByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new sale
function apiCreateSale(saleData, callback) {
    const callbackName = 'apiCreateSaleCallback_' + Date.now();
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
    script.src = `${API_URL}?action=createSale&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&saleData=${encodeURIComponent(JSON.stringify(saleData))}&callback=${callbackName}`;
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

// Update existing sale
function apiUpdateSale(saleData, callback) {
    const callbackName = 'apiUpdateSaleCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateSale&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&saleData=${encodeURIComponent(JSON.stringify(saleData))}&callback=${callbackName}`;
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

// Delete sale
function apiDeleteSale(docNo, callback) {
    const callbackName = 'apiDeleteSaleCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteSale&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// SALES REPORT API
// ============================================

// Get sales report with date range and filters
function apiGetSalesReport(filters, callback) {
    const callbackName = 'apiGetSalesReportCallback_' + Date.now();
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
    
    var params = 'action=getSalesReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&customer=' + encodeURIComponent(filters.customer || '') +
        '&salesman=' + encodeURIComponent(filters.salesman || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// PURCHASE REPORT API
// ============================================

// Get purchase report with date range and filters
function apiGetPurchaseReport(filters, callback) {
    const callbackName = 'apiGetPurchaseReportCallback_' + Date.now();
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
    
    var params = 'action=getPurchaseReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&supplier=' + encodeURIComponent(filters.supplier || '') +
        '&salesman=' + encodeURIComponent(filters.salesman || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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

// Get stock adjustment report with date range
function apiGetStockAdjustmentReport(filters, callback) {
    const callbackName = 'apiGetStockAdjustmentReportCallback_' + Date.now();
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
    
    var params = 'action=getStockAdjustmentReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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

// Get opening stock report with date range
function apiGetOpeningStockReport(filters, callback) {
    const callbackName = 'apiGetOpeningStockReportCallback_' + Date.now();
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
    
    var params = 'action=getOpeningStockReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// CUSTOMER MASTER MANAGEMENT API
// ============================================

// Get all customers
function apiGetCustomers(callback) {
    const callbackName = 'apiGetCustomersCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getCustomers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Get the next auto-generated customer code from the server
function apiGetNextCustomerCode(callback) {
    const callbackName = 'apiGetNextCustomerCodeCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getNextCustomerCode&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Create new customer
function apiCreateCustomer(customerData, callback) {
    const callbackName = 'apiCreateCustomerCallback_' + Date.now();
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
    
    // Only include the code parameter if it is provided (server auto-generates when absent)
    var url = `${API_URL}?action=createCustomer&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&description=${encodeURIComponent(customerData.description)}&trn=${encodeURIComponent(customerData.trn || '')}&tel1=${encodeURIComponent(customerData.tel1 || '')}&tel2=${encodeURIComponent(customerData.tel2 || '')}&mobile=${encodeURIComponent(customerData.mobile || '')}&email1=${encodeURIComponent(customerData.email1 || '')}&email2=${encodeURIComponent(customerData.email2 || '')}&homePage=${encodeURIComponent(customerData.homePage || '')}&addressStreet=${encodeURIComponent(customerData.addressStreet || '')}&addressCity=${encodeURIComponent(customerData.addressCity || '')}&addressEmirate=${encodeURIComponent(customerData.addressEmirate || '')}&addressPO=${encodeURIComponent(customerData.addressPO || '')}&addressCountry=${encodeURIComponent(customerData.addressCountry || '')}&callback=${callbackName}`;
    if (customerData.code) {
        url += `&code=${encodeURIComponent(customerData.code)}`;
    }
    
    const script = document.createElement('script');
    script.src = url;
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

// Update existing customer
function apiUpdateCustomer(customerData, callback) {
    const callbackName = 'apiUpdateCustomerCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateCustomer&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(customerData.code)}&description=${encodeURIComponent(customerData.description)}&trn=${encodeURIComponent(customerData.trn || '')}&tel1=${encodeURIComponent(customerData.tel1 || '')}&tel2=${encodeURIComponent(customerData.tel2 || '')}&mobile=${encodeURIComponent(customerData.mobile || '')}&email1=${encodeURIComponent(customerData.email1 || '')}&email2=${encodeURIComponent(customerData.email2 || '')}&homePage=${encodeURIComponent(customerData.homePage || '')}&addressStreet=${encodeURIComponent(customerData.addressStreet || '')}&addressCity=${encodeURIComponent(customerData.addressCity || '')}&addressEmirate=${encodeURIComponent(customerData.addressEmirate || '')}&addressPO=${encodeURIComponent(customerData.addressPO || '')}&addressCountry=${encodeURIComponent(customerData.addressCountry || '')}&callback=${callbackName}`;
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

// Delete customer
function apiDeleteCustomer(code, callback) {
    const callbackName = 'apiDeleteCustomerCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteCustomer&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(code)}&callback=${callbackName}`;
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
// ACCOUNT TRANSACTION API
// ============================================

// Get account transactions by docType and docNo
function apiGetAccountTransactions(docType, docNo, callback) {
    const callbackName = 'apiGetAccountTransactionsCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getAccountTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docType=${encodeURIComponent(docType)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post SI to AccountTransaction (Sales Accounting)
function apiPostSIToAccountTransaction(docNo, callback) {
    const callbackName = 'apiPostSIToAccountTransactionCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=postSIToAccountTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel SI AccountTransaction Post
function apiCancelSIAccountTransactionPost(docNo, callback) {
    const callbackName = 'apiCancelSIAccountTransactionPostCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=cancelSIAccountTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// PURCHASE MANAGEMENT API
// ============================================

// Get all purchases (with server-side pagination)
function apiGetPurchases(page, pageSize, search, callback) {
    // Handle optional parameters - if search is omitted, shift arguments
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    if (typeof pageSize === 'function') {
        callback = pageSize;
        pageSize = 10;
        page = 1;
    }
    
    const callbackName = 'apiGetPurchasesCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getPurchases&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get single purchase by DocNo
function apiGetPurchaseByDocNo(docNo, callback) {
    const callbackName = 'apiGetPurchaseByDocNoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getPurchaseByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new purchase
function apiCreatePurchase(purchaseData, callback) {
    const callbackName = 'apiCreatePurchaseCallback_' + Date.now();
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
    script.src = `${API_URL}?action=createPurchase&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&purchaseData=${encodeURIComponent(JSON.stringify(purchaseData))}&callback=${callbackName}`;
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

// Update existing purchase
function apiUpdatePurchase(purchaseData, callback) {
    const callbackName = 'apiUpdatePurchaseCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updatePurchase&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&purchaseData=${encodeURIComponent(JSON.stringify(purchaseData))}&callback=${callbackName}`;
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

// Delete purchase
function apiDeletePurchase(docNo, callback) {
    const callbackName = 'apiDeletePurchaseCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deletePurchase&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// JOURNAL VOUCHER MANAGEMENT API
// ============================================

// Get all journal vouchers (with server-side pagination)
function apiGetJournalVouchers(page, pageSize, search, callback) {
    // Handle optional parameters - if search is omitted, shift arguments
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    if (typeof pageSize === 'function') {
        callback = pageSize;
        pageSize = 10;
        page = 1;
    }
    
    const callbackName = 'apiGetJournalVouchersCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getJournalVouchers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get single journal voucher by DocNo
function apiGetJournalVoucherByDocNo(docNo, callback) {
    const callbackName = 'apiGetJournalVoucherByDocNoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getJournalVoucherByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new journal voucher
// Uses a longer timeout (30s) because writing header + detail rows to Google Sheets can take time
function apiCreateJournalVoucher(jvData, callback) {
    const callbackName = 'apiCreateJournalVoucherCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout. The server took too long to respond. Check that the Apps Script is deployed with the latest code (action=createJournalVoucher)."
            });
        }
    }, 30000);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createJournalVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&jvData=${encodeURIComponent(JSON.stringify(jvData))}&callback=${callbackName}`;
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

// Update existing journal voucher
function apiUpdateJournalVoucher(jvData, callback) {
    const callbackName = 'apiUpdateJournalVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateJournalVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&jvData=${encodeURIComponent(JSON.stringify(jvData))}&callback=${callbackName}`;
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

// Delete journal voucher
function apiDeleteJournalVoucher(docNo, callback) {
    const callbackName = 'apiDeleteJournalVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteJournalVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post JV to AccountTransaction (Journal Voucher Accounting)
function apiPostJVToAccountTransaction(docNo, callback) {
    const callbackName = 'apiPostJVToAccountTransactionCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=postJVToAccountTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel JV AccountTransaction Post (Delete entries)
function apiCancelJVAccountTransactionPost(docNo, callback) {
    const callbackName = 'apiCancelJVAccountTransactionPostCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=cancelJVAccountTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// JOURNAL VOUCHER REPORT API
// ============================================

// Get journal voucher report with date range and filters
function apiGetJournalVoucherReport(filters, callback) {
    const callbackName = 'apiGetJournalVoucherReportCallback_' + Date.now();
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
    
    var params = 'action=getJournalVoucherReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// BANK RECEIPT VOUCHER (BRV) MANAGEMENT API
// ============================================

// Get all bank receipt vouchers (with server-side pagination)
function apiGetBankReceiptVouchers(page, pageSize, search, callback) {
    // Handle optional parameters - if search is omitted, shift arguments
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    if (typeof pageSize === 'function') {
        callback = pageSize;
        pageSize = 10;
        page = 1;
    }
    
    const callbackName = 'apiGetBankReceiptVouchersCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getBankReceiptVouchers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get single bank receipt voucher by DocNo
function apiGetBankReceiptVoucherByDocNo(docNo, callback) {
    const callbackName = 'apiGetBankReceiptVoucherByDocNoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getBankReceiptVoucherByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new bank receipt voucher
// Uses a longer timeout (30s) because writing header + detail rows to Google Sheets can take time
function apiCreateBankReceiptVoucher(brvData, callback) {
    const callbackName = 'apiCreateBankReceiptVoucherCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout. The server took too long to respond. Check that the Apps Script is deployed with the latest code (action=createBankReceiptVoucher)."
            });
        }
    }, 30000);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createBankReceiptVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&brvData=${encodeURIComponent(JSON.stringify(brvData))}&callback=${callbackName}`;
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

// Update existing bank receipt voucher
function apiUpdateBankReceiptVoucher(brvData, callback) {
    const callbackName = 'apiUpdateBankReceiptVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateBankReceiptVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&brvData=${encodeURIComponent(JSON.stringify(brvData))}&callback=${callbackName}`;
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

// Delete bank receipt voucher
function apiDeleteBankReceiptVoucher(docNo, callback) {
    const callbackName = 'apiDeleteBankReceiptVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteBankReceiptVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post BRV to AccountTransaction (Bank Receipt Voucher Accounting)
function apiPostBRVToAccountTransaction(docNo, callback) {
    const callbackName = 'apiPostBRVToAccountTransactionCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=postBRVToAccountTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel BRV AccountTransaction Post (Delete entries)
function apiCancelBRVAccountTransactionPost(docNo, callback) {
    const callbackName = 'apiCancelBRVAccountTransactionPostCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=cancelBRVAccountTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// BANK RECEIPT VOUCHER REPORT API
// ============================================

// Get bank receipt voucher report with date range and filters
function apiGetBankReceiptVoucherReport(filters, callback) {
    const callbackName = 'apiGetBankReceiptVoucherReportCallback_' + Date.now();
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
    
    var params = 'action=getBankReceiptVoucherReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// CASH RECEIPT VOUCHER (CRV) MANAGEMENT API
// ============================================

// Get all cash receipt vouchers (with server-side pagination)
function apiGetCashReceiptVouchers(page, pageSize, search, callback) {
    // Handle optional parameters - if search is omitted, shift arguments
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    if (typeof pageSize === 'function') {
        callback = pageSize;
        pageSize = 10;
        page = 1;
    }
    
    const callbackName = 'apiGetCashReceiptVouchersCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getCashReceiptVouchers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get single cash receipt voucher by DocNo
function apiGetCashReceiptVoucherByDocNo(docNo, callback) {
    const callbackName = 'apiGetCashReceiptVoucherByDocNoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getCashReceiptVoucherByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new cash receipt voucher
// Uses a longer timeout (30s) because writing header + detail rows to Google Sheets can take time
function apiCreateCashReceiptVoucher(crvData, callback) {
    const callbackName = 'apiCreateCashReceiptVoucherCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout. The server took too long to respond. Check that the Apps Script is deployed with the latest code (action=createCashReceiptVoucher)."
            });
        }
    }, 30000);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createCashReceiptVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&crvData=${encodeURIComponent(JSON.stringify(crvData))}&callback=${callbackName}`;
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

// Update existing cash receipt voucher
function apiUpdateCashReceiptVoucher(crvData, callback) {
    const callbackName = 'apiUpdateCashReceiptVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateCashReceiptVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&crvData=${encodeURIComponent(JSON.stringify(crvData))}&callback=${callbackName}`;
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

// Delete cash receipt voucher
function apiDeleteCashReceiptVoucher(docNo, callback) {
    const callbackName = 'apiDeleteCashReceiptVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteCashReceiptVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post CRV to AccountTransaction (Cash Receipt Voucher Accounting)
function apiPostCRVToAccountTransaction(docNo, callback) {
    const callbackName = 'apiPostCRVToAccountTransactionCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=postCRVToAccountTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel CRV AccountTransaction Post (Delete entries)
function apiCancelCRVAccountTransactionPost(docNo, callback) {
    const callbackName = 'apiCancelCRVAccountTransactionPostCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=cancelCRVAccountTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// CASH RECEIPT VOUCHER REPORT API
// ============================================

// Get cash receipt voucher report with date range and filters
function apiGetCashReceiptVoucherReport(filters, callback) {
    const callbackName = 'apiGetCashReceiptVoucherReportCallback_' + Date.now();
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
    
    var params = 'action=getCashReceiptVoucherReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// BANK PAYMENT VOUCHER (BPV) MANAGEMENT API
// ============================================

// Get all bank payment vouchers (with server-side pagination)
function apiGetBankPaymentVouchers(page, pageSize, search, callback) {
    // Handle optional parameters - if search is omitted, shift arguments
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    if (typeof pageSize === 'function') {
        callback = pageSize;
        pageSize = 10;
        page = 1;
    }
    
    const callbackName = 'apiGetBankPaymentVouchersCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getBankPaymentVouchers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get single bank payment voucher by DocNo
function apiGetBankPaymentVoucherByDocNo(docNo, callback) {
    const callbackName = 'apiGetBankPaymentVoucherByDocNoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getBankPaymentVoucherByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new bank payment voucher
// Uses a longer timeout (30s) because writing header + detail rows to Google Sheets can take time
function apiCreateBankPaymentVoucher(bpvData, callback) {
    const callbackName = 'apiCreateBankPaymentVoucherCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout. The server took too long to respond. Check that the Apps Script is deployed with the latest code (action=createBankPaymentVoucher)."
            });
        }
    }, 30000);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createBankPaymentVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&bpvData=${encodeURIComponent(JSON.stringify(bpvData))}&callback=${callbackName}`;
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

// Update existing bank payment voucher
function apiUpdateBankPaymentVoucher(bpvData, callback) {
    const callbackName = 'apiUpdateBankPaymentVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateBankPaymentVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&bpvData=${encodeURIComponent(JSON.stringify(bpvData))}&callback=${callbackName}`;
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

// Delete bank payment voucher
function apiDeleteBankPaymentVoucher(docNo, callback) {
    const callbackName = 'apiDeleteBankPaymentVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteBankPaymentVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post BPV to AccountTransaction (Bank Payment Voucher Accounting)
function apiPostBPVToAccountTransaction(docNo, callback) {
    const callbackName = 'apiPostBPVToAccountTransactionCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=postBPVToAccountTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel BPV AccountTransaction Post (Delete entries)
function apiCancelBPVAccountTransactionPost(docNo, callback) {
    const callbackName = 'apiCancelBPVAccountTransactionPostCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=cancelBPVAccountTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// BANK PAYMENT VOUCHER REPORT API
// ============================================

// Get bank payment voucher report with date range and filters
function apiGetBankPaymentVoucherReport(filters, callback) {
    const callbackName = 'apiGetBankPaymentVoucherReportCallback_' + Date.now();
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
    
    var params = 'action=getBankPaymentVoucherReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// CASH PAYMENT VOUCHER (CPV) MANAGEMENT API
// ============================================

// Get all cash payment vouchers (with server-side pagination)
function apiGetCashPaymentVouchers(page, pageSize, search, callback) {
    // Handle optional parameters - if search is omitted, shift arguments
    if (typeof search === 'function') {
        callback = search;
        search = '';
    }
    if (typeof pageSize === 'function') {
        callback = pageSize;
        pageSize = 10;
        page = 1;
    }
    
    const callbackName = 'apiGetCashPaymentVouchersCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getCashPaymentVouchers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&callback=${callbackName}`;
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

// Get single cash payment voucher by DocNo
function apiGetCashPaymentVoucherByDocNo(docNo, callback) {
    const callbackName = 'apiGetCashPaymentVoucherByDocNoCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getCashPaymentVoucherByDocNo&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Create new cash payment voucher
// Uses a longer timeout (30s) because writing header + detail rows to Google Sheets can take time
function apiCreateCashPaymentVoucher(cpvData, callback) {
    const callbackName = 'apiCreateCashPaymentVoucherCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    const timeoutId = setTimeout(function() {
        if (window[callbackName]) {
            delete window[callbackName];
            if (script && script.parentNode) {
                document.body.removeChild(script);
            }
            callback({
                status: "error",
                message: "Request timeout. The server took too long to respond. Check that the Apps Script is deployed with the latest code (action=createCashPaymentVoucher)."
            });
        }
    }, 30000);
    
    window[callbackName] = function(data) {
        clearTimeout(timeoutId);
        delete window[callbackName];
        if (script && script.parentNode) {
            document.body.removeChild(script);
        }
        callback(data);
    };
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createCashPaymentVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&cpvData=${encodeURIComponent(JSON.stringify(cpvData))}&callback=${callbackName}`;
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

// Update existing cash payment voucher
function apiUpdateCashPaymentVoucher(cpvData, callback) {
    const callbackName = 'apiUpdateCashPaymentVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateCashPaymentVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&cpvData=${encodeURIComponent(JSON.stringify(cpvData))}&callback=${callbackName}`;
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

// Delete cash payment voucher
function apiDeleteCashPaymentVoucher(docNo, callback) {
    const callbackName = 'apiDeleteCashPaymentVoucherCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteCashPaymentVoucher&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Post CPV to AccountTransaction (Cash Payment Voucher Accounting)
function apiPostCPVToAccountTransaction(docNo, callback) {
    const callbackName = 'apiPostCPVToAccountTransactionCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=postCPVToAccountTransaction&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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

// Cancel CPV AccountTransaction Post (Delete entries)
function apiCancelCPVAccountTransactionPost(docNo, callback) {
    const callbackName = 'apiCancelCPVAccountTransactionPostCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    script.src = `${API_URL}?action=cancelCPVAccountTransactionPost&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&docNo=${encodeURIComponent(docNo)}&callback=${callbackName}`;
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
// CASH PAYMENT VOUCHER REPORT API
// ============================================

// Get cash payment voucher report with date range and filters
function apiGetCashPaymentVoucherReport(filters, callback) {
    const callbackName = 'apiGetCashPaymentVoucherReportCallback_' + Date.now();
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
    
    var params = 'action=getCashPaymentVoucherReport' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&reportType=' + encodeURIComponent(filters.reportType || 'headerwise') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// STATEMENT OF ACCOUNT API
// ============================================

// Get statement of account for a party (Customer or Supplier)
function apiGetStatementOfAccount(filters, callback) {
    const callbackName = 'apiGetStatementOfAccountCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    
    var params = 'action=getStatementOfAccount' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&acCode=' + encodeURIComponent(filters.acCode || '') +
        '&partyType=' + encodeURIComponent(filters.partyType || '') +
        '&partyCode=' + encodeURIComponent(filters.partyCode || '') +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// DOCUMENT ALLOCATION (AR / AP) API
// ============================================

// Get the pending documents of a party for allocation (SI for AR, PI for AP)
// params: { acCode, subledgerDocNo, docType, docNo, currentAllocations }
function apiGetAllocationOutstanding(params, callback) {
    const callbackName = 'apiGetAllocationOutstandingCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    
    var urlParams = 'action=getAllocationOutstanding' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&acCode=' + encodeURIComponent(params.acCode || '') +
        '&subledgerDocNo=' + encodeURIComponent(params.subledgerDocNo || '') +
        '&docType=' + encodeURIComponent(params.docType || '') +
        '&docNo=' + encodeURIComponent(params.docNo || '') +
        '&fromAmount=' + encodeURIComponent(params.fromAmount === undefined || params.fromAmount === null ? '' : params.fromAmount) +
        '&excludeDocType=' + encodeURIComponent(params.excludeDocType || '') +
        '&excludeDocNo=' + encodeURIComponent(params.excludeDocNo || '') +
        '&currentAllocations=' + encodeURIComponent(params.currentAllocations || '') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + urlParams;
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

// Get the saved (pending) allocations of a voucher, grouped by detail serial number
function apiGetVoucherAllocations(docType, docNo, callback) {
    const callbackName = 'apiGetVoucherAllocationsCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    
    var urlParams = 'action=getVoucherAllocations' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&docType=' + encodeURIComponent(docType || '') +
        '&docNo=' + encodeURIComponent(docNo || '') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + urlParams;
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

// Get trial balance report
function apiGetTrialBalance(filters, callback) {
    const callbackName = 'apiGetTrialBalanceCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    
    var params = 'action=getTrialBalance' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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

// Get Profit and Loss (P&L) report - income and expense accounts for a date range
function apiGetProfitAndLoss(filters, callback) {
    const callbackName = 'apiGetProfitAndLossCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    
    var params = 'action=getProfitAndLoss' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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

// Get Balance Sheet report - asset, liability and equity accounts for a date range
function apiGetBalanceSheet(filters, callback) {
    const callbackName = 'apiGetBalanceSheetCallback_' + Date.now();
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
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
    
    var params = 'action=getBalanceSheet' +
        '&sessionId=' + encodeURIComponent(session.sessionId) +
        '&userId=' + encodeURIComponent(session.userId) +
        '&fromDate=' + encodeURIComponent(filters.fromDate || '') +
        '&toDate=' + encodeURIComponent(filters.toDate || '') +
        '&callback=' + callbackName;
    
    const script = document.createElement('script');
    script.src = API_URL + '?' + params;
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
// SUPPLIER MASTER MANAGEMENT API
// ============================================


// Get all suppliers
function apiGetSuppliers(callback) {
    const callbackName = 'apiGetSuppliersCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getSuppliers&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Get the next auto-generated supplier code from the server
function apiGetNextSupplierCode(callback) {
    const callbackName = 'apiGetNextSupplierCodeCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getNextSupplierCode&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Create new supplier
function apiCreateSupplier(supplierData, callback) {
    const callbackName = 'apiCreateSupplierCallback_' + Date.now();
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
    
    // Only include the code parameter if it is provided (server auto-generates when absent)
    var url = `${API_URL}?action=createSupplier&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&description=${encodeURIComponent(supplierData.description)}&trn=${encodeURIComponent(supplierData.trn || '')}&tel1=${encodeURIComponent(supplierData.tel1 || '')}&tel2=${encodeURIComponent(supplierData.tel2 || '')}&mobile=${encodeURIComponent(supplierData.mobile || '')}&email1=${encodeURIComponent(supplierData.email1 || '')}&email2=${encodeURIComponent(supplierData.email2 || '')}&homePage=${encodeURIComponent(supplierData.homePage || '')}&addressStreet=${encodeURIComponent(supplierData.addressStreet || '')}&addressCity=${encodeURIComponent(supplierData.addressCity || '')}&addressEmirate=${encodeURIComponent(supplierData.addressEmirate || '')}&addressPO=${encodeURIComponent(supplierData.addressPO || '')}&addressCountry=${encodeURIComponent(supplierData.addressCountry || '')}&callback=${callbackName}`;
    if (supplierData.code) {
        url += `&code=${encodeURIComponent(supplierData.code)}`;
    }
    
    const script = document.createElement('script');
    script.src = url;
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

// Update existing supplier
function apiUpdateSupplier(supplierData, callback) {
    const callbackName = 'apiUpdateSupplierCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateSupplier&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(supplierData.code)}&description=${encodeURIComponent(supplierData.description)}&trn=${encodeURIComponent(supplierData.trn || '')}&tel1=${encodeURIComponent(supplierData.tel1 || '')}&tel2=${encodeURIComponent(supplierData.tel2 || '')}&mobile=${encodeURIComponent(supplierData.mobile || '')}&email1=${encodeURIComponent(supplierData.email1 || '')}&email2=${encodeURIComponent(supplierData.email2 || '')}&homePage=${encodeURIComponent(supplierData.homePage || '')}&addressStreet=${encodeURIComponent(supplierData.addressStreet || '')}&addressCity=${encodeURIComponent(supplierData.addressCity || '')}&addressEmirate=${encodeURIComponent(supplierData.addressEmirate || '')}&addressPO=${encodeURIComponent(supplierData.addressPO || '')}&addressCountry=${encodeURIComponent(supplierData.addressCountry || '')}&callback=${callbackName}`;
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

// Delete supplier
function apiDeleteSupplier(code, callback) {
    const callbackName = 'apiDeleteSupplierCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteSupplier&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(code)}&callback=${callbackName}`;
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
// SALESMAN MASTER MANAGEMENT API
// ============================================


// Get all salesmen
function apiGetSalesmen(callback) {
    const callbackName = 'apiGetSalesmenCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getSalesmen&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Get the next auto-generated salesman code from the server
function apiGetNextSalesmanCode(callback) {
    const callbackName = 'apiGetNextSalesmanCodeCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getNextSalesmanCode&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Create new salesman
function apiCreateSalesman(salesmanData, callback) {
    const callbackName = 'apiCreateSalesmanCallback_' + Date.now();
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
    
    // Only include the code parameter if it is provided (server auto-generates when absent)
    var url = `${API_URL}?action=createSalesman&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&description=${encodeURIComponent(salesmanData.description)}&callback=${callbackName}`;
    if (salesmanData.code) {
        url += `&code=${encodeURIComponent(salesmanData.code)}`;
    }
    
    const script = document.createElement('script');
    script.src = url;
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

// Update existing salesman
function apiUpdateSalesman(salesmanData, callback) {
    const callbackName = 'apiUpdateSalesmanCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateSalesman&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(salesmanData.code)}&description=${encodeURIComponent(salesmanData.description)}&callback=${callbackName}`;
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

// Delete salesman
function apiDeleteSalesman(code, callback) {
    const callbackName = 'apiDeleteSalesmanCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteSalesman&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(code)}&callback=${callbackName}`;
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

// Update role menu access (POST - avoids URL size limits for large menu lists)
function apiUpdateRoleMenuAccess(roleId, menuIds, callback) {
    const session = getSession();
    if (!session) {
        callback({ status: "error", message: "No active session" });
        return;
    }
    
    let settled = false;
    const controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    
    const timeoutId = setTimeout(function() {
        if (settled) return;
        settled = true;
        if (controller) controller.abort();
        callback({
            status: "error",
            message: "Request timeout"
        });
    }, API_TIMEOUT);
    
    const params = new URLSearchParams();
    params.append('action', 'updateRoleMenuAccess');
    params.append('sessionId', session.sessionId);
    params.append('userId', session.userId);
    params.append('roleId', roleId);
    params.append('menuIds', JSON.stringify(menuIds));
    
    fetch(API_URL + '?action=updateRoleMenuAccess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        signal: controller ? controller.signal : undefined
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        callback(data);
    })
    .catch(function(err) {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        if (err && err.name === 'AbortError') {
            callback({
                status: "error",
                message: "Request timeout"
            });
            return;
        }
        callback({
            status: "error",
            message: "Connection error"
        });
    });
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
// UNIT MASTER MANAGEMENT API
// ============================================

// Get all units
function apiGetUnits(callback) {
    const callbackName = 'apiGetUnitsCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getUnits&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Create new unit
function apiCreateUnit(unitData, callback) {
    const callbackName = 'apiCreateUnitCallback_' + Date.now();
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
    script.src = `${API_URL}?action=createUnit&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&unitCode=${encodeURIComponent(unitData.unitCode)}&unitDescription=${encodeURIComponent(unitData.unitDescription)}&callback=${callbackName}`;
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

// Update existing unit
function apiUpdateUnit(unitData, callback) {
    const callbackName = 'apiUpdateUnitCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateUnit&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&unitCode=${encodeURIComponent(unitData.unitCode)}&unitDescription=${encodeURIComponent(unitData.unitDescription)}&callback=${callbackName}`;
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

// Delete unit
function apiDeleteUnit(unitCode, callback) {
    const callbackName = 'apiDeleteUnitCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteUnit&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&unitCode=${encodeURIComponent(unitCode)}&callback=${callbackName}`;
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
// STOCK MASTER MANAGEMENT API
// ============================================

// Get all stocks
function apiGetStocks(callback) {
    const callbackName = 'apiGetStocksCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getStocks&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Get the next auto-generated stock code from the server
function apiGetNextStockCode(callback) {
    const callbackName = 'apiGetNextStockCodeCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getNextStockCode&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&callback=${callbackName}`;
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

// Create new stock
function apiCreateStock(stockData, callback) {
    const callbackName = 'apiCreateStockCallback_' + Date.now();
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
    
    // Only include the code parameter if it is provided (server auto-generates when absent)
    var url = `${API_URL}?action=createStock&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&description=${encodeURIComponent(stockData.description)}&unitCode=${encodeURIComponent(stockData.unitCode)}&callback=${callbackName}`;
    if (stockData.code) {
        url += `&code=${encodeURIComponent(stockData.code)}`;
    }
    
    const script = document.createElement('script');
    script.src = url;
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

// Update existing stock
function apiUpdateStock(stockData, callback) {
    const callbackName = 'apiUpdateStockCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateStock&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(stockData.code)}&description=${encodeURIComponent(stockData.description)}&unitCode=${encodeURIComponent(stockData.unitCode)}&callback=${callbackName}`;
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

// Delete stock
function apiDeleteStock(code, callback) {
    const callbackName = 'apiDeleteStockCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteStock&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(code)}&callback=${callbackName}`;
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
// STOCK UNIT MANAGEMENT API
// ============================================

// Get all stock units for a given stock code
function apiGetStockUnits(stockCode, callback) {
    const callbackName = 'apiGetStockUnitsCallback_' + Date.now();
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
    script.src = `${API_URL}?action=getStockUnits&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&stockCode=${encodeURIComponent(stockCode)}&callback=${callbackName}`;
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

// Create new stock unit
function apiCreateStockUnit(unitData, callback) {
    const callbackName = 'apiCreateStockUnitCallback_' + Date.now();
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
    script.src = `${API_URL}?action=createStockUnit&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&stockCode=${encodeURIComponent(unitData.stockCode)}&unit=${encodeURIComponent(unitData.unit)}&fromQty=${encodeURIComponent(unitData.fromQty)}&toQty=${encodeURIComponent(unitData.toQty)}&callback=${callbackName}`;
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

// Update existing stock unit
function apiUpdateStockUnit(unitData, callback) {
    const callbackName = 'apiUpdateStockUnitCallback_' + Date.now();
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
    script.src = `${API_URL}?action=updateStockUnit&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&stockCode=${encodeURIComponent(unitData.stockCode)}&unit=${encodeURIComponent(unitData.unit)}&fromQty=${encodeURIComponent(unitData.fromQty)}&toQty=${encodeURIComponent(unitData.toQty)}&callback=${callbackName}`;
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

// Delete stock unit
function apiDeleteStockUnit(stockCode, unit, callback) {
    const callbackName = 'apiDeleteStockUnitCallback_' + Date.now();
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
    script.src = `${API_URL}?action=deleteStockUnit&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&stockCode=${encodeURIComponent(stockCode)}&unit=${encodeURIComponent(unit)}&callback=${callbackName}`;
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
