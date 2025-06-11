document.addEventListener('DOMContentLoaded', function() {
    requireUserType('Funcionario');
    
    if (isAuthenticated()) {
        const user = getCurrentUser();
        if (user) {
            document.getElementById('userName').textContent = user.nome;
        }
    }

    window.toggleMenu = function() {
        const nav = document.querySelector('nav');
        nav.classList.toggle('menu-mobile-active');
    };

    initializeChart();
    fetchHotelCapacity();
});

let capacityChart = null;

function initializeChart() {
    const ctx = document.getElementById('capacityChart').getContext('2d');
    capacityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ocupação do Hotel'],
            datasets: [
                {
                    label: 'Pets Hospedados',
                    data: [0],
                    backgroundColor: '#4CAF50',
                    borderColor: '#45a049',
                    borderWidth: 1
                },
                {
                    label: 'Vagas Disponíveis',
                    data: [0],
                    backgroundColor: '#2196F3',
                    borderColor: '#1976D2',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 12,
                    title: {
                        display: true,
                        text: 'Quantidade'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Ocupação do Hotel',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

async function fetchHotelCapacity() {
    try {
        const response = await authenticatedFetch('http://localhost:3060/api/reservas/active-pets');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateCapacityDisplay(data);
    } catch (error) {
        console.error('Erro ao buscar capacidade do hotel:', error);
        // Atualiza os displays com '-' para indicar erro
        document.getElementById('occupiedSpots').textContent = '-';
        document.getElementById('totalCapacity').textContent = '-';
        document.getElementById('availableSpots').textContent = '-';
        
        // Atualiza o gráfico com valores zerados em caso de erro
        updateChart(0, 12);
    }
}

function updateCapacityDisplay(data) {
    if (data) {
        // Atualiza a quantidade de pets hospedados com base nas reservas ativas
        const petsHospedados = data.length;
        document.getElementById('occupiedSpots').textContent = petsHospedados;
        
        const capacidadeTotal = 12;
        document.getElementById('totalCapacity').textContent = capacidadeTotal;
        
        // Calcula vagas disponíveis
        const vagasDisponiveis = capacidadeTotal - petsHospedados;
        document.getElementById('availableSpots').textContent = vagasDisponiveis;

        // Atualiza o gráfico
        updateChart(petsHospedados, vagasDisponiveis);
    }
}

function updateChart(petsHospedados, vagasDisponiveis) {
    if (capacityChart) {
        capacityChart.data.datasets[0].data = [petsHospedados];
        capacityChart.data.datasets[1].data = [vagasDisponiveis];
        capacityChart.update();
    }
}

