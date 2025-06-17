// Verificar autenticação ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    if (!requireAuth()) return;
    if (!requireUserType('Tutor')) return;
    
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.nome;
    }
    
    await loadReservas();
});

// Função para carregar as reservas do tutor
async function loadReservas() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas`);

        if (response.ok) {
            const reservas = await response.json();
            const reservaSelect = document.getElementById('reserva');
            reservaSelect.innerHTML = '<option value="">Selecione uma reserva...</option>';
            
            // Filtrar apenas reservas ativas e ordená-las por data
            const reservasAtivas = reservas
                .filter(reserva => reserva.status === 'Ativa')
                .sort((a, b) => new Date(b.data_entrada) - new Date(a.data_entrada));
            
            reservasAtivas.forEach(reserva => {
                const option = document.createElement('option');
                option.value = reserva.idReserva;
                const dataEntrada = new Date(reserva.data_entrada).toLocaleDateString('pt-BR');
                const nomePet = reserva.Pet ? reserva.Pet.nome : 'Pet não especificado';
                option.textContent = `${nomePet} - Entrada: ${dataEntrada}`;
                reservaSelect.appendChild(option);
            });

            // Adicionar evento de mudança
            reservaSelect.addEventListener('change', loadBoletim);
        } else {
            throw new Error('Falha ao carregar reservas');
        }
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao carregar lista de reservas', 'error');
    }
}

// Função para carregar o boletim comportamental
async function loadBoletim() {
    const reservaId = document.getElementById('reserva').value;

    if (!reservaId) {
        clearBoletimInfo();
        return;
    }

    try {
        const user = getCurrentUser();
        if (!user) {
            showAlert('Usuário não autenticado', 'error');
            return;
        }

        // Buscar boletins do tutor logado usando a rota específica
        const response = await authenticatedFetch(`${API_BASE_URL}/api/boletins/por-tutor/${user.id}`);

        if (response.ok) {
            const boletins = await response.json();
            // Encontrar o boletim correspondente à reserva selecionada
            const boletim = boletins.find(b => b.idReserva === parseInt(reservaId));
            
            if (boletim) {
                updateBoletimInfo(boletim);
            } else {
                clearBoletimInfo();
                showAlert('Nenhum boletim encontrado para esta reserva', 'info');
            }
        } else {
            throw new Error('Falha ao carregar boletim');
        }
    } catch (error) {
        console.error('Erro:', error);
        showAlert('Erro ao carregar boletim comportamental', 'error');
    }
}

// Função para atualizar as informações do boletim na tela
function updateBoletimInfo(boletim) {
    // Atualizar informações do pet e data
    document.getElementById('nomePet').textContent = boletim.Pet ? boletim.Pet.nome : '-';
    document.getElementById('dataBoletim').textContent = boletim.data ? new Date(boletim.data).toLocaleDateString('pt-BR') : '-';

    // Atualizar informações do boletim
    document.getElementById('ingestaoAgua').textContent = boletim.ingestaoAgua || '-';
    document.getElementById('apetite').textContent = boletim.apetite || '-';
    document.getElementById('nivelEnergia').textContent = boletim.nivelEnergia || '-';
    document.getElementById('interacaoPessoas').textContent = boletim.interacaoPessoas || '-';
    document.getElementById('interacaoAnimais').textContent = boletim.interacaoAnimais || '-';
    document.getElementById('comportamentoPasseios').textContent = boletim.comportamentoPasseios || '-';
    document.getElementById('comportamentoAmbienteInterno').textContent = boletim.comportamentoAmbienteInterno || '-';
    document.getElementById('brincadeirasPreferidas').textContent = boletim.brincadeirasPreferidas || '-';
    document.getElementById('observacoes').textContent = boletim.descricao || '-';
}

// Função para limpar as informações do boletim
function clearBoletimInfo() {
    const fields = [
        'nomePet', 'dataBoletim', 'ingestaoAgua', 'apetite', 'nivelEnergia',
        'interacaoPessoas', 'interacaoAnimais', 'comportamentoPasseios',
        'comportamentoAmbienteInterno', 'brincadeirasPreferidas', 'observacoes'
    ];
    
    fields.forEach(field => {
        document.getElementById(field).textContent = '-';
    });
}

// Função para exibir alertas
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${type}`;
    alertDiv.textContent = message;

    const container = document.querySelector('.boletim-container');
    container.insertBefore(alertDiv, container.firstChild);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
