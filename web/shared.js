// Consultorio Medisoft - JavaScript Compartido

// Toggle Mobile Menu
function toggleMobileMenu() {
  const mobileNav = document.getElementById('mobile-nav');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  mobileNav.classList.toggle('active');
  menuIcon.classList.toggle('hidden');
  closeIcon.classList.toggle('hidden');
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
  const mobileNav = document.getElementById('mobile-nav');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  mobileNav.classList.remove('active');
  menuIcon.classList.remove('hidden');
  closeIcon.classList.add('hidden');
}

// Set active navigation link
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'inicio.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Open Admin Modal
function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.add('active');
    // Load saved theme
    loadTheme();
  }
}

// Close Admin Modal
function closeAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal when clicking outside
function handleModalClick(event) {
  if (event.target.classList.contains('modal-overlay')) {
    closeAdminModal();
  }
}

// Change Theme
function changeTheme(theme) {
  const body = document.body;
  
  // Remove all theme classes
  body.classList.remove('theme-dark', 'theme-gray');
  
  // Add new theme class
  if (theme === 'dark') {
    body.classList.add('theme-dark');
  } else if (theme === 'gray') {
    body.classList.add('theme-gray');
  }
  
  // Save theme preference
  localStorage.setItem('theme', theme);
  
  // Update active theme option
  updateActiveTheme(theme);
}

// Update active theme option in UI
function updateActiveTheme(theme) {
  const themeOptions = document.querySelectorAll('.theme-option');
  themeOptions.forEach(option => {
    if (option.dataset.theme === theme) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
}

// Load saved theme
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  changeTheme(savedTheme);
}

// Admin Login
function handleAdminLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  const messageDiv = document.getElementById('login-message');
  
  // Simple validation (en producción usar backend real)
  if (username === 'admin' && password === 'medisoft2024') {
    messageDiv.className = 'login-message success';
    messageDiv.textContent = '✓ Login exitoso! Bienvenido, Administrador.';
    
    // Save login state
    localStorage.setItem('adminLoggedIn', 'true');
    
    // Clear form
    document.getElementById('admin-login-form').reset();
    
    // Close modal after 1.5 seconds
    setTimeout(() => {
      closeAdminModal();
      messageDiv.textContent = '';
      messageDiv.className = 'login-message';
    }, 1500);
  } else {
    messageDiv.className = 'login-message error';
    messageDiv.textContent = '✗ Usuario o contraseña incorrectos. Intente nuevamente.';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  setActiveNav();
  loadTheme();
  
  // Add smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Setup admin login form
  const loginForm = document.getElementById('admin-login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }
  
  // Setup modal click outside to close
  const modalOverlay = document.getElementById('admin-modal');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', handleModalClick);
  }
});

// SVG Icons
const icons = {
  menu: '<svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
  x: '<svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  phone: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
  mail: '<svg class="icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  mapPin: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>',
  logIn: '<svg class="icon" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>',
  settings: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m0-18a3 3 0 0 1 3 3v2.17a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h3zM3.34 8.66l4.24 4.24m4.24 0l4.24-4.24M1 12h6m6 0h6m-18 0l4.24 4.24m8.48 0l4.24 4.24"></path></svg>',
  heart: '<svg class="icon-lg" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  users: '<svg class="icon-lg" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  award: '<svg class="icon-lg" viewBox="0 0 24 24"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
  clock: '<svg class="icon-md" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  checkCircle: '<svg class="icon-md" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  fileText: '<svg class="icon-md" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  creditCard: '<svg class="icon-md" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>',
  shield: '<svg class="icon-md" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  alertCircle: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
  chevronDown: '<svg class="icon" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>'
};
