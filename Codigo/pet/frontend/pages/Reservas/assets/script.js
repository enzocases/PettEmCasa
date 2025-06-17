document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is authenticated
  requireAuth();

  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Use the main endpoint - it already filters by user ID on the backend
    const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const todasReservas = await response.json();
    // Filtra as reservas para mostrar apenas as do usuário atual
    const reservas = todasReservas.filter(r => r.idTutor === user.id);
    console.log('Dados da reserva:', reservas[0]); // Vamos ver a estrutura do primeiro item
    const container = document.querySelector(".card-container");

    if (reservas.length === 0) {
      container.innerHTML = "<p>Você ainda não fez nenhuma reserva.</p>";
      return;
    }

    reservas.forEach((reserva) => {
      const reservaCard = `
        <div class="card" data-id="${reserva.idReserva}">
          <h2>${reserva.Pet?.nome || 'Pet não encontrado'}</h2>
          <p><strong>Pet:</strong> ${reserva.Pet?.nome || 'Pet não encontrado'}</p>
          <p><strong>Entrada:</strong> ${new Date(reserva.data_entrada).toLocaleDateString()}</p>
          <p><strong>Saída:</strong> ${new Date(reserva.data_saida).toLocaleDateString()}</p>
          <p><strong>Status:</strong> <span class="status-text">${reserva.status}</span></p>
          <div class="botoes">
            <button class="editar" onclick="editarReserva(${reserva.idReserva})">Editar</button>
            <button class="excluir" onclick="excluirReserva(${reserva.idReserva})">Cancelar</button>
          </div>
        </div>`;
      container.innerHTML += reservaCard;
    });
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao buscar reservas. Por favor, tente novamente.");
    }
  }
});

async function carregaFiltros() {
  try {
    // A rota /api/pets retorna apenas os pets do tutor logado
    const response = await authenticatedFetch(`${API_BASE_URL}/api/pets`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pets = await response.json();
    const selectPet = document.getElementById("pet-select");
    const selectEditPet = document.getElementById("pet-select-edit");

    selectPet.innerHTML = "";
    selectEditPet.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Selecione";
    selectPet.appendChild(defaultOption);

    pets.forEach((pet) => {
      const option = document.createElement("option");
      option.value = pet.idPet;
      option.textContent = pet.nome;
      selectPet.appendChild(option);
      selectEditPet.appendChild(option.cloneNode(true));
    });
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao buscar pets. Por favor, tente novamente.");
    }
  }

  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/funcionarios`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const funcionarios = await response.json();
    const selectFuncionario = document.getElementById("funcionario-select");
    const selectEditFuncionario = document.getElementById("funcionario-select-edit");

    selectFuncionario.innerHTML = "";
    selectEditFuncionario.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Selecione";
    selectFuncionario.appendChild(defaultOption);

    funcionarios.forEach((funcionario) => {
      const option = document.createElement("option");
      option.value = funcionario.idFuncionario;
      option.textContent = funcionario.nome;
      selectFuncionario.appendChild(option);
      selectEditFuncionario.appendChild(option.cloneNode(true));
    });
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao buscar funcionários. Por favor, tente novamente.");
    }
  }
}

// Funções globais

window.abrirModalAdicionar = function () {
  carregaFiltros();
  const modal = document.getElementById("modal-adicionar");
  modal.style.display = "flex";

  // Reset form and set up event listener
  const form = modal.querySelector("form");
  form.reset();
  form.onsubmit = adicionarReserva;
};

window.adicionarReserva = async function (event) {
  event.preventDefault();

  const form = event.target;
  const reservaData = {
    idPet: form.querySelector("#pet-select").value,
    idFuncionario: form.querySelector("#funcionario-select").value,
    dataEntrada: form.querySelector("#data-inicio").value,
    dataSaida: form.querySelector("#data-fim").value,
    status: "Pendente",
  };
  if (!reservaData.idPet || !reservaData.idFuncionario || !reservaData.dataEntrada || !reservaData.dataSaida) {
    alert("Por favor, preencha todos os campos.");
    return;
  }
  if (new Date(reservaData.dataEntrada) < new Date()) {
    alert("A data de entrada não pode ser no passado.");
    return;
  }
  if (new Date(reservaData.dataSaida) < new Date()) {
    alert("A data de saída não pode ser no passado.");
    return;
  }
  if (new Date(reservaData.dataEntrada) > new Date(reservaData.dataSaida)) {
    alert("A data de entrada deve ser anterior à data de saída.");
    return;
  }

  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/reservas`,
      {
        method: "POST",
        body: JSON.stringify(reservaData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert("Reserva feita com sucesso");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao fazer a reserva:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao fazer a reserva. Por favor, tente novamente.");
    }
  } finally {
    fecharModalAdicionar();
  }
};

