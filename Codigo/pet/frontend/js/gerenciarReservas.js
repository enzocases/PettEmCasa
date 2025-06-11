function toggleMenu() {
    const menuMobile = document.getElementById("menu-mobile");
    if (menuMobile) {
      if (menuMobile.className === "menu-mobile-active") {
          menuMobile.className = "menu-mobile";
      } else {
          menuMobile.className = "menu-mobile-active";
      }
    }
  }
  
  let selectedReserva = null;
  
  async function carregarReservas() {
    const loadingElement = document.getElementById("loadingReservas");
    const errorElement = document.getElementById("errorReservas");
    const emptyElement = document.getElementById("emptyReservas");
    const listaReservas = document.getElementById("listaReservas");
    
    // Show loading state
    if (loadingElement) loadingElement.style.display = "block";
    if (errorElement) errorElement.style.display = "none";
    if (emptyElement) emptyElement.style.display = "none";
    if (listaReservas) listaReservas.innerHTML = '';
  
    try {
        const response = await authenticatedFetch("http://localhost:3060/api/reservas");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const reservas = await response.json();
        
        // Hide loading state
        if (loadingElement) loadingElement.style.display = "none";
        
        if (!reservas || reservas.length === 0) {
            // Show empty state
            if (emptyElement) emptyElement.style.display = "block";
            return;
        }
  
        reservas.forEach(reserva => {
            const card = document.createElement("div");
            card.classList.add("reserva-card");
  
            const dataEntrada = new Date(reserva.data_entrada).toLocaleDateString('pt-BR');
            const dataSaida = new Date(reserva.data_saida).toLocaleDateString('pt-BR');
  
            card.innerHTML = `
                <h3>Reserva ${reserva.idReserva}</h3>
                <div class="reserva-status">
                    <span class="status-dot ${reserva.status === 'Ativa' ? 'green' : 'red'}"></span>
                    <span class="status-text">${reserva.status}</span>
                </div>
                <p><strong>Entrada:</strong> ${dataEntrada}</p>
                <p><strong>Saída:</strong> ${dataSaida}</p>
                <div class="reserva-actions">
                    <button class="editar-btn" data-id="${reserva.idReserva}">Editar</button>
                    <button class="cancelar-btn" data-id="${reserva.idReserva}">Excluir</button>
                </div>
            `;
            listaReservas.appendChild(card);
        });
  
        // Add event listeners to buttons
        document.querySelectorAll(".editar-btn").forEach(button => {
            button.addEventListener("click", function () {
                const idReserva = this.getAttribute("data-id");
                const reservaSelecionada = reservas.find(reserva => reserva.idReserva === parseInt(idReserva));
                openModalEditar(reservaSelecionada);
            });
        });
  
        document.querySelectorAll(".cancelar-btn").forEach(button => {
            button.addEventListener("click", function () {
                const idReserva = this.getAttribute("data-id");
                if (confirm("Você tem certeza que deseja excluir esta reserva?")) {
                    excluirReserva(idReserva);
                }
            });
        });
    } catch (error) {
        console.error("Erro ao carregar reservas:", error);
        
        // Hide loading state
        if (loadingElement) loadingElement.style.display = "none";
        
        if (error.message.includes('401')) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            logout();
        } else {
            // Show error state
            if (errorElement) errorElement.style.display = "block";
        }
    }
  }
  
  function openModalEditar(reserva) {
    const entradaFormatada = reserva.data_entrada.split('T')[0];
    const saidaFormatada = reserva.data_saida.split('T')[0];
  
    document.getElementById("entradaEdit").value = entradaFormatada;
    document.getElementById("saidaEdit").value = saidaFormatada;
    document.getElementById("statusEdit").value = reserva.status;
  
    selectedReserva = reserva;
  
    document.getElementById("modalEditar").style.display = "block";
    document.getElementById("modalOverlay").style.display = "block";
  
    // Remove existing event listener to avoid duplicates
    const form = document.getElementById("formEditarReserva");
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
  
    newForm.addEventListener("submit", async function (event) {
        event.preventDefault();
  
        const updatedReserva = {
            dataEntrada: document.getElementById("entradaEdit").value,
            dataSaida: document.getElementById("saidaEdit").value,
            status: document.getElementById("statusEdit").value,
        };
  
        if (new Date(updatedReserva.dataEntrada) > new Date(updatedReserva.dataSaida)) {
            alert("A data de entrada não pode ser posterior à data de saída.");
            return;
        }
  
        try {
            const response = await authenticatedFetch(`http://localhost:3060/api/reservas/${selectedReserva.idReserva}`, {
                method: "PUT",
                body: JSON.stringify(updatedReserva),
            });
  
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
  
            alert("Reserva atualizada com sucesso!");
            closeModal();
            carregarReservas();
        } catch (error) {
            console.error("Erro ao atualizar reserva:", error);
            alert("Erro ao atualizar reserva. Por favor, tente novamente.");
        }
    });
  }
  
  function closeModal() {
    const modalEditar = document.getElementById("modalEditar");
    const modalOverlay = document.getElementById("modalOverlay");
  
    if (modalEditar) modalEditar.style.display = "none";
    if (modalOverlay) modalOverlay.style.display = "none";
  }
  
  async function excluirReserva(idReserva) {
    try {
        const response = await authenticatedFetch(`http://localhost:3060/api/reservas/${idReserva}`, {
            method: 'DELETE',
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        alert("Reserva excluída com sucesso!");
        carregarReservas();
    } catch (error) {
        console.error("Erro ao excluir reserva:", error);
        if (error.message.includes('401')) {
            alert('Sua sessão expirou. Por favor, faça login novamente.');
            logout();
        } else {
            alert("Erro ao excluir reserva. Por favor, tente novamente.");
        }
    }
  }
  
  // Initialize when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    // Check authentication first
    if (!requireAuth()) {
        return;
    }
    
    // Load reservations
    carregarReservas();
  
    // Add event listener for close button
    const closeButton = document.getElementById("fecharModalEditar");
    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }
  
    // Add event listener for overlay click
    const overlay = document.getElementById("modalOverlay");
    if (overlay) {
        overlay.addEventListener("click", function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
  });