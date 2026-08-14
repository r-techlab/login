// ==========================================================================
// UI HELPERS - Shared formatting and messaging utilities
// --------------------------------------------------------------------------
// Loaded AFTER systemConfig.js so global escapeHtml() is already available.
// Page-specific inline definitions (if any) override these; removing those
// duplicates lets pages fall back to these shared implementations.
// ==========================================================================

/**
 * Format a date string to a readable locale format (en-GB: DD/MM/YYYY).
 * @param {String} dateStr - Date value (string or Date-compatible)
 * @returns {String} Formatted date or '-' when empty/invalid
 */
function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    } catch (e) {
        return dateStr;
    }
}

/**
 * Format a numeric amount to 2 decimal places.
 * @param {Number|String} amount - Amount value
 * @returns {String} Fixed decimal string ('0.00' when null/undefined)
 */
function formatAmount(amount) {
    if (amount === null || amount === undefined) return '0.00';
    const num = parseFloat(amount);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
}

/**
 * Show a message in the page's message container.
 * Uses #messageContainer if present, otherwise #toastContainer.
 * Automatically clears after 5 seconds.
 * @param {String} message - Text to show
 * @param {String} type - 'success' | 'error' | 'warning' | 'info'
 */
function showMessage(message, type) {
    type = type || 'info';
    let container = document.getElementById('messageContainer');

    if (!container) {
        container = document.getElementById('toastContainer');
        if (!container) return;
    }

    container.innerHTML = '<div class="message ' + escapeHtml(type) + '">' + escapeHtml(message) + '</div>';

    setTimeout(function() {
        container.innerHTML = '';
    }, 5000);
}

/**
 * Show a toast notification in #toastContainer (fixed position top-center).
 * @param {String} message - Text to show
 * @param {String} type - 'success' | 'error' | 'warning' | 'info'
 */
function showToast(message, type) {
    type = type || 'info';
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'message ' + escapeHtml(type);
    toast.innerHTML = escapeHtml(message);
    container.appendChild(toast);

    setTimeout(function() {
        if (toast.parentNode === container) {
            container.removeChild(toast);
        }
    }, 5000);
}
