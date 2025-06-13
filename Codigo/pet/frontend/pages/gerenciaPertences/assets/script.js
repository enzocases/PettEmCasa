document.addEventListener('DOMContentLoaded', async function() {
    // Verifica se o usuário está autenticado e é um funcionário
    if (!requireUserType('Funcionario')) {
        return;
    }
    
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.nome;
    }

    await carregarPets();
    await carregarPertences();
});

function toggleMenu() {
    const menuMobile = document.getElementById("menu-mobile")
    if(menuMobile.className === "menu-mobile-active") {
        menuMobile.className = "menu-mobile"
    } else {
        menuMobile.className = "menu-mobile-active"
    }
}

// Funções para manipulação dos modais
function abrirModalAdicionar() {
    document.getElementById('modal-adicionar').style.display = 'flex';
}

function fecharModalAdicionar() {
    document.getElementById('modal-adicionar').style.display = 'none';
    document.getElementById('pet-select').value = '';
    document.getElementById('cama-pertence').checked = false;
    document.getElementById('coberta-pertence').checked = false;
    document.getElementById('brinquedo-pertence').checked = false;
    document.getElementById('vasilha-comida-pertence').checked = false;
    document.getElementById('vasilha-agua-pertence').checked = false;
    document.getElementById('coleira-pertence').checked = false;
    document.getElementById('demais-pertences').value = '';
}

function abrirModalEditar(pertence) {
    const modal = document.getElementById('modal-editar');
    document.getElementById('pertence-id').value = pertence.id;
    document.getElementById('pet-select-edit').value = pertence.petId;
    document.getElementById('cama-pertence-edit').checked = pertence.cama;
    document.getElementById('coberta-pertence-edit').checked = pertence.coberta;
    document.getElementById('brinquedo-pertence-edit').checked = pertence.brinquedo;
    document.getElementById('vasilha-comida-pertence-edit').checked = pertence.vasilhaComida;
    document.getElementById('vasilha-agua-pertence-edit').checked = pertence.vasilhaAgua;
    document.getElementById('coleira-pertence-edit').checked = pertence.coleira;
    document.getElementById('demais-pertences-edit').value = pertence.demaisPertences || '';
    modal.style.display = 'flex';
}

function fecharModalEditar() {
    document.getElementById('modal-editar').style.display = 'none';
}

function abrirModalExcluir(pertenceId) {
    pertenceIdParaExcluir = pertenceId;
    document.getElementById('modal-excluir').style.display = 'flex';
}

function fecharModalExcluir() {
    pertenceIdParaExcluir = null;
    document.getElementById('modal-excluir').style.display = 'none';
}

// Funções para interação com a API
async function carregarPets() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas/active-pets`);
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                alert('Sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.');
                logout();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pets = await response.json();
        
        const selectPet = document.getElementById('pet-select');
        const selectPetEdit = document.getElementById('pet-select-edit');
        
        // Limpa as opções existentes
        selectPet.innerHTML = '<option value="">Selecione o pet</option>';
        selectPetEdit.innerHTML = '<option value="">Selecione o pet</option>';
        
        if (pets.length === 0) {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "Não há pets hospedados no momento";
            option.disabled = true;
            
            selectPet.appendChild(option);
            selectPetEdit.appendChild(option.cloneNode(true));
            return;
        }
        
        pets.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.idPet;
            option.textContent = `${pet.nome} (Tutor: ${pet.Reservas[0].Tutor.nome})`;
            
            selectPet.appendChild(option);
            selectPetEdit.appendChild(option.cloneNode(true));
        });
    } catch (error) {
        console.error('Erro ao carregar pets:', error);
        if (error.message.includes('não autenticado')) {
            alert('Por favor, faça login para continuar.');
            window.location.href = '../../pages/login/login.html';
        } else {
            alert('Erro ao carregar a lista de pets. Por favor, tente novamente.');
        }
    }
}

async function carregarPertences() {
    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/pertences`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const pertences = await response.json();
        
        const container = document.querySelector('.card-container');
        container.innerHTML = '';
        
        if (pertences.length === 0) {
            container.innerHTML = '<p>Nenhum pertence cadastrado.</p>';
            return;
        }

        pertences.forEach(pertence => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Criar lista de pertences ativos
            const pertencesAtivos = [];
            if (pertence.cama) pertencesAtivos.push('Cama');
            if (pertence.coberta) pertencesAtivos.push('Coberta');
            if (pertence.brinquedo) pertencesAtivos.push('Brinquedo');
            if (pertence.vasilhaComida) pertencesAtivos.push('Vasilha de Comida');
            if (pertence.vasilhaAgua) pertencesAtivos.push('Vasilha de Água');
            if (pertence.coleira) pertencesAtivos.push('Coleira');

            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">Pertences de ${pertence.petNome}</h3>
                    <div class="card-actions">
                        <button onclick="abrirModalEditar(${JSON.stringify(pertence).replace(/"/g, '&quot;')})">
                            <i class="material-symbols-outlined">edit</i>
                        </button>
                        <button onclick="abrirModalExcluir(${pertence.id})">
                            <i class="material-symbols-outlined">delete</i>
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="pertences-list">
                        ${pertencesAtivos.map(item => `<span class="pertence-item active">${item}</span>`).join('')}
                    </div>
                    ${pertence.demaisPertences ? `<p><strong>Demais pertences:</strong> ${pertence.demaisPertences}</p>` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Erro ao carregar pertences:', error);
        alert('Erro ao carregar os pertences. Por favor, tente novamente.');
    }
}

