// Seleciona os botões do menu lateral (alert simples)
const editarPerfilBtn = document.getElementById('editarPerfilBtn');
const gerenciarPetBtn = document.getElementById('gerenciarPetBtn');
const boletimBtn = document.getElementById('boletimBtn');
const minhasReservasBtn = document.getElementById('minhasReservasBtn');

editarPerfilBtn.addEventListener('click', () => {
  alert('Editar Perfil clicado!');
});
gerenciarPetBtn.addEventListener('click', () => {
  alert('Gerenciar Pet clicado!');
});
boletimBtn.addEventListener('click', () => {
  alert('Boletim clicado!');
});
minhasReservasBtn.addEventListener('click', () => {
  alert('Minhas Reservas clicado!');
});

/**
 * Função para anexar os eventos de edição e cancelamento em um cartão de reserva.
 * @param {Element} card - Elemento DOM do cartão de reserva.
 */
function attachCardEvents(card) {
  // Evento para editar a reserva
  const editarBtn = card.querySelector('.editar-btn');
  editarBtn.addEventListener('click', function() {
    // Editar o nome da reserva
    const currentTitle = card.querySelector('h3').textContent;
    const newTitle = prompt("Digite o novo nome da reserva:", currentTitle);
    if(newTitle !== null && newTitle.trim() !== "") {
      card.querySelector('h3').textContent = newTitle;
    }
    
    // Seleciona os elementos <p> que contêm Entrada, Saída e Endereço
    const pElements = card.querySelectorAll('p');
    
    // Editar Entrada
    const currentEntrada = pElements[0].textContent.replace("Entrada:", "").trim();
    const newEntrada = prompt("Digite a nova data/hora de entrada:", currentEntrada);
    if(newEntrada !== null && newEntrada.trim() !== "") {
      pElements[0].innerHTML = "<strong>Entrada:</strong> " + newEntrada;
    }
    
    // Editar Saída
    const currentSaida = pElements[1].textContent.replace("Saída:", "").trim();
    const newSaida = prompt("Digite a nova data/hora de saída:", currentSaida);
    if(newSaida !== null && newSaida.trim() !== "") {
      pElements[1].innerHTML = "<strong>Saída:</strong> " + newSaida;
    }
    
    // Editar Endereço
    const currentEndereco = pElements[2].textContent.replace("Endereço:", "").trim();
    const newEndereco = prompt("Digite o novo endereço:", currentEndereco);
    if(newEndereco !== null && newEndereco.trim() !== "") {
      pElements[2].innerHTML = "<strong>Endereço:</strong> " + newEndereco;
    }
    
    // Editar Status da Reserva
    const statusTextElem = card.querySelector('.status-text');
    const currentStatus = statusTextElem.textContent;
    const newStatus = prompt("Digite o novo status da reserva (Confirmada ou Cancelada):", currentStatus);
    if(newStatus !== null && newStatus.trim() !== "") {
      statusTextElem.textContent = newStatus;
      const statusDotElem = card.querySelector('.status-dot');
      if(newStatus.toLowerCase() === "confirmada") {
         statusDotElem.classList.remove('red');
         statusDotElem.classList.add('green');
      } else if(newStatus.toLowerCase() === "cancelada") {
         statusDotElem.classList.remove('green');
         statusDotElem.classList.add('red');
      }
    }
  });

  // Evento para cancelar a reserva
  const cancelarBtn = card.querySelector('.cancelar-btn');
  cancelarBtn.addEventListener('click', function() {
    const confirmCancel = confirm("Deseja realmente cancelar a reserva?");
    if(confirmCancel) {
      const statusDotElem = card.querySelector('.status-dot');
      const statusTextElem = card.querySelector('.status-text');
      statusDotElem.classList.remove('green');
      statusDotElem.classList.add('red');
      statusTextElem.textContent = "Cancelada";
    }
  });
}

// Anexa os eventos aos cartões existentes
const existingCards = document.querySelectorAll('.reserva-card');
existingCards.forEach(card => attachCardEvents(card));

// Função para criar um novo cartão de reserva com valores padrão
function createNewReservationCard() {
  const newCard = document.createElement('div');
  newCard.className = 'reserva-card';
  newCard.innerHTML = `
    <h3>Nova Reserva</h3>
    <div class="reserva-status">
      <span class="status-dot green"></span>
      <span class="status-text">Confirmada</span>
    </div>
    <p><strong>Entrada:</strong> Data/Hora de entrada</p>
    <p><strong>Saída:</strong> Data/Hora de saída</p>
    <p><strong>Endereço:</strong> Endereço</p>
    <div class="reserva-actions">
      <button class="editar-btn">Editar</button>
      <button class="cancelar-btn">Cancelar</button>
    </div>
  `;
  return newCard;
}

// Evento para adicionar uma nova reserva ao clicar no botão "+"
const adicionarReservaBtn = document.getElementById('adicionarReservaBtn');
adicionarReservaBtn.addEventListener('click', () => {
  const reservasContainer = document.querySelector('.reservas-container');
  const newCard = createNewReservationCard();
  reservasContainer.insertAdjacentElement('beforeend', newCard);
  // Anexa os eventos de edição e cancelamento ao novo cartão
  attachCardEvents(newCard);
  alert('Nova reserva criada!');
});