let flag = false;

window.editarReserva = async function (id) {
  if (!flag) {
    carregaFiltros();
    flag = true;
  }
  
  const modal = document.getElementById("modal-editar");
  modal.style.display = "flex";

  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/reservas/${id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reserva = await response.json();
    const form = modal.querySelector("#modal-editar form");
    form.querySelector("#pet-select-edit").value = reserva.idPet;
    form.querySelector("#funcionario-select-edit").value = reserva.idFuncionario;
    console.log(reserva);
    form.querySelector("#data-inicio-edit").value = new Date(reserva.data_entrada).toISOString().split("T")[0];
    form.querySelector("#data-fim-edit").value = new Date(reserva.data_saida).toISOString().split("T")[0];

    modal.querySelector("#modal-editar form").dataset.idReserva = reserva.idReserva;
  } catch (error) {
    console.error("Erro ao carregar reserva:", error);
    alert("Erro ao carregar dados do reserva.");
    fecharModalEditar();
  }
};

window.salvarEdicao = async function (event) {
  event.preventDefault();

  const form = event.target; 

  const id = form.dataset.idReserva;
  const reservaData = {
    idPet: form.querySelector("#pet-select-edit").value,
    idFuncionario: form.querySelector("#funcionario-select-edit").value,
    dataEntrada: form.querySelector("#data-inicio-edit").value,
    dataSaida: form.querySelector("#data-fim-edit").value,
    status: "Pendente",
  };
  if (!reservaData.idPet || !reservaData.idFuncionario || !reservaData.dataEntrada || !reservaData.dataSaida) {
    alert("Por favor, preencha todos os campos.");
    return;
  }
  if (new Date(reservaData.dataEntrada) < new Date()) {
    alert("A data de entrada não pode ser no passado.");
    return;
  }
  if (new Date(reservaData.dataSaida) < new Date()) {
    alert("A data de saída não pode ser no passado.");
    return;
  }
  if (new Date(reservaData.dataEntrada) > new Date(reservaData.dataSaida)) {
    alert("A data de entrada deve ser anterior à data de saída.");
    return;
  }

  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/reservas/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(reservaData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedPet = await response.json();
    alert("Reserva atualizada com sucesso");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao editar reserva:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao atualizar reserva. Por favor, tente novamente.");
    }
  }
};

window.excluirReserva = function (id) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";

  modal.querySelector(".excluir").onclick = async function () {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/reservas/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Reserva cancelada com sucesso");
      document.querySelector(`.card[data-id="${id}"]`).remove();
      fecharModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      if (error.message.includes("401")) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        logout();
      } else {
        alert("Erro ao cancelar reserva. Por favor, tente novamente.");
      }
    }
  };
};

window.fecharModal = function () {
  document.getElementById("modal").style.display = "none";
};

window.fecharModalEditar = function () {
  document.getElementById("modal-editar").style.display = "none";
};

window.fecharModalAdicionar = function () {
  document.getElementById("modal-adicionar").style.display = "none";
};