async function adicionarPertence(event) {
    event.preventDefault();
    
    const petId = document.getElementById('pet-select').value;
    const cama = document.getElementById('cama-pertence').checked;
    const coberta = document.getElementById('coberta-pertence').checked;
    const brinquedo = document.getElementById('brinquedo-pertence').checked;
    const vasilhaComida = document.getElementById('vasilha-comida-pertence').checked;
    const vasilhaAgua = document.getElementById('vasilha-agua-pertence').checked;
    const coleira = document.getElementById('coleira-pertence').checked;
    const demaisPertences = document.getElementById('demais-pertences').value;

    if (!petId) {
        alert('Por favor, selecione um pet.');
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/pertences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cama,
                coberta,
                brinquedo,
                vasilhaComida,
                vasilhaAgua,
                coleira,
                demaisPertences,
                idPet: parseInt(petId)
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Pertences adicionados com sucesso!');
        fecharModalAdicionar();
        carregarPertences();
        event.target.reset();
    } catch (error) {
        console.error('Erro ao adicionar pertences:', error);
        alert('Erro ao adicionar os pertences. Por favor, tente novamente.');
    }
}

async function editarPertence(event) {
    event.preventDefault();
    
    const id = document.getElementById('pertence-id').value;
    const petId = document.getElementById('pet-select-edit').value;
    const cama = document.getElementById('cama-pertence-edit').checked;
    const coberta = document.getElementById('coberta-pertence-edit').checked;
    const brinquedo = document.getElementById('brinquedo-pertence-edit').checked;
    const vasilhaComida = document.getElementById('vasilha-comida-pertence-edit').checked;
    const vasilhaAgua = document.getElementById('vasilha-agua-pertence-edit').checked;
    const coleira = document.getElementById('coleira-pertence-edit').checked;
    const demaisPertences = document.getElementById('demais-pertences-edit').value;

    if (!petId) {
        alert('Por favor, selecione um pet.');
        return;
    }

    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/pertences/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cama,
                coberta,
                brinquedo,
                vasilhaComida,
                vasilhaAgua,
                coleira,
                demaisPertences,
                idPet: parseInt(petId)
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Pertences atualizados com sucesso!');
        fecharModalEditar();
        carregarPertences();
    } catch (error) {
        console.error('Erro ao atualizar pertences:', error);
        alert('Erro ao atualizar os pertences. Por favor, tente novamente.');
    }
}

async function confirmarExclusao() {
    if (!pertenceIdParaExcluir) return;

    try {
        const response = await authenticatedFetch(`${API_BASE_URL}/api/pertences/${pertenceIdParaExcluir}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        alert('Pertence excluído com sucesso!');
        fecharModalExcluir();
        carregarPertences();
    } catch (error) {
        console.error('Erro ao excluir pertence:', error);
        alert('Erro ao excluir o pertence. Por favor, tente novamente.');
    }
}
