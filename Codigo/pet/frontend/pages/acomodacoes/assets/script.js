document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    requireAuth();
    carregarAcomodacoes();
});

async function carregarAcomodacoes() {
    try {
        const response = await authenticatedFetch("http://localhost:3060/api/acomodacoes");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const acomodacoes = await response.json();
        const container = document.querySelector(".card-container");

        if (acomodacoes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Nenhuma acomodação cadastrada.</p>
                    <button class="adicionar-acomodacao" onclick="abrirModalAdicionar()">
                        <i class="material-symbols-outlined">add</i>
                        Criar Nova Acomodação
                    </button>
                </div>`;
            return;
        }

        container.innerHTML = '';
        acomodacoes.forEach((acomodacao) => {
            const card = `
                <div class="card" data-id="${acomodacao.idAcomodacao}">
                    <h2>${acomodacao.nome}</h2>
                    <p><strong>Tipo:</strong> ${acomodacao.descricao}</p>
                    <p><strong>Capacidade Máxima:</strong> ${acomodacao.capacidade} pet(s)</p>
                    <p><strong>Ocupação Atual:</strong> ${acomodacao.ocupacaoAtual} pet(s)</p>
                    <div class="botoes">
                        <button class="editar-acomodacao" onclick="editarAcomodacao(${acomodacao.idAcomodacao})">
                            <i class="material-symbols-outlined">edit</i> Editar
                        </button>
                        <button class="excluir-acomodacao" onclick="excluirAcomodacao(${acomodacao.idAcomodacao})">
                            <i class="material-symbols-outlined">delete</i> Excluir
                        </button>
                        <button class="adicionar-pet" onclick="adicionarPet(${acomodacao.idAcomodacao})" ${acomodacao.ocupacaoAtual >= acomodacao.capacidade ? 'disabled' : ''}>
                            <i class="material-symbols-outlined">add</i> Adicionar Pet
                        </button>
                        <button class="remover-pet" onclick="removerPet(${acomodacao.idAcomodacao})" ${acomodacao.ocupacaoAtual <= 0 ? 'disabled' : ''}>
                            <i class="material-symbols-outlined">remove</i> Remover Pet
                        </button>
                    </div>
                </div>`;
            container.innerHTML += card;
        });
    } catch (error) {
        console.error("Erro ao carregar acomodações:", error);
        alert("Erro ao carregar acomodações. Por favor, tente novamente mais tarde.");
    }
}

function abrirModalAdicionar() {
    document.getElementById('modalTitle').textContent = 'Adicionar Acomodação';
    document.getElementById('acomodacaoForm').reset();
    document.getElementById('acomodacaoId').value = '';
    document.getElementById('acomodacaoModal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('acomodacaoModal').style.display = 'none';
}

async function editarAcomodacao(id) {
    try {
        const response = await authenticatedFetch(`http://localhost:3060/api/acomodacoes/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar dados da acomodação");
        
        const acomodacao = await response.json();
        
        document.getElementById('modalTitle').textContent = 'Editar Acomodação';
        document.getElementById('identificacao').value = acomodacao.nome;
        document.getElementById('tipo').value = acomodacao.descricao;
        document.getElementById('capacidade').value = acomodacao.capacidade;
        document.getElementById('acomodacaoId').value = acomodacao.idAcomodacao;
        document.getElementById('acomodacaoModal').style.display = 'block';
    } catch (error) {
        console.error("Erro ao carregar dados da acomodação:", error);
        alert("Erro ao carregar dados da acomodação.");
    }
}

async function excluirAcomodacao(id) {
    if (!confirm("Tem certeza que deseja excluir esta acomodação?")) return;

    try {
        const response = await authenticatedFetch(`http://localhost:3060/api/acomodacoes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao excluir acomodação");
        }

        alert("Acomodação excluída com sucesso!");
        carregarAcomodacoes();
    } catch (error) {
        console.error("Erro ao excluir acomodação:", error);
        alert(error.message);
    }
}

async function adicionarPet(id) {
    try {
        const response = await authenticatedFetch(`http://localhost:3060/api/acomodacoes/${id}/ocupacao`, {
            method: 'PUT',
            body: JSON.stringify({ acao: 'adicionar' })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao adicionar pet");
        }

        carregarAcomodacoes();
    } catch (error) {
        console.error("Erro ao adicionar pet:", error);
        alert(error.message);
    }
}

async function removerPet(id) {
    try {
        const response = await authenticatedFetch(`http://localhost:3060/api/acomodacoes/${id}/ocupacao`, {
            method: 'PUT',
            body: JSON.stringify({ acao: 'remover' })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro ao remover pet");
        }

        carregarAcomodacoes();
    } catch (error) {
        console.error("Erro ao remover pet:", error);
        alert(error.message);
    }
}

document.getElementById('acomodacaoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const capacidade = parseInt(document.getElementById('capacidade').value);
    
    // Validação da capacidade
    if (capacidade <= 0) {
        alert("A capacidade deve ser um número maior que zero.");
        return;
    }
    
    const acomodacaoData = {
        nome: document.getElementById('identificacao').value,
        descricao: document.getElementById('tipo').value,
        capacidade: capacidade
    };

    try {
        const isAdding = document.getElementById('modalTitle').textContent.includes('Adicionar');
        const method = isAdding ? 'POST' : 'PUT';
        const id = document.getElementById('acomodacaoId').value;
        const url = isAdding ? 'http://localhost:3060/api/acomodacoes' : 
                   `http://localhost:3060/api/acomodacoes/${id}`;

        console.log('Dados sendo enviados:', acomodacaoData);
        console.log('URL:', url);

        const response = await authenticatedFetch(url, {
            method: method,
            body: JSON.stringify(acomodacaoData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.log('Resposta do servidor:', errorData);
            throw new Error(errorData?.error || "Erro ao salvar acomodação");
        }

        document.getElementById('acomodacaoModal').style.display = 'none';
        alert(isAdding ? "Acomodação criada com sucesso!" : "Acomodação atualizada com sucesso!");
        carregarAcomodacoes();
    } catch (error) {
        console.error("Erro ao salvar acomodação:", error);
        alert("Erro ao salvar acomodação. Por favor, tente novamente.");
    }
});

function toggleMenu() {
    const menuMobile = document.getElementById("menu-mobile");
    menuMobile.className = menuMobile.className === "menu-mobile-active" ? "menu-mobile" : "menu-mobile-active";
}

function prepararNovaAcomodacao() {
    document.getElementById('acomodacaoForm').innerHTML = `
        <div class="form-group">
            <label for="identificacao">Identificação:</label>
            <input type="text" id="identificacao" required>
        </div>
        <div class="form-group">
            <label for="tipo">Tipo:</label>
            <input type="text" id="tipo" required>
        </div>
        <div class="form-group">
            <label for="capacidade">Capacidade:</label>
            <input type="number" id="capacidade" required>
        </div>
        <input type="hidden" id="acomodacaoId">
        <div class="form-buttons">
            <button type="submit">Salvar</button>
            <button type="button" onclick="fecharModal()">Cancelar</button>
        </div>
    `;
    document.getElementById('modalTitle').textContent = 'Adicionar Acomodação';
    document.getElementById('acomodacaoId').value = '';
}