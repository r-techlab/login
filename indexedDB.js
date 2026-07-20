// ============================================
// INDEXEDDB UTILITY FOR MENU ACCESS CACHING
// Stores menu access data locally for fast page loads
// Refreshes on each login (data is re-saved after login)
// ============================================

const DB_NAME = 'AppCache';
const DB_VERSION = 5;
const STORE_NAME = 'menuAccess';
const STORE_NAME_PARAMS = 'systemParams';
const STORE_NAME_CUSTOMERS = 'customers';
const STORE_NAME_STOCKS = 'stocks';
const STORE_NAME_UNITS = 'units';
const STORE_NAME_SALESMEN = 'salesmen';
const STORE_NAME_SUPPLIERS = 'suppliers';
const STORE_NAME_DASHBOARDS = 'dashboards';

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
        
        // Create object store for customers if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME_CUSTOMERS)) {
            const store = db.createObjectStore(STORE_NAME_CUSTOMERS, { keyPath: 'code' });
            store.createIndex('code', 'code', { unique: true });
        }
        
        // Create object store for stocks if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME_STOCKS)) {
            const store = db.createObjectStore(STORE_NAME_STOCKS, { keyPath: 'code' });
            store.createIndex('code', 'code', { unique: true });
        }
        
        // Create object store for units if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME_UNITS)) {
            const store = db.createObjectStore(STORE_NAME_UNITS, { keyPath: 'unitCode' });
            store.createIndex('unitCode', 'unitCode', { unique: true });
        }
        
        // Create object store for salesmen if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME_SALESMEN)) {
            const store = db.createObjectStore(STORE_NAME_SALESMEN, { keyPath: 'code' });
            store.createIndex('code', 'code', { unique: true });
        }
        
        // Create object store for dashboards if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME_DASHBOARDS)) {
            const store = db.createObjectStore(STORE_NAME_DASHBOARDS, { keyPath: 'userId' });
            store.createIndex('userId', 'userId', { unique: true });
        }
        
        // Create object store for suppliers if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME_SUPPLIERS)) {
            const store = db.createObjectStore(STORE_NAME_SUPPLIERS, { keyPath: 'code' });
            store.createIndex('code', 'code', { unique: true });
        }
    };
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        if (callback) callback(db);
    };
}

// ============================================
// MENU ACCESS CACHING
// ============================================

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

// ============================================
// CUSTOMERS CACHING
// ============================================

// Save customers to IndexedDB
function saveCustomersToDB(customers) {
    if (!customers || customers.length === 0) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_CUSTOMERS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_CUSTOMERS);
            
            // Clear existing data first
            store.clear();
            
            // Add each customer
            customers.forEach(function(customer) {
                store.put(customer);
            });
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving customers to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveCustomersToDB:', error);
            db.close();
        }
    });
}

// Get all customers from IndexedDB
function getCustomersFromDB(callback) {
    initIndexedDB(function(db) {
        if (!db) {
            if (callback) callback(null);
            return;
        }
        
        try {
            const transaction = db.transaction([STORE_NAME_CUSTOMERS], 'readonly');
            const store = transaction.objectStore(STORE_NAME_CUSTOMERS);
            const request = store.getAll();
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.length > 0) {
                    if (callback) callback(result);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading customers from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getCustomersFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear customers from IndexedDB
function clearCustomersFromDB() {
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_CUSTOMERS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_CUSTOMERS);
            store.clear();
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing customers from IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearCustomersFromDB:', error);
            db.close();
        }
    });
}

// ============================================
// STOCKS CACHING
// ============================================

// Save stocks to IndexedDB
function saveStocksToDB(stocks) {
    if (!stocks || stocks.length === 0) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_STOCKS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_STOCKS);
            
            // Clear existing data first
            store.clear();
            
            // Add each stock
            stocks.forEach(function(stock) {
                store.put(stock);
            });
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving stocks to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveStocksToDB:', error);
            db.close();
        }
    });
}

