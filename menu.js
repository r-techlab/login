// Menu Rendering Component
// Dynamically builds and renders menu based on user's role access

// Show skeleton loader while menu is loading
function showMenuSkeleton(containerId = 'menuContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const skeletonHtml = `
        <div class="menu-skeleton">
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
            <p class="menu-loading-text">Loading menu...</p>
        </div>
    `;
    container.innerHTML = skeletonHtml;
}

// Render the main navigation menu
function renderMenu(containerId = 'menuContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Menu container not found:', containerId);
        return;
    }
    
    const menuHierarchy = buildMenuHierarchy();
    
    if (menuHierarchy.length === 0) {
        container.innerHTML = '<p style="color: #999;">No menu items available</p>';
        return;
    }
    
    const menuHtml = buildMenuHtml(menuHierarchy);
    container.innerHTML = menuHtml;
    
    // Add event listeners for dropdown menus
    initializeMenuInteractions();
}

// Build HTML for menu items recursively
function buildMenuHtml(menuItems, level = 0) {
    let html = '';
    
    if (level === 0) {
        html += '<nav class="main-menu">';
        html += '<ul class="menu-list">';
    }
    
    menuItems.forEach(menu => {
        if (menu.menuType === 'G') {
            // Group menu (has children)
            html += '<li class="menu-item menu-group">';
            html += `<a href="#" class="menu-link" onclick="toggleSubmenu(event, ${menu.menuId})">`;
            html += `<span class="menu-icon">📁</span>`;
            html += `<span class="menu-text">${menu.menuName}</span>`;
            html += '<span class="menu-arrow">▼</span>';
            html += '</a>';
            
            if (menu.children && menu.children.length > 0) {
                html += `<ul class="submenu" id="submenu-${menu.menuId}">`;
                menu.children.forEach(child => {
                    html += buildMenuItemHtml(child);
                });
                html += '</ul>';
            }
            
            html += '</li>';
        } else {
            // Page menu (direct link)
            html += buildMenuItemHtml(menu);
        }
    });
    
    if (level === 0) {
        html += '</ul>';
        html += '</nav>';
    }
    
    return html;
}

// Build HTML for a single menu item (page type)
function buildMenuItemHtml(menu) {
    let html = '<li class="menu-item">';
    
    if (menu.pageUrl && menu.pageUrl !== 'NULL' && menu.pageUrl !== '') {
        html += `<a href="${menu.pageUrl}" class="menu-link">`;
        html += `<span class="menu-icon">📄</span>`;
        html += `<span class="menu-text">${menu.menuName}</span>`;
        html += '</a>';
    } else {
        html += `<span class="menu-link disabled">`;
        html += `<span class="menu-icon">📄</span>`;
        html += `<span class="menu-text">${menu.menuName}</span>`;
        html += '</span>';
    }
    
    html += '</li>';
    return html;
}

// Toggle submenu visibility
function toggleSubmenu(event, menuId) {
    event.preventDefault();
    const submenu = document.getElementById(`submenu-${menuId}`);
    const arrow = event.currentTarget.querySelector('.menu-arrow');
    
    if (submenu) {
        submenu.classList.toggle('active');
        if (submenu.classList.contains('active')) {
            arrow.textContent = '▲';
        } else {
            arrow.textContent = '▼';
        }
    }
}

// Initialize menu interactions
function initializeMenuInteractions() {
    // Highlight current page in menu
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href === currentPage) {
            link.classList.add('active');
            
            // Expand parent submenu if exists
            const parentSubmenu = link.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('active');
                const parentMenuId = parentSubmenu.id.replace('submenu-', '');
                const parentArrow = document.querySelector(`[onclick*="${parentMenuId}"] .menu-arrow`);
                if (parentArrow) {
                    parentArrow.textContent = '▲';
                }
            }
        }
    });
}

// Render a simple breadcrumb based on current page
function renderBreadcrumb(containerId = 'breadcrumbContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const currentPage = window.location.pathname.split('/').pop();
    const menuAccess = getUserMenuAccess();
    
    // Find current menu item
    const currentMenu = menuAccess.find(menu => menu.pageUrl === currentPage);
    
    if (!currentMenu) {
        container.innerHTML = '<span class="breadcrumb-item">Home</span>';
        return;
    }
    
    let breadcrumbHtml = '<span class="breadcrumb-item"><a href="home.html">Home</a></span>';
    breadcrumbHtml += '<span class="breadcrumb-separator">›</span>';
    
    // If has parent, show parent first
    if (currentMenu.parentMenuId && currentMenu.parentMenuId !== 'NULL') {
        const parentMenu = menuAccess.find(menu => menu.menuId === currentMenu.parentMenuId);
        if (parentMenu) {
            breadcrumbHtml += `<span class="breadcrumb-item">${parentMenu.menuName}</span>`;
            breadcrumbHtml += '<span class="breadcrumb-separator">›</span>';
        }
    }
    
    breadcrumbHtml += `<span class="breadcrumb-item active">${currentMenu.menuName}</span>`;
    
    container.innerHTML = breadcrumbHtml;
}

// Get menu statistics for dashboard
function getMenuStats() {
    const menuAccess = getUserMenuAccess();
    const stats = {
        total: menuAccess.length,
        groups: menuAccess.filter(m => m.menuType === 'G').length,
        pages: menuAccess.filter(m => m.menuType === 'P').length
    };
    return stats;
}

// Render user info in header
function renderUserInfo(containerId = 'userInfoHeader') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const session = getSession();
    if (!session) return;
    
    const userInfoHtml = `
        <span class="user-icon">👤</span>
        <span class="user-name">${session.userName || session.userId}</span>
        <span class="role-badge">${session.roleName || 'User'}</span>
    `;
    container.innerHTML = userInfoHtml;
}
