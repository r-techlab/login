// ============================================
// SECURE API HANDLER
// Centralized API calls with session validation
// ============================================

const API_URL = "https://script.google.com/macros/s/AKfycbwp0djlg7WN61NlrfJYMKKWKqB0evlidHBVSW4dWG6W4OgrJrUAvC1xsOuI9-3Wlyk/exec";

const API_TIMEOUT = 15000; // 15 seconds

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
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createCustomer&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(customerData.code)}&description=${encodeURIComponent(customerData.description)}&trn=${encodeURIComponent(customerData.trn || '')}&tel1=${encodeURIComponent(customerData.tel1 || '')}&tel2=${encodeURIComponent(customerData.tel2 || '')}&mobile=${encodeURIComponent(customerData.mobile || '')}&email1=${encodeURIComponent(customerData.email1 || '')}&email2=${encodeURIComponent(customerData.email2 || '')}&homePage=${encodeURIComponent(customerData.homePage || '')}&addressStreet=${encodeURIComponent(customerData.addressStreet || '')}&addressCity=${encodeURIComponent(customerData.addressCity || '')}&addressEmirate=${encodeURIComponent(customerData.addressEmirate || '')}&addressPO=${encodeURIComponent(customerData.addressPO || '')}&addressCountry=${encodeURIComponent(customerData.addressCountry || '')}&callback=${callbackName}`;
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
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createSupplier&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(supplierData.code)}&description=${encodeURIComponent(supplierData.description)}&trn=${encodeURIComponent(supplierData.trn || '')}&tel1=${encodeURIComponent(supplierData.tel1 || '')}&tel2=${encodeURIComponent(supplierData.tel2 || '')}&mobile=${encodeURIComponent(supplierData.mobile || '')}&email1=${encodeURIComponent(supplierData.email1 || '')}&email2=${encodeURIComponent(supplierData.email2 || '')}&homePage=${encodeURIComponent(supplierData.homePage || '')}&addressStreet=${encodeURIComponent(supplierData.addressStreet || '')}&addressCity=${encodeURIComponent(supplierData.addressCity || '')}&addressEmirate=${encodeURIComponent(supplierData.addressEmirate || '')}&addressPO=${encodeURIComponent(supplierData.addressPO || '')}&addressCountry=${encodeURIComponent(supplierData.addressCountry || '')}&callback=${callbackName}`;
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
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createSalesman&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(salesmanData.code)}&description=${encodeURIComponent(salesmanData.description)}&callback=${callbackName}`;
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
    
    const script = document.createElement('script');
    script.src = `${API_URL}?action=createStock&sessionId=${encodeURIComponent(session.sessionId)}&userId=${encodeURIComponent(session.userId)}&code=${encodeURIComponent(stockData.code)}&description=${encodeURIComponent(stockData.description)}&unitCode=${encodeURIComponent(stockData.unitCode)}&callback=${callbackName}`;
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
