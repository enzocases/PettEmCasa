// Carregar funcionários quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Debug: Verificar o token e tipo de usuário
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            console.log('Token data:', tokenData);
            if (tokenData.tipo !== 'Funcionario') {
                alert('Você precisa estar logado como Funcionário para acessar esta página.');
                window.location.href = '../login/index.html';
                return;
            }
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
        }
    } else {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = '../login/index.html';
        return;
    }

    carregarFuncionarios();
});

// Função para carregar a lista de funcionários
async function carregarFuncionarios() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/funcionarios`);
        if (!response.ok) {
            throw new Error('Erro ao carregar funcionários');
        }
        const funcionarios = await response.json();
        preencherTabelaFuncionarios(funcionarios);
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar a lista de funcionários');
    }
}

// Função para preencher a tabela com os dados dos funcionários
function preencherTabelaFuncionarios(funcionarios) {
    const tbody = document.getElementById('funcionariosTableBody');
    tbody.innerHTML = '';

    funcionarios.forEach(funcionario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${funcionario.nome}</td>
            <td>${funcionario.email}</td>
            <td>${funcionario.telefone || '-'}</td>
            <td class="acoes">
                <button class="btn-acao btn-excluir" onclick="excluirFuncionario(${funcionario.idFuncionario})">
                    <i class="material-symbols-outlined">delete</i>
                    Excluir
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para excluir funcionário
async function excluirFuncionario(id) {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) {
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/funcionarios/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir funcionário');
        }

        // Recarregar a lista após excluir
        carregarFuncionarios();
        alert('Funcionário excluído com sucesso!');
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir funcionário');
    }
}

// Função para gerar PDF
function gerarPDF() {
    window.print();
}
