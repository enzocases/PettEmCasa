let boletins = [];
let reservas = []; 

async function carregarReservas() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas`);
        if (!response.ok) {
            throw new Error('Erro ao carregar reservas');
        }
        reservas = await response.json();
        
        const reservaSelect = document.getElementById('reserva');
        reservaSelect.innerHTML = '<option value="">Selecione uma reserva...</option>';
        
        // Filtra reservas que já têm boletim
        const reservasDisponiveis = reservas.filter(reserva => 
            !boletins.some(boletim => boletim.idReserva === reserva.idReserva)
        );

        reservasDisponiveis.forEach(reserva => {
            const option = document.createElement('option');
            option.value = JSON.stringify({
                idReserva: reserva.idReserva,
                idPet: reserva.idPet,
                nomePet: reserva.Pet ? reserva.Pet.nome : 'Pet não encontrado'
            });
            option.textContent = `Reserva: ${reserva.Pet ? reserva.Pet.nome : 'Pet não encontrado'}`;
            reservaSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        alert('Erro ao carregar as reservas. Por favor, recarregue a página.');
    }
}

async function salvarBoletim() {
    try {
        const reservaSelect = document.getElementById('reserva');
        const ingestaoAgua = document.getElementById('ingestaoAgua').value;
        const apetite = document.getElementById('apetite').value;
        const nivelEnergia = document.getElementById('nivelEnergia').value;
        const interacaoPessoas = document.getElementById('interacaoPessoas').value;
        const interacaoAnimais = document.getElementById('interacaoAnimais').value;
        const comportamentoPasseios = document.getElementById('comportamentoPasseios').value;
        const comportamentoAmbienteInterno = document.getElementById('comportamentoAmbienteInterno').value;
        const brincadeirasPreferidas = document.getElementById('brincadeirasPreferidas').value;
        const observacoes = document.getElementById('observacoes').value;

        if (!reservaSelect.value) {
            alert('Por favor, selecione uma reserva.');
            return;
        }

        const reservaData = JSON.parse(reservaSelect.value);

        // Verificar se já existe um boletim para esta reserva
        const boletimExistente = boletins.find(b => b.idReserva === reservaData.idReserva);

        const boletimData = {
            idPet: reservaData.idPet,
            idReserva: reservaData.idReserva,
            descricao: observacoes,
            ingestaoAgua,
            apetite,
            nivelEnergia,
            interacaoPessoas,
            interacaoAnimais,
            comportamentoPasseios,
            comportamentoAmbienteInterno,
            brincadeirasPreferidas
        };

        let response;
        if (boletimExistente) {
            // Atualizar boletim existente
            response = await authenticatedFetch(`${API_BASE_URL}/api/boletins/${boletimExistente.idBoletim}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(boletimData),
            });
        } else {
            // Criar novo boletim
            response = await authenticatedFetch(`${API_BASE_URL}/api/boletins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(boletimData),
            });
        }

        if (!response.ok) {
            throw new Error('Erro ao salvar boletim');
        }

        alert('Boletim salvo com sucesso!');
        limparFormulario();
        await carregarBoletins();
        await carregarReservas();
    } catch (error) {
        console.error('Erro ao salvar boletim:', error);
        alert('Erro ao salvar o boletim. Por favor, tente novamente.');
    }
}

async function carregarBoletins() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/boletins`);
        if (!response.ok) {
            throw new Error('Erro ao carregar boletins');
        }
        boletins = await response.json();
        exibirBoletins();
    } catch (error) {
        console.error('Erro ao carregar boletins:', error);
        alert('Erro ao carregar os boletins. Por favor, recarregue a página.');
    }
}

function limparFormulario() {
    document.getElementById('reserva').value = '';
    document.getElementById('observacoes').value = '';
    document.getElementById('ingestaoAgua').value = '';
    document.getElementById('apetite').value = '';
    document.getElementById('nivelEnergia').value = '';
    document.getElementById('interacaoPessoas').value = '';
    document.getElementById('interacaoAnimais').value = '';
    document.getElementById('comportamentoPasseios').value = '';
    document.getElementById('comportamentoAmbienteInterno').value = '';
    document.getElementById('brincadeirasPreferidas').value = '';
}

