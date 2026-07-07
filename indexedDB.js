// ============================================
// INDEXEDDB UTILITY FOR MENU ACCESS CACHING
// Stores menu access data locally for fast page loads
// Refreshes on each login (data is re-saved after login)
// ============================================

const DB_NAME = 'AppCache';
const DB_VERSION = 2;
const STORE_NAME = 'menuAccess';
const STORE_NAME_PARAMS = 'systemParams';

// Initialize IndexedDB database
function initIndexedDB(callback) {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = function(event) {
        console.error('IndexedDB error:', event.target.error);
        if (callback) callback(null);
    };
    
    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        
        // Create object store for menu access if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'userId' });
            store.createIndex('userId', 'userId', { unique: true });
        }
        
        // Create object store for system parameters if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME_PARAMS)) {
            db.createObjectStore(STORE_NAME_PARAMS, { keyPath: 'id' });
        }
    };
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        if (callback) callback(db);
    };
}

// Save menu access data for a user
function saveMenuAccessToDB(userId, menuAccess) {
    if (!userId || !menuAccess) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            const data = {
                userId: userId,
                menuAccess: menuAccess,
                savedAt: new Date().getTime()
            };
            
            store.put(data);
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveMenuAccessToDB:', error);
            db.close();
        }
    });
}

// Get menu access data for a user from IndexedDB
function getMenuAccessFromDB(userId, callback) {
    if (!userId) {
        if (callback) callback(null);
        return;
    }
    
    initIndexedDB(function(db) {
        if (!db) {
            if (callback) callback(null);
            return;
        }
        
        try {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(userId);
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.menuAccess) {
                    if (callback) callback(result.menuAccess);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getMenuAccessFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear menu access data for a user from IndexedDB
function clearMenuAccessFromDB(userId) {
    if (!userId) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.delete(userId);
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearMenuAccessFromDB:', error);
            db.close();
        }
    });
}

// Clear all menu access data from IndexedDB
function clearAllMenuAccessFromDB() {
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.clear();
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing all IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearAllMenuAccessFromDB:', error);
            db.close();
        }
    });
}

// ============================================
// SYSTEM PARAMETERS CACHING
// ============================================

// Save system parameters to IndexedDB
function saveSystemParamsToDB(params) {
    if (!params || Object.keys(params).length === 0) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_PARAMS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_PARAMS);
            
            const data = {
                id: 'systemParams',
                params: params,
                savedAt: new Date().getTime()
            };
            
            store.put(data);
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving system params to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveSystemParamsToDB:', error);
            db.close();
        }
    });
}

// Get system parameters from IndexedDB
function getSystemParamsFromDB(callback) {
    initIndexedDB(function(db) {
        if (!db) {
            if (callback) callback(null);
            return;
        }
        
        try {
            const transaction = db.transaction([STORE_NAME_PARAMS], 'readonly');
            const store = transaction.objectStore(STORE_NAME_PARAMS);
            const request = store.get('systemParams');
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.params) {
                    if (callback) callback(result.params);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading system params from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getSystemParamsFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear system parameters from IndexedDB
function clearSystemParamsFromDB() {
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_PARAMS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_PARAMS);
            store.delete('systemParams');
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing system params from IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearSystemParamsFromDB:', error);
            db.close();
        }
    });
}
