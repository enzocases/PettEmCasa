document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is authenticated
  requireAuth();

  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/api/pets`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pets = await response.json();
    const container = document.querySelector(".card-container");

    if (pets.length === 0) {
      container.innerHTML = "<p>Você ainda não tem pets cadastrados.</p>";
      return;
    }

    pets.forEach((pet) => {
      const petCard = `
        <div class="card" data-id="${pet.idPet}">
          <h2>${pet.nome}</h2>
          <p class="raca">${pet.raca}</p>
          <div class="botoes">
            <button class="editar" onclick="editarPet(${pet.idPet})">Editar</button>
            <button class="excluir" onclick="excluirPet(${pet.idPet})">Excluir</button>
          </div>
        </div>`;
      container.innerHTML += petCard;
    });
  } catch (error) {
    console.error("Erro ao buscar pets:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao carregar pets. Por favor, tente novamente.");
    }
  }
});

// Funções globais

window.abrirModalAdicionar = function () {
  const modal = document.getElementById("modal-adicionar");
  modal.style.display = "flex";

  // Reset form and set up event listener
  const form = modal.querySelector("form");
  form.reset();
  form.onsubmit = adicionarPet;
};

window.adicionarPet = async function () {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const raca = document.getElementById("raca").value;
  const genero = document.getElementById("genero").value;
  const porte = document.getElementById("porte").value;

  const petData = { nome, idade, raca, genero, porte };

  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/pets`,
      {
        method: "POST",
        body: JSON.stringify(petData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    alert("Pet adicionado com sucesso");
    window.location.reload();
  } catch (error) {
    console.error("Erro ao adicionar pet:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao adicionar pet. Por favor, tente novamente.");
    }
  } finally {
    fecharModalAdicionar();
  }
};

window.editarPet = async function (id) {
  const modal = document.getElementById("modal-editar");
  modal.style.display = "flex";

  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/pets/${id}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pet = await response.json();
    document.getElementById("edit-nome").value = pet.nome;
    document.getElementById("edit-idade").value = pet.idade;
    document.getElementById("edit-raca").value = pet.raca;
    document.getElementById("edit-genero").value = pet.genero;
    document.getElementById("edit-porte").value = pet.porte;

    modal.querySelector("#modal-editar form").dataset.idPet = pet.idPet;
  } catch (error) {
    console.error("Erro ao carregar pet:", error);
    alert("Erro ao carregar dados do pet.");
    fecharModalEditar();
  }
};

window.salvarEdicao = async function (event) {
  event.preventDefault();

  const form = event.target;
  const id = form.dataset.idPet;
  const nome = document.getElementById("edit-nome").value;
  const idade = document.getElementById("edit-idade").value;
  const raca = document.getElementById("edit-raca").value;
  const genero = document.getElementById("edit-genero").value;
  const porte = document.getElementById("edit-porte").value;

  const petData = { nome, idade, raca, genero, porte };

  try {
    const response = await authenticatedFetch(
      `${API_BASE_URL}/api/pets/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(petData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedPet = await response.json();
    alert("Pet atualizado com sucesso");
    const petCard = document.querySelector(`.card[data-id="${id}"]`);
    petCard.querySelector("h2").textContent = updatedPet.nome;
    petCard.querySelector(".raca").textContent = updatedPet.raca;
    fecharModalEditar();
  } catch (error) {
    console.error("Erro ao editar pet:", error);
    if (error.message.includes("401")) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      logout();
    } else {
      alert("Erro ao atualizar pet. Por favor, tente novamente.");
    }
  }
};

window.excluirPet = function (id) {
  const modal = document.getElementById("modal");
  modal.style.display = "flex";

  modal.querySelector(".excluir").onclick = async function () {
    try {
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/pets/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Pet excluído com sucesso");
      document.querySelector(`.card[data-id="${id}"]`).remove();
      fecharModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      if (error.message.includes("401")) {
        alert("Sua sessão expirou. Por favor, faça login novamente.");
        logout();
      } else {
        alert("Erro ao excluir pet. Por favor, tente novamente.");
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
