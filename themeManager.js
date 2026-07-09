// ============================================
// THEME MANAGER
// Manages dynamic color themes via System Parameters
// ============================================

// Default theme colors (fallback if system parameters not set)
const DEFAULT_THEME = {
    primary: '#1565C0',
    secondary: '#E3F2FD',
    background: '#FFFFFF',
    text: '#263238',
    accent: '#00ACC1',
    primaryDark: '#0D47A1',
    primaryLight: '#42A5F5'
};

// Cache for theme colors
let themeColorsCache = null;

/**
 * Apply the theme by reading system parameters and injecting CSS variables
 * @param {Function} callback - Optional callback after theme is applied
 */
function applyTheme(callback) {
    // If already applied, just call callback
    if (themeColorsCache) {
        injectThemeVariables(themeColorsCache);
        if (callback) callback();
        return;
    }
    
    // Load system parameters and extract theme colors
    loadSystemParameters(function(params) {
        const colors = {
            primary: params['PrimaryColor'] || DEFAULT_THEME.primary,
            secondary: params['SecondaryColor'] || DEFAULT_THEME.secondary,
            background: params['BackgroundColor'] || DEFAULT_THEME.background,
            text: params['TextColor'] || DEFAULT_THEME.text,
            accent: params['AccentColor'] || DEFAULT_THEME.accent,
            primaryDark: darkenColor(params['PrimaryColor'] || DEFAULT_THEME.primary, 0.2),
            primaryLight: lightenColor(params['PrimaryColor'] || DEFAULT_THEME.primary, 0.3)
        };
        
        themeColorsCache = colors;
        injectThemeVariables(colors);
        
        if (callback) callback();
    });
}

/**
 * Inject CSS variables into the page as a <style> block
 */
function injectThemeVariables(colors) {
    // Remove existing theme style if any
    const existingStyle = document.getElementById('dynamic-theme-variables');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'dynamic-theme-variables';
    style.textContent = `
        :root {
            --primary: ${colors.primary};
            --primary-dark: ${colors.primaryDark};
            --primary-light: ${colors.primaryLight};
            --secondary: ${colors.secondary};
            --background: ${colors.background};
            --text: ${colors.text};
            --accent: ${colors.accent};
            --primary-rgb: ${hexToRgb(colors.primary)};
        }
        
        /* Override common inline styles with CSS variables */
        body {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
            color: var(--text) !important;
        }
        
        .container, .login-box {
            background: var(--background) !important;
        }
        
        .header {
            border-bottom-color: var(--primary) !important;
        }
        
        .company-name-header, .company-name-sidebar {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
            color: #ffffff !important;
        }
        
        thead {
            background: var(--primary) !important;
        }
        
        .stats-card, .dashboard-card, .menu-stat-card {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%) !important;
        }
        
        .modal-header {
            border-bottom-color: var(--primary) !important;
        }
        
        .btn {
            background: var(--primary) !important;
        }
        
        .btn:hover {
            background: var(--primary-dark) !important;
        }
        
        .btn-success {
            background: #27ae60 !important;
        }
        
        .btn-success:hover {
            background: #229954 !important;
        }
        
        .btn-danger {
            background: #e74c3c !important;
        }
        
        .btn-danger:hover {
            background: #c0392b !important;
        }
        
        .btn-warning {
            background: #f39c12 !important;
        }
        
        .btn-warning:hover {
            background: #e67e22 !important;
        }
        
        .pagination .page-btn.active {
            background: var(--primary) !important;
            border-color: var(--primary) !important;
        }
        
        .pagination .nav-btn:hover:not(:disabled) {
            background: var(--secondary) !important;
            border-color: var(--primary) !important;
            color: var(--primary) !important;
        }
        
        .menu-link.active {
            background: var(--primary) !important;
            border-left-color: var(--primary-dark) !important;
        }
        
        .submenu .menu-link.active {
            background: var(--primary-dark) !important;
        }
        
        .breadcrumb-item a {
            color: var(--primary) !important;
        }
        
        .user-info-header .role-badge {
            background: var(--primary) !important;
        }
        
        .param-code {
            color: var(--primary) !important;
        }
        
        .welcome-message {
            color: var(--primary) !important;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            border-color: var(--primary) !important;
        }
        
        .menu-access-item.selected {
            border-left-color: var(--primary) !important;
        }
        
        .menu-access-item .menu-code {
            color: var(--primary) !important;
        }
        
        .sales-total-row {
            border-top-color: var(--primary) !important;
        }
        
        .sales-total-label {
            color: var(--primary) !important;
        }
        
        .total-amount {
            color: var(--primary) !important;
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Initialize theme for a page (called during page setup)
 * @param {String} pageName - Name of the current page
 * @param {String} companyNameElementId - ID of element for company name (optional)
 * @param {Object} displayOptions - Options for company name display
 */
function initPageWithTheme(pageName, companyNameElementId, displayOptions) {
    // First initialize system config (company name, page title) immediately
    initSystemConfig(pageName, companyNameElementId, displayOptions);
    
    // Then apply theme colors (may be async if not cached yet)
    applyTheme();
}

/**
 * Darken a hex color by a factor (0-1)
 */
function darkenColor(hex, factor) {
    const rgb = hexToRgbValues(hex);
    const r = Math.max(0, Math.min(255, Math.round(rgb.r * (1 - factor))));
    const g = Math.max(0, Math.min(255, Math.round(rgb.g * (1 - factor))));
    const b = Math.max(0, Math.min(255, Math.round(rgb.b * (1 - factor))));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Lighten a hex color by a factor (0-1)
 */
function lightenColor(hex, factor) {
    const rgb = hexToRgbValues(hex);
    const r = Math.max(0, Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor)));
    const g = Math.max(0, Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor)));
    const b = Math.max(0, Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor)));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Convert hex color to RGB values
 */
function hexToRgbValues(hex) {
    hex = hex.replace('#', '');
    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };
}

/**
 * Convert hex color to RGB string (for rgba usage)
 */
function hexToRgb(hex) {
    const values = hexToRgbValues(hex);
    return `${values.r}, ${values.g}, ${values.b}`;
}

/**
 * Clear theme cache (useful for logout)
 */
function clearThemeCache() {
    themeColorsCache = null;
    const existingStyle = document.getElementById('dynamic-theme-variables');
    if (existingStyle) {
        existingStyle.remove();
    }
}
