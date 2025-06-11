// Show/hide fields based on user type selection
document.getElementById('tipo_usuario').addEventListener('change', function() {
    const userType = this.value;
    const tutorFields = document.getElementById('tutor-fields');
    const funcionarioFields = document.getElementById('funcionario-fields');
    
    if (userType === 'Tutor') {
        tutorFields.style.display = 'block';
        funcionarioFields.style.display = 'none';
        
        // Make tutor fields required
        document.getElementById('contato_emergencia').required = true;
        document.getElementById('cpf').required = false;
        document.getElementById('cargo').required = false;
    } else if (userType === 'Funcionario') {
        tutorFields.style.display = 'none';
        funcionarioFields.style.display = 'block';
        
        // Make funcionario fields required
        document.getElementById('contato_emergencia').required = false;
        document.getElementById('cpf').required = true;
        document.getElementById('cargo').required = true;
    } else {
        tutorFields.style.display = 'none';
        funcionarioFields.style.display = 'none';
        
        // Reset required fields
        document.getElementById('contato_emergencia').required = false;
        document.getElementById('cpf').required = false;
        document.getElementById('cargo').required = false;
    }
});

document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const tipo_usuario = document.getElementById('tipo_usuario').value;
    const senha = document.getElementById('senha').value;

    // Prepare user data object
    const userData = {
        nome,
        telefone,
        email,
        tipo_usuario,
        senha
    };

    // Add type-specific fields
    if (tipo_usuario === 'Tutor') {
        userData.contato_emergencia = document.getElementById('contato_emergencia').value;
    } else if (tipo_usuario === 'Funcionario') {
        userData.cpf = document.getElementById('cpf').value;
        userData.cargo = document.getElementById('cargo').value;
    }

    try {
        const response = await fetch('http://localhost:3060/api/tutores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message);
            window.location.href = '../login/login.html';
        } else {
            const errorData = await response.json();
            alert('Erro ao cadastrar: ' + (errorData.error || 'Verifique os campos.'));
        }
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        alert('Erro ao conectar com o servidor.');
    }
});