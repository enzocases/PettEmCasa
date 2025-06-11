function isAuthenticated() {
    return localStorage.getItem('token') !== null;
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function isUserType(type) {
    const user = getCurrentUser();
    return user && user.tipo === type;
}

function getToken() {
    return localStorage.getItem('token');
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../../index.html';
}

function updateTutor(id, data) {
    return authenticatedFetch(`http://localhost:3060/api/tutores/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

function updateFuncionario(id, data) {
    return authenticatedFetch(`http://localhost:3060/api/funcionarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function authenticatedFetch(url, options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error('Usuário não autenticado');
    }

    const headers = {
        ...(options.headers || {}),
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        logout();
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    return response;
}


function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '../../pages/login/login.html';
        return false;
    }
    return true;
}

function requireUserType(type) {
    if (!requireAuth()) return false;
    
    if (!isUserType(type)) {
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = '/index.html';
        return false;
    }
    return true;
}

function updateUIForAuthStatus() {
    const user = getCurrentUser();
    
    const userNameElements = document.querySelectorAll('.user-name');
    if (userNameElements.length > 0 && user) {
        userNameElements.forEach(el => {
            el.textContent = user.nome || 'Usuário';
        });
    }
    
    const authOnlyElements = document.querySelectorAll('.auth-only');
    const noAuthElements = document.querySelectorAll('.no-auth-only');
    
    if (isAuthenticated()) {
        authOnlyElements.forEach(el => el.style.display = 'block');
        noAuthElements.forEach(el => el.style.display = 'none');
    } else {
        authOnlyElements.forEach(el => el.style.display = 'none');
        noAuthElements.forEach(el => el.style.display = 'block');
    }
    
    const tutorOnlyElements = document.querySelectorAll('.tutor-only');
    const funcionarioOnlyElements = document.querySelectorAll('.funcionario-only');
    
    if (isUserType('Tutor')) {
        tutorOnlyElements.forEach(el => el.style.display = 'block');
        funcionarioOnlyElements.forEach(el => el.style.display = 'none');
    } else if (isUserType('Funcionario')) {
        tutorOnlyElements.forEach(el => el.style.display = 'none');
        funcionarioOnlyElements.forEach(el => el.style.display = 'block');
    }
}