// Get all stocks from IndexedDB
function getStocksFromDB(callback) {
    initIndexedDB(function(db) {
        if (!db) {
            if (callback) callback(null);
            return;
        }
        
        try {
            const transaction = db.transaction([STORE_NAME_STOCKS], 'readonly');
            const store = transaction.objectStore(STORE_NAME_STOCKS);
            const request = store.getAll();
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.length > 0) {
                    if (callback) callback(result);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading stocks from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getStocksFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear stocks from IndexedDB
function clearStocksFromDB() {
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_STOCKS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_STOCKS);
            store.clear();
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing stocks from IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearStocksFromDB:', error);
            db.close();
        }
    });
}

// ============================================
// UNITS CACHING
// ============================================

// Save units to IndexedDB
function saveUnitsToDB(units) {
    if (!units || units.length === 0) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_UNITS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_UNITS);
            
            // Clear existing data first
            store.clear();
            
            // Add each unit
            units.forEach(function(unit) {
                store.put(unit);
            });
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving units to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveUnitsToDB:', error);
            db.close();
        }
    });
}

// Get all units from IndexedDB
function getUnitsFromDB(callback) {
    initIndexedDB(function(db) {
        if (!db) {
            if (callback) callback(null);
            return;
        }
        
        try {
            const transaction = db.transaction([STORE_NAME_UNITS], 'readonly');
            const store = transaction.objectStore(STORE_NAME_UNITS);
            const request = store.getAll();
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.length > 0) {
                    if (callback) callback(result);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading units from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getUnitsFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear units from IndexedDB
function clearUnitsFromDB() {
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_UNITS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_UNITS);
            store.clear();
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing units from IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearUnitsFromDB:', error);
            db.close();
        }
    });
}

// ============================================
// SALESMEN CACHING
// ============================================

// Save salesmen to IndexedDB
function saveSalesmenToDB(salesmen) {
    if (!salesmen || salesmen.length === 0) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_SALESMEN], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_SALESMEN);
            
            // Clear existing data first
            store.clear();
            
            // Add each salesman
            salesmen.forEach(function(salesman) {
                store.put(salesman);
            });
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving salesmen to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveSalesmenToDB:', error);
            db.close();
        }
    });
}

// Get all salesmen from IndexedDB
function getSalesmenFromDB(callback) {
    initIndexedDB(function(db) {
        if (!db) {
            if (callback) callback(null);
            return;
        }
        
        try {
            const transaction = db.transaction([STORE_NAME_SALESMEN], 'readonly');
            const store = transaction.objectStore(STORE_NAME_SALESMEN);
            const request = store.getAll();
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.length > 0) {
                    if (callback) callback(result);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading salesmen from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getSalesmenFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear salesmen from IndexedDB
function clearSalesmenFromDB() {
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_SALESMEN], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_SALESMEN);
            store.clear();
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing salesmen from IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearSalesmenFromDB:', error);
            db.close();
        }
    });
}

// ============================================
// DASHBOARDS CACHING
// ============================================

// Save dashboards for a user to IndexedDB
function saveDashboardsToDB(userId, dashboards) {
    if (!userId || !dashboards) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_DASHBOARDS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_DASHBOARDS);
            
            const data = {
                userId: userId,
                dashboards: dashboards,
                savedAt: new Date().getTime()
            };
            
            store.put(data);
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving dashboards to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveDashboardsToDB:', error);
            db.close();
        }
    });
}

// Get dashboards for a user from IndexedDB
function getDashboardsFromDB(userId, callback) {
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
            const transaction = db.transaction([STORE_NAME_DASHBOARDS], 'readonly');
            const store = transaction.objectStore(STORE_NAME_DASHBOARDS);
            const request = store.get(userId);
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.dashboards) {
                    if (callback) callback(result.dashboards);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading dashboards from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getDashboardsFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear dashboards for a user from IndexedDB
function clearDashboardsFromDB(userId) {
    if (!userId) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_DASHBOARDS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_DASHBOARDS);
            store.delete(userId);
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing dashboards from IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearDashboardsFromDB:', error);
            db.close();
        }
    });
}

// ============================================
// SUPPLIERS CACHING
// ============================================

