// Constante para a URL base da API
const API_BASE_URL = 'https://backend-fragrant-feather-2415.fly.dev';

// Função para carregar as atualizações dos pets
async function carregarAtualizacoes() {
    try {
        // Busca as atualizações dos pets do tutor logado
        const response = await authenticatedFetch(`${API_BASE_URL}/api/pet-updates/my-pets`);
        const atualizacoes = await response.json();
        
        const container = document.querySelector('.card-container');
        container.innerHTML = ''; // Limpa o container

        if (!Array.isArray(atualizacoes) || atualizacoes.length === 0) {
            container.innerHTML = '<p class="no-updates">Não há atualizações disponíveis para seus pets.</p>';
            return;
        }

        // Agrupa atualizações por pet
        const atualizacoesPorPet = atualizacoes.reduce((acc, atualizacao) => {
            if (!acc[atualizacao.Pet.idPet]) {
                acc[atualizacao.Pet.idPet] = [];
            }
            acc[atualizacao.Pet.idPet].push(atualizacao);
            return acc;
        }, {});

        // Ordena as atualizações de cada pet por data (mais recente primeiro)
        Object.values(atualizacoesPorPet).forEach(atualizacoesPet => {
            atualizacoesPet.sort((a, b) => new Date(b.data_update) - new Date(a.data_update));
        });

        // Cria cards para cada pet com suas atualizações
        Object.values(atualizacoesPorPet).forEach(atualizacoesPet => {
            const ultimaAtualizacao = atualizacoesPet[0];
            const pet = ultimaAtualizacao.Pet;
            
            const card = document.createElement('div');
            card.className = 'pet-card';
            card.innerHTML = `
                <div class="pet-info">
                    <img src="${pet.foto || '../../assets/patas.png'}" alt="${pet.nome}" class="pet-image">
                    <div class="pet-details">
                        <h3>${pet.nome}</h3>
                        <p>Última atualização: ${formatarData(ultimaAtualizacao.data_update)}</p>
                    </div>
                </div>
                <div class="update-info">
                    <p>
                        <span class="status-icon ${ultimaAtualizacao.comeu_bem ? 'status-positive' : 'status-negative'}"></span>
                        Alimentação: ${ultimaAtualizacao.comeu_bem ? 'Comeu bem' : 'Não comeu bem'}
                    </p>
                    <p>
                        <span class="status-icon ${ultimaAtualizacao.tomou_banho ? 'status-positive' : 'status-negative'}"></span>
                        Banho: ${ultimaAtualizacao.tomou_banho ? 'Tomou banho' : 'Não tomou banho'}
                    </p>
                </div>
                <button class="view-details-btn" onclick="abrirModalDetalhes(${JSON.stringify(ultimaAtualizacao).replace(/"/g, '&quot;')})">
                    <i class="material-symbols-outlined">visibility</i>
                    Ver detalhes
                </button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar atualizações:', error);
        if (error.message.includes('401')) {
            window.location.href = '../../index.html';
        } else {
            alert('Erro ao carregar as atualizações. Por favor, tente novamente.');
        }
    }
}

// Função para formatar a data
function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Função para abrir o modal de detalhes
function abrirModalDetalhes(atualizacao) {
    const modal = document.getElementById('modal-detalhes');
    
    // Preenche os dados no modal
    document.getElementById('pet-nome').textContent = atualizacao.Pet.nome;
    document.getElementById('data-atualizacao').textContent = `Atualizado em: ${formatarData(atualizacao.data_update)}`;
    
    document.getElementById('comeu-bem').textContent = atualizacao.comeu_bem ? 'Sim' : 'Não';
    document.getElementById('tomou-banho').textContent = atualizacao.tomou_banho ? 'Sim' : 'Não';
    document.getElementById('fez-exercicios').textContent = atualizacao.exercitou ? 'Sim' : 'Não';
    document.getElementById('brincou').textContent = atualizacao.brincou ? 'Sim' : 'Não';
    document.getElementById('descansou-bem').textContent = atualizacao.descansou_bem ? 'Sim' : 'Não';
    
    document.getElementById('observacoes-texto').textContent = atualizacao.observacoes || 'Nenhuma observação registrada.';
    
    modal.style.display = 'flex';
}

// Função para fechar o modal de detalhes
function fecharModalDetalhes() {
    const modal = document.getElementById('modal-detalhes');
    modal.style.display = 'none';
}

// Função para alternar o menu mobile
function toggleMenu() {
    const menuMobile = document.getElementById('menu-mobile');
    menuMobile.classList.toggle('active');
}

// Carrega as atualizações quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarAtualizacoes);

// Fecha o modal quando clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modal-detalhes');
    if (event.target === modal) {
        fecharModalDetalhes();
    }
};
