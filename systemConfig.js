// ============================================
// SYSTEM CONFIGURATION UTILITY
// Manages system parameters (CompanyName, Title, etc.)
// ============================================

// Cache for system parameters
let systemParametersCache = null;
let systemParametersLoading = false;
let systemParametersCallbacks = [];

/**
 * Load system parameters from API
 * @param {Function} callback - Callback function(parameters)
 */
function loadSystemParameters(callback) {
    // If already cached, return immediately
    if (systemParametersCache) {
        callback(systemParametersCache);
        return;
    }
    
    // Add callback to queue
    systemParametersCallbacks.push(callback);
    
    // If already loading, wait for it
    if (systemParametersLoading) {
        return;
    }
    
    // Start loading
    systemParametersLoading = true;
    
    // Check if user is logged in (not needed for login page)
    const session = getSession ? getSession() : null;
    
    if (!session) {
        // For login page, try to fetch without session (public parameters)
        // This allows CompanyName and Title to show on login page
        fetchParametersPublic();
        return;
    }
    
    // Fetch from API
    apiGetSystemParameters(function(response) {
        systemParametersLoading = false;
        
        if (response.status === 'success' && response.parameters) {
            // Convert array to object for easy lookup
            systemParametersCache = {};
            response.parameters.forEach(param => {
                systemParametersCache[param.code] = param.value;
            });
        } else {
            // Empty cache on error
            systemParametersCache = {};
        }
        
        // Call all waiting callbacks
        systemParametersCallbacks.forEach(cb => cb(systemParametersCache));
        systemParametersCallbacks = [];
    });
}

/**
 * Fetch parameters without session (for login page)
 */
function fetchParametersPublic() {
    // For login page, we'll use a simple approach
    // Try to get from localStorage if previously cached
    const cachedParams = localStorage.getItem('systemParams');
    if (cachedParams) {
        try {
            systemParametersCache = JSON.parse(cachedParams);
            systemParametersLoading = false;
            systemParametersCallbacks.forEach(cb => cb(systemParametersCache));
            systemParametersCallbacks = [];
            return;
        } catch (e) {
            // Invalid cache, continue
        }
    }
    
    // Otherwise return empty for now
    systemParametersCache = {};
    systemParametersLoading = false;
    systemParametersCallbacks.forEach(cb => cb(systemParametersCache));
    systemParametersCallbacks = [];
}

/**
 * Get a specific system parameter value
 * @param {String} code - Parameter code (e.g., 'CompanyName', 'Title')
 * @param {String} defaultValue - Default value if not found
 * @returns {String} Parameter value or default
 */
function getSystemParameter(code, defaultValue = '') {
    if (!systemParametersCache) {
        return defaultValue;
    }
    return systemParametersCache[code] || defaultValue;
}

/**
 * Set page title in browser tab
 * @param {String} pageUrl - URL/filename of the current page (e.g., 'home.html', 'loginmaster.htm')
 */
function setPageTitle(pageUrl) {
    loadSystemParameters(function(params) {
        const companyName = params['CompanyName'] || params['Title'] || 'System';
        
        if (!pageUrl) {
            document.title = companyName;
            return;
        }
        
        // Try to get menu name from session's menuAccess
        const session = getSession ? getSession() : null;
        if (session && session.menuAccess && Array.isArray(session.menuAccess)) {
            // Find menu item that matches current page URL
            const currentMenu = session.menuAccess.find(menu => {
                if (menu.pageUrl) {
                    // Normalize URLs for comparison (remove leading ./ or /)
                    const normalizedMenuUrl = menu.pageUrl.replace(/^\.?\//, '').toLowerCase();
                    const normalizedPageUrl = pageUrl.replace(/^\.?\//, '').toLowerCase();
                    return normalizedMenuUrl === normalizedPageUrl;
                }
                return false;
            });
            
            if (currentMenu && currentMenu.menuName) {
                document.title = `${companyName} - ${currentMenu.menuName}`;
                return;
            }
        }
        
        // Fallback: use pageUrl as-is (remove extension and capitalize)
        const pageName = pageUrl.replace(/\.(html?|htm)$/i, '').replace(/[-_]/g, ' ');
        const capitalizedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
        document.title = `${companyName} - ${capitalizedName}`;
    });
}

/**
 * Display company name in specified element
 * @param {String} elementId - ID of element to display company name
 * @param {Object} options - Display options (style, className, etc.)
 */
function displayCompanyName(elementId, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    // Show loading state
    element.innerHTML = '<span style="color: #999;">Loading...</span>';
    
    loadSystemParameters(function(params) {
        const companyName = params['CompanyName'] || '';
        
        if (companyName) {
            // Apply custom styling if provided
            let style = options.style || '';
            let className = options.className || '';
            
            element.innerHTML = `<span class="${className}" style="${style}">${escapeHtml(companyName)}</span>`;
        } else {
            // Clear if no company name found
            element.innerHTML = '';
        }
    });
}

/**
 * Initialize system configuration for a page
 * @param {String} pageName - Name of the current page
 * @param {String} companyNameElementId - ID of element for company name (optional)
 * @param {Object} displayOptions - Options for company name display
 */
function initSystemConfig(pageName, companyNameElementId = null, displayOptions = {}) {
    // Set page title
    setPageTitle(pageName);
    
    // Display company name if element ID provided
    if (companyNameElementId) {
        displayCompanyName(companyNameElementId, displayOptions);
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {String} text - Text to escape
 * @returns {String} Escaped HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Clear system parameters cache (useful for logout)
 */
function clearSystemParametersCache() {
    systemParametersCache = null;
    systemParametersLoading = false;
    systemParametersCallbacks = [];
}

/**
 * Save parameters to localStorage for login page access
 */
function cacheParametersToStorage() {
    if (systemParametersCache && Object.keys(systemParametersCache).length > 0) {
        try {
            localStorage.setItem('systemParams', JSON.stringify(systemParametersCache));
        } catch (e) {
            // Ignore storage errors
        }
    }
}

// Auto-save to localStorage when parameters are loaded
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        if (systemParametersCache && Object.keys(systemParametersCache).length > 0) {
            cacheParametersToStorage();
        }
    });
}
