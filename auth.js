document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const authModal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const userDisplay = document.getElementById('userDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const authButtons = document.getElementById('authButtons');
    const userSection = document.getElementById('userSection');
    const usernameSpan = document.getElementById('username');
    const userRoleSpan = document.getElementById('userRole');

    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        showLoggedInState(currentUser.name, currentUser.role);
    } else {
        showLoggedOutState();
    }

    // Event Listeners
    loginBtn.addEventListener('click', () => {
        authModal.style.display = 'block';
        showLoginForm();
    });

    closeBtn.addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == authModal) {
            authModal.style.display = 'none';
        }
    });

    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showLoginForm();
    });

    // Login Form Submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Simple validation (In real app, check against database)
        const storedUser = JSON.parse(localStorage.getItem(email));

        if (storedUser && storedUser.password === password) {
            localStorage.setItem('currentUser', JSON.stringify(storedUser));
            showLoggedInState(storedUser.name, storedUser.role);
            authModal.style.display = 'none';
            alert('Giriş başarılı! Hoş geldin, ' + storedUser.name + ' (' + storedUser.role + ')');
        } else {
            alert('Hatalı e-posta veya şifre!');
        }
    });

    // Register Form Submission
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = registerForm.querySelector('input[type="text"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        const role = registerForm.querySelector('#roleSelect').value;

        if (localStorage.getItem(email)) {
            alert('Bu e-posta adresi zaten kayıtlı!');
            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password, // In real app, never store plain text passwords!
            role: role
        };

        localStorage.setItem(email, JSON.stringify(newUser));
        localStorage.setItem('currentUser', JSON.stringify(newUser)); // Auto login

        showLoggedInState(name, role);
        authModal.style.display = 'none';
        alert('Kayıt başarılı! Hoş geldin, ' + name + ' (' + role + ')');
    });

    // Logout
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        showLoggedOutState();
        alert('Çıkış yapıldı.');
    });

    // Helper Functions
    function showLoginForm() {
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    }

    function showRegisterForm() {
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    }

    function showLoggedInState(name, role) {
        authButtons.style.display = 'none';
        userSection.style.display = 'flex';
        usernameSpan.textContent = name;
        if (role) {
            userRoleSpan.textContent = '(' + role + ')';
        } else {
            userRoleSpan.textContent = '';
        }
    }

    function showLoggedOutState() {
        authButtons.style.display = 'block';
        userSection.style.display = 'none';
        usernameSpan.textContent = '';
        userRoleSpan.textContent = '';
        loginForm.reset();
        registerForm.reset();
    }
});
