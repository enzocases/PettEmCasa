document.addEventListener("DOMContentLoaded", () => {
    if (!requireUserType('Funcionario')) {
        return;
    }

    function recarregarPagina() {
        location.reload();
    }

    const carregarAcomodacoes = async () => {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/api/acomodacoes`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const acomodacaoSection = document.querySelector(".acomodacoes");

            configurarModal(
                document.getElementById("abrirModalAdicionar"),
                document.getElementById("fecharModalAdicionar"),
                document.getElementById("modalAdicionar")
            );

            data.forEach(acomodacao => {
                const card = document.createElement("div");
                card.classList.add("card-reserva");

                card.innerHTML = `
                    <h2>${acomodacao.nome}</h2>
                    <p class="tipo">${acomodacao.tipo}</p>
                    <p class="quantidadePets">Quantidade de Pets: ${acomodacao.quantidadePets}</p>
                    <button class="editar" id="abrirModalEditar-${acomodacao.id}">Editar</button>
                    <button class="excluir" id="abrirModalExcluir-${acomodacao.id}">Excluir</button>
                `;

                acomodacaoSection.appendChild(card);

                const botaoAbrirEditar = document.getElementById(`abrirModalEditar-${acomodacao.id}`);
                if (botaoAbrirEditar) {
                    botaoAbrirEditar.addEventListener("click", () => abrirModalEditar(acomodacao.id));
                }
                
                const botaoAbrirExcluir = document.getElementById(`abrirModalExcluir-${acomodacao.id}`);
                if (botaoAbrirExcluir) {
                    botaoAbrirExcluir.addEventListener("click", () => abrirModalExcluir(acomodacao.id));
                }
            });
        } catch (error) {
            console.error("Erro ao carregar acomodações:", error);
            if (error.message.includes('401')) {
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                logout();
            } else {
                alert("Erro ao carregar acomodações. Por favor, tente novamente mais tarde.");
            }
        }
    };

    async function abrirModalEditar(id) {
        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/api/acomodacoes/${id}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            document.getElementById("editar-nome").value = data.nome;
            document.getElementById("editar-tipo").value = data.tipo;
            document.getElementById("editar-quantidadePets").value = data.quantidadePets;
            document.getElementById("editar-id").value = data.id;

            document.getElementById("modalEditar").style.display = "block";
            document.getElementById("modalOverlay").style.display = "block";
        } catch (error) {
            console.error("Erro ao buscar acomodação:", error);
            alert("Erro ao buscar detalhes da acomodação. Por favor, tente novamente.");
        }
    }

    function abrirModalExcluir(id) {
        document.getElementById("excluir-id").value = id;
        document.getElementById("modalExcluir").style.display = "block";
        document.getElementById("modalOverlay").style.display = "block";
    }

    function configurarModal(botaoAbrir, botaoFechar, modal) {
        const overlay = document.getElementById("modalOverlay");

        if (!botaoAbrir || !botaoFechar || !modal) {
            console.error("Elemento(s) não encontrado(s):", botaoAbrir, botaoFechar, modal);
            return;
        }

        botaoAbrir.addEventListener("click", () => {
            modal.style.display = "block";
            overlay.style.display = "block";
        });

        botaoFechar.addEventListener("click", () => {
            modal.style.display = "none";
            overlay.style.display = "none";
        });

        overlay.addEventListener("click", () => {
            modal.style.display = "none";
            overlay.style.display = "none";
        });
    }

    document.getElementById("salvarNovaAcomodacao").addEventListener("click", async function () {
        const nome = document.getElementById("nome").value;
        const tipo = document.getElementById("tipo").value;
        const quantidadePets = document.getElementById("quantidadePets").value;

        const quantidadePetsNumerica = parseInt(quantidadePets, 10);

        if (!nome || !tipo || isNaN(quantidadePetsNumerica) || quantidadePetsNumerica < 0) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        const novaAcomodacao = { nome, tipo, quantidadePets: quantidadePetsNumerica };

        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/api/acomodacoes`, {
                method: "POST",
                body: JSON.stringify(novaAcomodacao),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            document.getElementById("modalAdicionar").style.display = "none";
            document.getElementById("modalOverlay").style.display = "none";
            
            alert("Acomodação adicionada com sucesso!");
            recarregarPagina();
        } catch (error) {
            console.error("Erro ao adicionar acomodação:", error);
            alert("Erro ao adicionar acomodação. Por favor, tente novamente.");
        }
    });

    document.getElementById("salvarEditarAcomodacao").addEventListener("click", async function () {
        const nome = document.getElementById("editar-nome").value;
        const tipo = document.getElementById("editar-tipo").value;
        const quantidadePets = document.getElementById("editar-quantidadePets").value;
        const id = document.getElementById("editar-id").value;

        if (!nome || !tipo || !quantidadePets) {
            alert("Por favor, preencha todos os campos corretamente.");
            return;
        }

        const acomodacaoAtualizada = { nome, tipo, quantidadePets };

        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/api/acomodacoes/${id}`, {
                method: "PUT",
                body: JSON.stringify(acomodacaoAtualizada),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            document.getElementById("modalEditar").style.display = "none";
            document.getElementById("modalOverlay").style.display = "none";
            
            alert("Acomodação atualizada com sucesso!");
            recarregarPagina();
        } catch (error) {
            console.error("Erro ao editar acomodação:", error);
            alert("Erro ao atualizar acomodação. Por favor, tente novamente.");
        }
    });

    document.getElementById("confirmarExclusao").addEventListener("click", async function () {
        const id = document.getElementById("excluir-id").value;

        try {
            const response = await authenticatedFetch(`${API_BASE_URL}/api/acomodacoes/${id}`, {
                method: "DELETE",
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            document.getElementById("modalExcluir").style.display = "none";
            document.getElementById("modalOverlay").style.display = "none";
            
            alert("Acomodação excluída com sucesso!");
            recarregarPagina();
        } catch (error) {
            console.error("Erro ao excluir acomodação:", error);
            alert("Erro ao excluir acomodação. Por favor, tente novamente.");
        }
    });

    document.querySelectorAll(".fechar-modal, .cancelar-modal").forEach(button => {
        button.addEventListener("click", function() {
            document.querySelectorAll(".modal").forEach(modal => {
                modal.style.display = "none";
            });
            document.getElementById("modalOverlay").style.display = "none";
        });
    });

    carregarAcomodacoes();
});