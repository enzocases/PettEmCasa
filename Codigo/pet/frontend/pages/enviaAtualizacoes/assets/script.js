// Function to toggle mobile menu
function toggleMenu() {
    const menuMobile = document.getElementById('menu-mobile');
    menuMobile.classList.toggle('menu-opened');
}

// Constante para a URL base da API
const API_BASE_URL = 'https://backend-fragrant-feather-2415.fly.dev';

// Função para carregar os pets hospedados
async function carregarPetsHospedados() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas/active-pets`);
        const pets = await response.json();
        
        const container = document.querySelector('.pets-container');
        container.innerHTML = ''; // Limpa o container

        if (!Array.isArray(pets) || pets.length === 0) {
            container.innerHTML = '<p class="no-pets">Não há pets hospedados no momento.</p>';
            return;
        }

        pets.forEach(pet => {
            const card = document.createElement('div');
            card.className = 'pet-card';
            card.innerHTML = `
                <img src="${pet.foto || '../../assets/patas.png'}" alt="${pet.nome}" class="pet-image">
                <div class="pet-info">
                    <h3>${pet.nome}</h3>
                    <p>Tutor: ${pet.Reservas[0].Tutor.nome}</p>
                </div>
                <button class="update-button" onclick="abrirModal('${pet.idPet}', '${pet.nome}')">
                    <i class="material-symbols-outlined">update</i>
                    Atualizar
                </button>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        if (error.message.includes('401')) {
            window.location.href = '../../index.html';
        } else {
            alert('Erro ao carregar os pets hospedados. Por favor, tente novamente.');
        }
    }
}

// Function to open modal
function abrirModal(petId, petNome) {
    const modal = document.getElementById('modal');
    document.getElementById('selectedPetId').value = petId;
    document.getElementById('selectedPetName').textContent = petNome;
    modal.style.display = 'flex';
}

// Function to close modal
function fecharModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    document.getElementById('atualizacaoForm').reset();
    document.getElementById('selectedPetId').value = '';
    document.getElementById('selectedPetName').textContent = 'Nenhum pet selecionado';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        fecharModal();
    }
}

// Handle form submission
document.getElementById('atualizacaoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const petId = document.getElementById('selectedPetId').value;
    if (!petId) {
        alert('Por favor, selecione um pet para atualizar.');
        return;
    }

    const formData = {
        idPet: petId,
        comeu_bem: document.getElementById('comeuBem').checked,
        tomou_banho: document.getElementById('tomouBanho').checked,
        exercitou: document.getElementById('fezExercicios').checked,
        brincou: document.getElementById('brincou').checked,
        descansou_bem: document.getElementById('descansouBem').checked,
        observacoes: document.getElementById('observacoes').value
    };

    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/pet-updates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar atualização');
        }

        alert('Atualização enviada com sucesso!');
        fecharModal();
        // Recarrega a lista de pets para mostrar as atualizações mais recentes
        carregarPetsHospedados();
    } catch (error) {
        console.error('Erro ao enviar atualização:', error);
        if (error.message.includes('401')) {
            window.location.href = '../../index.html';
        } else {
            alert('Erro ao enviar atualização. Por favor, tente novamente.');
        }
    }
});

// Load user name and pets when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está autenticado e é um funcionário
    if (!requireUserType('Funcionario')) {
        return;
    }

    // Carrega o nome do usuário
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.nome;
    }

    // Carrega os pets
    carregarPetsHospedados();
}); 