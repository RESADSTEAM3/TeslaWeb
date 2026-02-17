document.addEventListener('DOMContentLoaded', async function () {
    // Initialize Supabase Client
    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

    // Check Initial Session
    const { data: { session } } = await _supabase.auth.getSession();
    if (session) {
        handleUserSession(session.user);
    } else {
        showLoggedOutState();
    }

    // Auth State Change Listener
    _supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            handleUserSession(session.user);
        } else if (event === 'SIGNED_OUT') {
            showLoggedOutState();
        }
    });

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
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert('Giriş hatası: ' + error.message);
        } else {
            authModal.style.display = 'none';
            // State update handled by onAuthStateChange
        }
    });

    // Register Form Submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('roleSelect').value;

        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                    role: role,
                },
            },
        });

        if (error) {
            alert('Kayıt hatası: ' + error.message);
        } else {
            alert('Kayıt başarılı! Lütfen e-postanızı kontrol edip onaylayın (Eğer onay kapalıysa giriş yapabilirsiniz).');
            authModal.style.display = 'none';
            // If email confirmation is disabled, user is auto-logged in.
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const { error } = await _supabase.auth.signOut();
        if (error) {
            alert('Çıkış hatası: ' + error.message);
        }
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

    function handleUserSession(user) {
        const name = user.user_metadata.full_name || user.email;
        const role = user.user_metadata.role || 'Öğrenci';

        authButtons.style.display = 'none';
        userSection.style.display = 'flex';
        usernameSpan.textContent = name;
        userRoleSpan.textContent = '(' + role + ')';
    }

    function showLoggedOutState() {
        authButtons.style.display = 'block';
        userSection.style.display = 'none';
        usernameSpan.textContent = '';
        userRoleSpan.textContent = '';
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
    }
});
