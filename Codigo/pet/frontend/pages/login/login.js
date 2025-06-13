document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        const user = getCurrentUser();
        if (user.tipo === 'Tutor') {
            window.location.href = '../telaTutor/telaTutor.html';
        } else if (user.tipo === 'Funcionario') {
            window.location.href = '../telaFuncionario/index.html';
        }
    }
    
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const tipo_usuario = document.getElementById('tipo').value;

            console.log('Login attempt:', { email, senha, tipo_usuario });
            
            if (!email || !senha || !tipo_usuario) {
                alert('Por favor, preencha todos os campos.');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha, tipo_usuario })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erro durante o login');
                }
                
                const data = await response.json();
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (data.user.tipo === 'Tutor') {
                    window.location.href = '../telaTutor/telaTutor.html';
                } else if (data.user.tipo === 'Funcionario') {
                    window.location.href = '../telaFuncionario/index.html';
                }
            } catch (error) {
                alert(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
                console.error('Login error:', error);
            }
        });
    }
});