// Save suppliers to IndexedDB
function saveSuppliersToDB(suppliers) {
    if (!suppliers || suppliers.length === 0) return;
    
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_SUPPLIERS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_SUPPLIERS);
            
            // Clear existing data first
            store.clear();
            
            // Add each supplier
            suppliers.forEach(function(supplier) {
                store.put(supplier);
            });
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error saving suppliers to IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in saveSuppliersToDB:', error);
            db.close();
        }
    });
}

// Get all suppliers from IndexedDB
function getSuppliersFromDB(callback) {
    initIndexedDB(function(db) {
        if (!db) {
            if (callback) callback(null);
            return;
        }
        
        try {
            const transaction = db.transaction([STORE_NAME_SUPPLIERS], 'readonly');
            const store = transaction.objectStore(STORE_NAME_SUPPLIERS);
            const request = store.getAll();
            
            request.onsuccess = function(event) {
                const result = event.target.result;
                db.close();
                
                if (result && result.length > 0) {
                    if (callback) callback(result);
                } else {
                    if (callback) callback(null);
                }
            };
            
            request.onerror = function(event) {
                console.error('Error reading suppliers from IndexedDB:', event.target.error);
                db.close();
                if (callback) callback(null);
            };
        } catch (error) {
            console.error('Error in getSuppliersFromDB:', error);
            db.close();
            if (callback) callback(null);
        }
    });
}

// Clear suppliers from IndexedDB
function clearSuppliersFromDB() {
    initIndexedDB(function(db) {
        if (!db) return;
        
        try {
            const transaction = db.transaction([STORE_NAME_SUPPLIERS], 'readwrite');
            const store = transaction.objectStore(STORE_NAME_SUPPLIERS);
            store.clear();
            
            transaction.oncomplete = function() {
                db.close();
            };
            
            transaction.onerror = function(event) {
                console.error('Error clearing suppliers from IndexedDB:', event.target.error);
                db.close();
            };
        } catch (error) {
            console.error('Error in clearSuppliersFromDB:', error);
            db.close();
        }
    });
}

// ============================================
// MASTER DATA REFRESH
// Clears all cached master data and re-fetches from server
// ============================================

function refreshMasterDataFromServer(callback) {
    const session = getSession();
    if (!session) {
        if (callback) callback({ status: 'error', message: 'No session' });
        return;
    }
    
    // Clear all cached master data
    clearCustomersFromDB();
    clearStocksFromDB();
    clearUnitsFromDB();
    clearSalesmenFromDB();
    clearSuppliersFromDB();
    
    let completed = 0;
    let total = 5;
    let hasError = false;
    
    function checkComplete() {
        completed++;
        if (completed >= total) {
            if (callback) {
                callback({ status: hasError ? 'error' : 'success', message: hasError ? 'Some data failed to refresh' : 'All master data refreshed successfully' });
            }
        }
    }
    
    // Re-fetch customers
    apiGetCustomers(function(response) {
        if (response.status === 'success' && response.customers) {
            saveCustomersToDB(response.customers);
        } else {
            hasError = true;
        }
        checkComplete();
    });
    
    // Re-fetch stocks
    apiGetStocks(function(response) {
        if (response.status === 'success' && response.stocks) {
            saveStocksToDB(response.stocks);
        } else {
            hasError = true;
        }
        checkComplete();
    });
    
    // Re-fetch units
    apiGetUnits(function(response) {
        if (response.status === 'success' && response.units) {
            saveUnitsToDB(response.units);
        } else {
            hasError = true;
        }
        checkComplete();
    });
    
    // Re-fetch salesmen
    apiGetSalesmen(function(response) {
        if (response.status === 'success' && response.salesmen) {
            saveSalesmenToDB(response.salesmen);
        } else {
            hasError = true;
        }
        checkComplete();
    });
    
    // Re-fetch suppliers
    apiGetSuppliers(function(response) {
        if (response.status === 'success' && response.suppliers) {
            saveSuppliersToDB(response.suppliers);
        } else {
            hasError = true;
        }
        checkComplete();
    });
}
