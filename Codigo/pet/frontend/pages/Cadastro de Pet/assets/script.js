document.addEventListener("DOMContentLoaded", () => {
  // Check if user is authenticated
  requireAuth();
});

// Formulário de cadastro
const cadastrarPetForm = document.getElementById('cadastrarPetForm');

// Evento de submissão do formulário
cadastrarPetForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede a recarga da página

  // Captura dos valores dos campos
  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value;
  const raca = document.getElementById('raca').value;
  const genero = document.getElementById('genero').value;
  const porte = document.getElementById('porte').value;

  // Validação dos campos obrigatórios
  if (!nome || !idade || !raca || !genero || !porte) {
    alert('Por favor, preencha todos os campos obrigatórios!');
    return; // Não continua a execução se algum campo obrigatório não for preenchido
  }

  // Se a idade não for um número válido, exibe um erro
  if (isNaN(idade) || idade <= 0) {
    alert('Idade inválida! Por favor, insira um número válido.');
    return;
  }

  // Objeto com os dados do pet
  const novoPet = {
    nome,
    idade,
    raca,
    genero,
    porte
  };

  console.log('Dados do pet:', novoPet);  // Apenas para depuração, pode ser removido depois

  try {
    // Usar authenticatedFetch em vez de fetch regular
    const response = await authenticatedFetch(`${API_BASE_URL}/api/pets`, {
      method: 'POST',
      body: JSON.stringify(novoPet)  // authenticatedFetch já adiciona Content-Type
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert('Pet cadastrado com sucesso!');
    console.log('Pet cadastrado:', data);
    cadastrarPetForm.reset();  // Limpa o formulário após o cadastro
  } catch (error) {
    console.error('Erro ao cadastrar pet:', error);
    if (error.message.includes('401')) {
      alert('Sua sessão expirou. Por favor, faça login novamente.');
      logout();
    } else {
      alert('Ocorreu um erro ao cadastrar o pet. Tente novamente mais tarde.');
    }
  }
});