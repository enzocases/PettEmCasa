document.addEventListener("DOMContentLoaded", async () => {
    // Check authentication first
    if (!requireAuth()) {
        return;
    }
    
    // Load pets for the dropdown
    await carregarPets();
    
    // Set up form submission
    const formReserva = document.getElementById("formReserva");
    if (formReserva) {
        formReserva.addEventListener("submit", handleFormSubmission);
    }
  });
  
  async function carregarPets() {
      const selectPets = document.getElementById("pets");
      
      try {
          // Show loading state
          selectPets.innerHTML = '<option value="">Carregando pets...</option>';
          selectPets.disabled = true;
          
          const response = await authenticatedFetch(`${API_BASE_URL}/api/pets`);
          
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const pets = await response.json();
          
          // Clear loading state
          selectPets.innerHTML = "";
          selectPets.disabled = false;
          
          if (pets.length === 0) {
              const option = document.createElement("option");
              option.value = "";
              option.innerText = "Não há pets cadastrados.";
              option.disabled = true;
              option.selected = true;
              selectPets.appendChild(option);
              
              alert("Você não tem pets cadastrados. Por favor, cadastre um pet primeiro.");
              
              // Redirect to pet registration
              setTimeout(() => {
                  window.location.href = "../Cadastro de Pet/index.html";
              }, 2000);
              
              return false;
          } else {
              // Add default option
              const defaultOption = document.createElement("option");
              defaultOption.value = "";
              defaultOption.innerText = "Selecione um pet";
              defaultOption.disabled = true;
              defaultOption.selected = true;
              selectPets.appendChild(defaultOption);
              
              // Add pets to dropdown
              pets.forEach(pet => {
                  const option = document.createElement("option");
                  option.value = pet.idPet;
                  option.innerText = pet.nome;
                  selectPets.appendChild(option);
              });
              return true;
          }
      } catch (error) {
          console.error("Erro ao carregar os pets:", error);
          
          // Reset select state
          selectPets.innerHTML = '<option value="">Erro ao carregar pets</option>';
          selectPets.disabled = false;
          
          if (error.message.includes('401')) {
              alert('Sua sessão expirou. Por favor, faça login novamente.');
              logout();
          } else {
              alert("Erro ao carregar seus pets. Por favor, tente novamente mais tarde.");
          }
          return false;
      }
  }
  
  async function handleFormSubmission(event) {
      event.preventDefault();
  
      const petSelecionado = document.getElementById("pets").value;
      const dataEntrada = document.getElementById("entrada").value;
      const dataSaida = document.getElementById("saida").value;
      const submitButton = event.target.querySelector('button[type="submit"]');
      
      // Validation
      if (!petSelecionado || !dataEntrada || !dataSaida) {
          alert("Todos os campos são obrigatórios!");
          return;
      }
  
      if (new Date(dataEntrada) > new Date(dataSaida)) {
          alert("A data de entrada não pode ser posterior à data de saída.");
          return;
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(dataEntrada) < today) {
          alert("A data de entrada não pode ser no passado.");
          return;
      }
  
      // Prepare reservation data
      const novaReserva = {
          idPet: parseInt(petSelecionado),
          dataEntrada: dataEntrada,
          dataSaida: dataSaida,
          status: "Ativa",
          idFuncionario: 1 // This should be dynamic based on available funcionarios
      };
  
      // Disable submit button during request
      const originalText = submitButton.textContent;
      submitButton.textContent = "Cadastrando...";
      submitButton.disabled = true;
  
      try {
          const response = await authenticatedFetch(`${API_BASE_URL}/api/reservas`, {
              method: "POST",
              body: JSON.stringify(novaReserva)
          });
  
          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
  
          const data = await response.json();
          alert("Reserva cadastrada com sucesso!");
          
          // Reset form
          document.getElementById("formReserva").reset();
          
          // Redirect to reservations list
          setTimeout(() => {
              window.location.href = "../Reservas/index.html";
          }, 1000);
          
      } catch (error) {
          console.error("Erro ao cadastrar reserva:", error);
          
          if (error.message.includes('401')) {
              alert('Sua sessão expirou. Por favor, faça login novamente.');
              logout();
          } else {
              alert(`Erro ao cadastrar reserva: ${error.message || 'Por favor, verifique os dados e tente novamente.'}`);
          }
      } finally {
          // Re-enable submit button
          submitButton.textContent = originalText;
          submitButton.disabled = false;
      }
  }