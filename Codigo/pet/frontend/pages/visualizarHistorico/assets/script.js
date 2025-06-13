document.addEventListener('DOMContentLoaded', async function() {
    console.log('Iniciando carregamento do histórico');
    await carregarHistorico();
    setupEventListeners();
});

let todasReservas = []; // Variável global para armazenar todas as reservas

async function carregarHistorico() {
    const loadingElement = document.getElementById('loadingHistory');
    const errorElement = document.getElementById('errorHistory');
    const emptyElement = document.getElementById('emptyHistory');
    const cardsContainer = document.getElementById('cardsContainer');
    
    try {
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    emptyElement.style.display = 'none';
    cardsContainer.innerHTML = '';
    
        console.log('Fazendo requisição para API');
        const response = await fetch(`${API_BASE_URL}/api/reservas`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error('Erro na resposta da API:', response.status);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        todasReservas = await response.json();
        console.log('Reservas recebidas:', todasReservas);
        
        if (!todasReservas || todasReservas.length === 0) {
            console.log('Nenhuma reserva encontrada');
            emptyElement.style.display = 'block';
            return;
        }
        
        // Mostrar todas as reservas inicialmente
        renderizarCards(todasReservas);
        
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        errorElement.style.display = 'block';
    } finally {
        loadingElement.style.display = 'none';
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', filtrarReservas);
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', filtrarReservas);
    }
}

function filtrarReservas() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    
    if (!searchInput || !statusFilter) {
        console.error('Elementos de filtro não encontrados');
        return;
    }

    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    
    console.log('Filtrando reservas:', {
        searchTerm,
        statusValue,
        totalReservas: todasReservas.length
    });

    let reservasFiltradas = todasReservas;

    // Aplicar filtro de status
    if (statusValue !== 'todos') {
        reservasFiltradas = reservasFiltradas.filter(reserva => 
            reserva.status === statusValue
        );
    }

    // Aplicar filtro de pesquisa
    if (searchTerm) {
        reservasFiltradas = reservasFiltradas.filter(reserva => {
            const petName = reserva.Pet ? reserva.Pet.nome.toLowerCase() : '';
            return petName.includes(searchTerm);
        });
    }

    console.log('Reservas após todos os filtros:', reservasFiltradas.length);
    renderizarCards(reservasFiltradas);
}

async function visualizarBoletim(idPet, idReserva) {
    try {
        console.log('Buscando boletim para:', { idPet, idReserva });
        const response = await fetch(`${API_BASE_URL}/api/boletins/por-pet/${idPet}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar boletim');
        }

        const boletins = await response.json();
        const boletim = boletins.find(b => b.idReserva === idReserva);

        if (!boletim) {
            throw new Error('Boletim não encontrado para esta reserva');
        }

        console.log('Boletim encontrado:', boletim);

        // Armazenar o boletim no localStorage para acesso na página de visualização
        localStorage.setItem('boletimAtual', JSON.stringify(boletim));
        
        // Redirecionar para a página de visualização do boletim
        window.location.href = '../boletimTutor/index.html';
    } catch (error) {
        console.error('Erro ao buscar boletim:', error);
        alert('Não foi possível encontrar o boletim comportamental para esta reserva.');
    }
}

function renderizarCards(reservas) {
    const cardsContainer = document.getElementById('cardsContainer');
    const emptyElement = document.getElementById('emptyHistory');

    if (!cardsContainer || !emptyElement) {
        console.error('Elementos de renderização não encontrados');
        return;
    }

    cardsContainer.innerHTML = '';
    
    if (!reservas || reservas.length === 0) {
        console.log('Nenhuma reserva para renderizar');
        emptyElement.style.display = 'block';
        return;
    }

    console.log('Renderizando cards:', reservas.length);
    emptyElement.style.display = 'none';

    reservas.forEach(reserva => {
        console.log('Criando card para reserva:', reserva);
        const card = document.createElement('div');
        card.className = 'card';

        const dataEntrada = new Date(reserva.data_entrada).toLocaleDateString('pt-BR');
        const dataSaida = new Date(reserva.data_saida).toLocaleDateString('pt-BR');
        
        const statusClass = reserva.status.toLowerCase();
        const statusText = reserva.status === 'Finalizada' ? 'Concluída' : 
                         reserva.status === 'Cancelada' ? 'Cancelada' : 
                         'Pendente';
        
        const petName = reserva.Pet ? reserva.Pet.nome : 'Pet não encontrado';
        const petRace = reserva.Pet ? reserva.Pet.raca : '';
        const petSize = reserva.Pet ? reserva.Pet.porte : '';

        card.innerHTML = `
            <h2>${petName}</h2>
            <div class="status ${statusClass}">${statusText}</div>
            <div class="info">
                <b>Período da Reserva</b>
                <div>${dataEntrada} - ${dataSaida}</div>
                ${petRace ? `<b>Raça</b><div>${petRace}</div>` : ''}
                ${petSize ? `<b>Porte</b><div>${petSize}</div>` : ''}
                <b>ID da Reserva</b>
                <div>#${reserva.idReserva}</div>
            </div>
            <button class="boletim-btn" onclick="visualizarBoletim(${reserva.Pet.idPet}, ${reserva.idReserva})">
                <i class="material-symbols-outlined">description</i>
                Ver Boletim Comportamental
            </button>
        `;

        cardsContainer.appendChild(card);
    });
}

function criarCard(reserva) {
    console.log('Criando card para reserva:', reserva);
    const card = document.createElement('div');
    card.classList.add('card');
    
    const dataEntrada = new Date(reserva.data_entrada).toLocaleDateString('pt-BR');
    const dataSaida = new Date(reserva.data_saida).toLocaleDateString('pt-BR');
    
    const statusClass = reserva.status === 'Finalizada' ? 'green' : 'red';
    const statusText = reserva.status === 'Finalizada' ? 'Concluída' : 'Cancelada';
    
    const petName = reserva.Pet ? reserva.Pet.nome : 'Pet não encontrado';
    const petRace = reserva.Pet ? reserva.Pet.raca : '';
    const petSize = reserva.Pet ? reserva.Pet.porte : '';
    
    card.innerHTML = `
        <h2><span class="pet-name">${petName}</span></h2>
        <div class="status">
            <span class="dot ${statusClass}"></span>
            ${statusText}
        </div>
        <div class="info">
            <b>Período da Reserva</b>
            <div class="date-range">${dataEntrada} - ${dataSaida}</div>
            ${petRace ? `<b>Raça</b><div>${petRace}</div>` : ''}
            ${petSize ? `<b>Porte</b><div>${petSize}</div>` : ''}
            <b>ID da Reserva</b>
            <div>#${reserva.idReserva}</div>
        </div>
        <button onclick="visualizarBoletim(${reserva.idPet}, ${reserva.idReserva})" 
                ${reserva.status === 'Cancelada' ? 'disabled' : ''}>
            ${reserva.status === 'Cancelada' ? 'Reserva Cancelada' : 'Visualizar Boletim'}
        </button>
    `;
    
    return card;
}