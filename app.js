// ==================== APPLICATION STATE ====================
let currentModule = 'patients';
let isAuthenticated = false;
let currentUser = null;
let currentProfile = null;

// ==================== DOM ELEMENTS ====================
const loginScreen = document.getElementById('loginScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const navItems = document.querySelectorAll('.nav-item');
const moduleContent = document.getElementById('moduleContent');

// ==================== AUTHENTICATION ====================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Iniciando sesión...';
    submitBtn.disabled = true;
    
    const result = await signIn(email, password);
    
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    
    if (result.success) {
        isAuthenticated = true;
        currentUser = result.user;
        currentProfile = result.profile;
        
        showScreen('dashboard');
        loadModule('patients');
        
        // Optional: Show user info in header
        const headerSubtitle = document.querySelector('.header-subtitle');
        if (headerSubtitle && currentProfile) {
            headerSubtitle.textContent = `${currentProfile.nombre_completo || currentUser.email} - ${currentProfile.rol || 'Médico'}`;
        }
    } else {
        alert('Error de autenticación: ' + result.error);
    }
});

logoutBtn.addEventListener('click', async () => {
    const result = await signOut();
    if (result.success) {
        isAuthenticated = false;
        currentUser = null;
        currentProfile = null;
        showScreen('login');
        loginForm.reset();
    } else {
        alert('Error al cerrar sesión: ' + result.error);
    }
});

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenName) {
    loginScreen.classList.remove('active');
    dashboardScreen.classList.remove('active');
    
    if (screenName === 'login') {
        loginScreen.classList.add('active');
    } else if (screenName === 'dashboard') {
        dashboardScreen.classList.add('active');
    }
}

// ==================== MODULE NAVIGATION ====================
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const module = item.getAttribute('data-module');
        loadModule(module);
        
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
    });
});

function loadModule(moduleName) {
    currentModule = moduleName;
    
    switch(moduleName) {
        case 'patients':
            loadPatientsModule();
            break;
        case 'appointments':
            loadAppointmentsModule();
            break;
        case 'billing':
            loadBillingModule();
            break;
    }
}

// ==================== UTILITY FUNCTIONS ====================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

function formatDateLong(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
}

function formatCurrency(amount) {
    return `RD$ ${amount.toFixed(2)}`;
}

function createStatusBadge(status) {
    const badges = {
        'confirmada': { class: 'badge-success', text: 'Confirmada' },
        'pendiente': { class: 'badge-warning', text: 'Pendiente' },
        'cancelada': { class: 'badge-danger', text: 'Cancelada' },
        'completada': { class: 'badge-secondary', text: 'Completada' },
        'pagado': { class: 'badge-success', text: 'Pagado' },
        'vencido': { class: 'badge-danger', text: 'Vencido' },
        'anulado': { class: 'badge-danger', text: 'Anulado' }
    };
    
    const badge = badges[status] || { class: 'badge-secondary', text: status };
    return `<span class="badge ${badge.class}">${badge.text}</span>`;
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <div class="loading-spinner"></div>
                <p style="margin-top: 1rem; color: var(--gray-600);">Cargando...</p>
            </div>
        `;
    }
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="text-center" style="padding: 3rem;">
                <div style="color: var(--danger-color); margin-bottom: 1rem;">
                    ${icons.alertCircle}
                </div>
                <p style="color: var(--danger-color);">${message}</p>
                <button class="btn btn-outline mt-4" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
}

function showNotification(message, type = 'success') {
    // Simple notification - can be replaced with toast library
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        background-color: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--gray-200);
        border-top-color: var(--primary-color);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// SVG Icons Library
const icons = {
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
    pill: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    trendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    creditCard: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    user: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    spinner: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3l4 4-7 7H10v-4l7-7z"/><path d="M4 20h16"/></svg>`,
    trash: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
};

// Initialize app - check for existing session
document.addEventListener('DOMContentLoaded', async () => {
    const hasSession = await checkAuthSession();
    if (hasSession) {
        const { user, profile } = await getCurrentUser();
        if (user) {
            isAuthenticated = true;
            currentUser = user;
            currentProfile = profile;
            showScreen('dashboard');
            loadModule('patients');
            
            const headerSubtitle = document.querySelector('.header-subtitle');
            if (headerSubtitle && currentProfile) {
                headerSubtitle.textContent = `${currentProfile.nombre_completo || currentUser.email} - ${currentProfile.rol || 'Médico'}`;
            }
        } else {
            showScreen('login');
        }
    } else {
        showScreen('login');
    }
});