function exibirBoletins() {
    const listaBoletins = document.getElementById('lista-boletins');
    listaBoletins.innerHTML = '';

    boletins.forEach(boletim => {
        const boletimElement = document.createElement('div');
        boletimElement.className = `boletim-item`;
        boletimElement.innerHTML = `
            <div class="boletim-item-header">
                <span class="boletim-item-reserva">Reserva #${boletim.idReserva || 'N/A'}</span>
                <div class="boletim-actions">
                    <button onclick="editarBoletim(${boletim.idBoletim})" class="btn-editar">Editar</button>
                    <button onclick="excluirBoletim(${boletim.idBoletim})" class="btn-excluir">Excluir</button>
                </div>
            </div>
            <div class="boletim-item-content">
                <p><strong>Pet:</strong> ${boletim.Pet ? boletim.Pet.nome : 'Não informado'}</p>
                <p><strong>Ingestão de Água:</strong> ${boletim.ingestaoAgua || 'Não informado'}</p>
                <p><strong>Apetite:</strong> ${boletim.apetite || 'Não informado'}</p>
                <p><strong>Nível de Energia:</strong> ${boletim.nivelEnergia || 'Não informado'}</p>
                <p><strong>Interação com Pessoas:</strong> ${boletim.interacaoPessoas || 'Não informado'}</p>
                <p><strong>Interação com Outros Animais:</strong> ${boletim.interacaoAnimais || 'Não informado'}</p>
                <p><strong>Comportamento em Passeios:</strong> ${boletim.comportamentoPasseios || 'Não informado'}</p>
                <p><strong>Comportamento em Ambiente Interno:</strong> ${boletim.comportamentoAmbienteInterno || 'Não informado'}</p>
                <p><strong>Brincadeiras Preferidas:</strong> ${boletim.brincadeirasPreferidas || 'Não informado'}</p>
                ${boletim.descricao ? `<p><strong>Observações:</strong> ${boletim.descricao}</p>` : ''}
            </div>
        `;

        listaBoletins.appendChild(boletimElement);
    });
}

async function editarBoletim(idBoletim) {
    const boletim = boletins.find(b => b.idBoletim === idBoletim);
    if (!boletim) return;

    try {
        // Primeiro, carregar todas as reservas para garantir que temos a lista atualizada
        const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas`);
        if (!response.ok) {
            throw new Error('Erro ao carregar reservas');
        }
        const todasReservas = await response.json();
        
        // Atualizar o select de reservas para incluir a reserva do boletim
        const reservaSelect = document.getElementById('reserva');
        reservaSelect.innerHTML = '<option value="">Selecione uma reserva...</option>';
        
        // Encontrar a reserva correspondente ao boletim
        const reservaDoBoletim = todasReservas.find(r => r.idReserva === boletim.idReserva);
        
        if (reservaDoBoletim) {
            const option = document.createElement('option');
            option.value = JSON.stringify({
                idReserva: reservaDoBoletim.idReserva,
                idPet: reservaDoBoletim.idPet,
                nomePet: reservaDoBoletim.Pet ? reservaDoBoletim.Pet.nome : 'Pet não encontrado'
            });
            option.textContent = `Reserva: ${reservaDoBoletim.Pet ? reservaDoBoletim.Pet.nome : 'Pet não encontrado'}`;
            reservaSelect.appendChild(option);
            
            // Selecionar a reserva
            reservaSelect.value = option.value;
        }

        // Preencher os outros campos do formulário
        document.getElementById('ingestaoAgua').value = boletim.ingestaoAgua || '';
        document.getElementById('apetite').value = boletim.apetite || '';
        document.getElementById('nivelEnergia').value = boletim.nivelEnergia || '';
        document.getElementById('interacaoPessoas').value = boletim.interacaoPessoas || '';
        document.getElementById('interacaoAnimais').value = boletim.interacaoAnimais || '';
        document.getElementById('comportamentoPasseios').value = boletim.comportamentoPasseios || '';
        document.getElementById('comportamentoAmbienteInterno').value = boletim.comportamentoAmbienteInterno || '';
        document.getElementById('brincadeirasPreferidas').value = boletim.brincadeirasPreferidas || '';
        document.getElementById('observacoes').value = boletim.descricao || '';

        // Rolar até o formulário
        document.querySelector('.boletim-form').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro ao carregar dados para edição:', error);
        alert('Erro ao carregar dados para edição. Por favor, tente novamente.');
    }
}

async function excluirBoletim(idBoletim) {
    if (!confirm('Tem certeza que deseja excluir este boletim?')) return;

    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/boletins/${idBoletim}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir boletim');
        }

        // Atualizar a lista de boletins
        await carregarBoletins();
        alert('Boletim excluído com sucesso!');
    } catch (error) {
        console.error('Erro ao excluir boletim:', error);
        alert('Erro ao excluir o boletim. Por favor, tente novamente.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarBoletins();
    carregarReservas();
});
